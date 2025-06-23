import { Op } from 'sequelize'
import { sequelize } from '../../db'
import { Card, Word, CardTargetWord, CardDefinition, UserCardProgress } from '../models'
import { ensureWordsInDictionary, upsertWordsAndDefinitions } from '../services'
import { DefinitionDTO } from '../types'
import { Transaction } from 'sequelize'

export const getCardsByDeckId = async (
  deckId: string,
  query: string | undefined,
  offset = 0,
  limit = 10
) => {
  // offset tells the database to skip the first N records

  const queryFilter = query ? { sentence: { [Op.iLike]: `%${query}%` } } : undefined

  return await Card.findAll({
    where: {
      deckId,
      ...queryFilter,
    },
    offset,
    limit,
    include: [
      {
        model: CardTargetWord,
        attributes: ['id'],
        include: [
          {
            model: Word,
            attributes: ['id', 'text'],
          },
        ],
      },
    ],
  })
}

export const getCardById = async (cardId: string, attributes?: string[]) => {
  return await Card.findByPk(cardId, { attributes })
}

export const getCardByIdWithWords = async (cardId: string) => {
  return await Card.findByPk(cardId, {
    include: [
      {
        model: CardTargetWord,
        attributes: ['id'],
        include: [
          {
            model: Word,
            attributes: ['id', 'text'],
          },
        ],
      },
    ],
  })
}

export const deleteCardById = async (cardId: string) => {
  return await Card.destroy({
    where: {
      id: cardId,
    },
  })
}

// creates a cards and related words, fetches and creates definitions and connections between them
export const addCard = async (
  deckId: string,
  sentence: string,
  createdByUserId: string,
  targetWords: string[],
  definitions?: DefinitionDTO[]
) => {
  return await sequelize.transaction(async transaction => {
    const [createdCard, inserted] = await Card.findOrCreate({
      where: { deckId, sentence, createdByUserId },
      include: [
        {
          model: CardTargetWord,
          attributes: ['id'],
          include: [
            {
              model: Word,
              attributes: ['id', 'text'],
            },
          ],
        },
      ],
      transaction,
    })

    const { notFoundWords } = await linkDefinitionsToCard(
      createdCard.id,
      createdByUserId,
      targetWords,
      definitions || [],
      transaction
    )

    await UserCardProgress.findOrCreate({
      where: {
        userId: createdByUserId,
        cardId: createdCard.id,
      },
      transaction,
    })

    // include the Words after they have been inserted
    await createdCard.reload({ transaction })

    return { createdCard, notFoundWords, inserted }
  })
}

export const editCard = async (
  cardId: string,
  userId: string,
  sentence: string | undefined,
  targetWords: string[] | undefined,
  definitions?: DefinitionDTO[]
) => {
  return await sequelize.transaction(async transaction => {
    if (sentence) {
      await Card.update(
        { sentence },
        {
          transaction,
          where: {
            id: cardId,
          },
        }
      )
    }

    let notFoundNewWords: string[] = []
    if (targetWords) {
      // Syncs targetWords
      // deleted CTWs get deleted
      const cardTargetWords = await CardTargetWord.findAll({
        where: { cardId },
        attributes: ['id'],
        include: [Word],
        transaction,
      })
      const cardTargetWordsIdsToDelete = cardTargetWords
        .filter(ctw => !targetWords.includes(ctw.word.text))
        .map(ctw => ctw.id)
      await CardTargetWord.destroy({
        where: { id: cardTargetWordsIdsToDelete },
        transaction,
      })

      const { notFoundWords } = await linkDefinitionsToCard(
        cardId,
        userId,
        targetWords,
        definitions || [],
        transaction
      )
      notFoundNewWords = notFoundWords
    }

    return { notFoundWords: notFoundNewWords }
  })
}

// Creates words, auto and user-defined definitions and connects them to the card
// user-defined definitions are connected to the card explicitly (through CardDefinition),
// while dic definitions are connected to the card implicitly
export const linkDefinitionsToCard = async (
  cardId: string,
  createdByUserId: string,
  targetWords: string[],
  definitions: DefinitionDTO[],
  transaction: Transaction
) => {
  // Auto (dictionary) path: try to fetch+persist missing from Merriam-Webster
  const dictResult = await ensureWordsInDictionary(createdByUserId, targetWords, transaction)

  // User‐provided definitions: persist them
  const userPersisted = await upsertWordsAndDefinitions(
    targetWords || [],
    definitions || [],
    createdByUserId,
    transaction
  )

  // Build union of all Word[] without duplicates
  const uniqueWordMap: Record<string, Word> = {}
  for (const w of [...dictResult.persistedWords, ...userPersisted.allWords]) {
    uniqueWordMap[w.id] = w
  }
  const allWords = Object.values(uniqueWordMap)

  // links all created and existing words (target words) with the card
  // if they weren't before
  const ctwRecords = allWords.map(w => ({ cardId, wordId: w.id }))
  const cardTargetWordRows: CardTargetWord[] = []
  for (const ctwRec of ctwRecords) {
    const [row] = await CardTargetWord.findOrCreate({
      where: ctwRec,
      transaction,
    })
    cardTargetWordRows.push(row)
  }

  // For each user definition, find the right CardTargetWord row,
  // then link them if they weren't before
  for (const def of userPersisted.insertedDefinitions) {
    const ctw = cardTargetWordRows.find(r => r.wordId == def.wordId)
    if (ctw) {
      await CardDefinition.findOrCreate({
        where: { cardTargetWordId: ctw.id, definitionId: def.id },
        transaction,
      })
    }
  }

  return { notFoundWords: dictResult.notFoundWords }
}
