import { Card, Word, CardTargetWord, CardDefinition } from '../models'
import { sequelize } from '../../db'
import { ensureWordsInDictionary, upsertWordsAndDefinitions } from '../services'
import { ExtractedDefinition } from '../types'
import { Transaction } from 'sequelize'

export const getCardsByDeckId = async (deckId: string, offset = 0, limit = 10) => {
  // offset tells the database to skip the first N records
  return await Card.findAll({
    where: { deckId },
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
  definitions?: ExtractedDefinition[]
) => {
  return await sequelize.transaction(async transaction => {
    const [createdCard, inserted] = await Card.findOrCreate({
      where: { deckId, sentence, createdByUserId },
      transaction,
    })

    const { notFoundWords } = await linkDefinitionsToCard(
      createdCard.id,
      createdByUserId,
      targetWords,
      definitions || [],
      transaction
    )

    return { createdCard, notFoundWords, inserted }
  })
}

export const editCard = async (
  cardId: string,
  userId: string,
  sentence: string | undefined,
  targetWords: string[] | undefined,
  definitions?: ExtractedDefinition[]
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

      await linkDefinitionsToCard(cardId, userId, targetWords, definitions || [], transaction)
    }
  })
}

// Creates words, auto and user-defined definitions and connects them to the card
// user-defined definitions are connected to the card explicitly (through CardDefinition),
// while dic definitions are connected to the card implicitly
export const linkDefinitionsToCard = async (
  cardId: string,
  createdByUserId: string,
  targetWords: string[],
  definitions: ExtractedDefinition[],
  transaction: Transaction
) => {
  // Auto (dictionary) path: try to fetch+persist missing from Merriam-Webster
  const dictResult = await ensureWordsInDictionary(createdByUserId, targetWords, transaction)

  // User‐provided definitions: persist them
  const userPersisted = await upsertWordsAndDefinitions(
    targetWords || [],
    definitions || [],
    'user',
    undefined,
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
