import { Card, Definition, Word, CardTargetWord, Deck } from '../models'
import { sequelize } from '../../db'
import { createAutoMeanings, saveWordsAndDefinitions } from '../services'
import { ExtractedDefinition } from '../types'

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

// creates a cards and related words, fetches and creates definitions and connections between them
export const addCard = async (
  deckId: string,
  sentence: string,
  createdByUserId: string,
  targetWords: string[]
) => {
  return await sequelize.transaction(async transaction => {
    const createdCard = await Card.create({ deckId, sentence, createdByUserId }, { transaction })

    // fetches and creates words and their definitions if they do not exist yet
    const { allWords, notFoundWords } = await createAutoMeanings(
      createdByUserId,
      targetWords,
      transaction
    )

    // connects all created and existing words (target words) with the card
    await CardTargetWord.bulkCreate(
      [...allWords.map(targetWord => ({ cardId: createdCard.id, wordId: targetWord.id }))],
      { transaction }
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
    // checks if both values are defined
    if (sentence && targetWords) {
      await Card.update(
        { sentence, targetWords },
        {
          transaction,
          where: {
            id: cardId,
          },
        }
      )
    }

    if (targetWords) {
      // fetches and creates words and their definitions if they do not exist yet
      const { insertedWords: autoCreatedWords } = await createAutoMeanings(
        userId,
        targetWords,
        transaction
      )

      // saves user-defined definitions
      const { insertedWords: userCreatedWords } = await saveWordsAndDefinitions(
        targetWords || [],
        definitions || [],
        'user',
        undefined,
        userId,
        transaction
      )

      // infers all words and excludes repetitions
      const allWords: Word[] = []
      for (const word of [...autoCreatedWords, ...userCreatedWords]) {
        if (!allWords.includes(word)) {
          allWords.push(word)
        }
      }

      // connects all created and existing words (target words) with the card
      await CardTargetWord.bulkCreate(
        [...allWords.map(targetWord => ({ cardId, wordId: targetWord.id }))],
        { transaction }
      )
    }
  })
}
