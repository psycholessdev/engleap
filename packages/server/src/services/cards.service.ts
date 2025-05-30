import { Card, Definition, Word, CardTargetWord, Deck, CardDefinition } from '../models'
import { sequelize } from '../../db'
import { createAutoMeanings, saveWordsAndDefinitions } from '../services'
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
            include: [Definition],
          },
        ],
      },
    ],
  })
}

export const getCardById = async (cardId: string, attributes?: string[]) => {
  return await Card.findByPk(cardId, { attributes })
}

export const getCardByIdWithDeckAndDefinitions = async (cardId: string) => {
  return await Card.findByPk(cardId, {
    include: [
      {
        model: CardTargetWord,
        attributes: ['id'],
        include: [
          {
            model: Word,
            attributes: ['id', 'text'],
            include: [Definition],
          },
        ],
      },
      {
        model: Deck,
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
  definitions?: ExtractedDefinition[][]
) => {
  return await sequelize.transaction(async transaction => {
    const createdCard = await Card.create({ deckId, sentence, createdByUserId }, { transaction })

    const { notFoundWords } = await createCardDefinitions(
      createdCard.id,
      createdByUserId,
      targetWords,
      definitions || [],
      transaction
    )

    return { createdCard, notFoundWords }
  })
}

export const editCard = async (
  cardId: string,
  userId: string,
  sentence: string | undefined,
  targetWords: string[] | undefined,
  definitions?: ExtractedDefinition[][]
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
      await createCardDefinitions(cardId, userId, targetWords, definitions || [], transaction)
    }
  })
}

// creates words, auto and user-defined definitions
// and connects them to the card
export const createCardDefinitions = async (
  cardId: string,
  userId: string,
  targetWords: string[],
  definitions: ExtractedDefinition[][],
  transaction: Transaction
) => {
  // fetches and creates words and their definitions if they do not exist yet
  const {
    insertedWords: autoCreatedWords,
    notFoundWords,
    existingWords,
  } = await createAutoMeanings(userId, targetWords, transaction)

  // saves user-defined definitions
  const { insertedWords: userCreatedWords, insertedDefinitions: userInsertedDefinitions } =
    await saveWordsAndDefinitions(
      targetWords || [],
      definitions || [],
      'user',
      undefined,
      userId,
      transaction
    )

  // infers all words and excludes repetitions
  const allWords: Word[] = []
  for (const word of [...autoCreatedWords, ...userCreatedWords, ...existingWords]) {
    if (!allWords.includes(word)) {
      allWords.push(word)
    }
  }
  console.log('allWords length')
  console.log(allWords.length)

  // connects all created and existing words (target words) with the card
  const cardTargetWords = await CardTargetWord.bulkCreate(
    [...allWords.map(targetWord => ({ cardId, wordId: targetWord.id }))],
    { transaction }
  )

  // prioritizes user-defined definitions
  const cardDefinitionEntities: { cardTargetWordId: string; definitionId: string }[] = []

  for (const def of userInsertedDefinitions) {
    const cardTargetWord = cardTargetWords.find(item => item.wordId == def.wordId)

    if (cardTargetWord) {
      cardDefinitionEntities.push({ cardTargetWordId: cardTargetWord.id, definitionId: def.id })
    }
  }

  await CardDefinition.bulkCreate(cardDefinitionEntities, { transaction })

  return { notFoundWords }
}
