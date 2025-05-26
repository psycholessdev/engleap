import { Card, Definition, Word, CardTargetWord } from '../models'
import { sequelize } from '../../db'
import { Op } from 'sequelize'
import { getMerriamWebsterIntermediateMeaning } from '../schemas/dictionary.service'

export const getCardsByDeckId = async (deckId: string, offset = 0, limit = 10) => {
  // offset tells the database to skip the first N records
  return await Card.findAll({
    where: { deckId },
    offset,
    limit,
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

    // checks what words do not exist
    const existingWords = await Word.findAll({
      where: {
        text: {
          [Op.in]: targetWords,
        },
      },
      transaction,
    })

    // infers the missing words
    const existingWordsValues = existingWords.map(word => word.text)
    const missingWords = targetWords.filter(word => !existingWordsValues.includes(word))

    // fetches the definitions simultaneously
    const fetchedDefinitions = await Promise.all([
      ...missingWords.map(word => getMerriamWebsterIntermediateMeaning(word)),
    ])

    // TODO create inflected forms (stems) as well

    // inserts the words into the database
    const wordsToInsert: string[] = []
    for (const bunchOfDefs of fetchedDefinitions) {
      bunchOfDefs.forEach(def => {
        // checks if the word is already in the list
        // it's important because one word can have many definitions
        if (!wordsToInsert.includes(def.id)) {
          wordsToInsert.push(def.id)
        }
      })
    }
    const insertedWords = await Word.bulkCreate([...wordsToInsert.map(word => ({ text: word }))], {
      transaction,
    })

    // connects words with the card (target words)
    await CardTargetWord.bulkCreate(
      [...insertedWords.map(targetWord => ({ cardId: createdCard.id, wordId: targetWord.id }))],
      { transaction }
    )

    // inserts the definitions into the database
    const definitionEntities: Record<string, unknown>[] = []
    for (const bunchOfDefs of fetchedDefinitions) {
      const wordUuid = insertedWords.find(word => word.text === bunchOfDefs[0].id)?.id
      if (!wordUuid) {
        throw new Error('Failed to get the word associated with a definition')
      }

      for (const def of bunchOfDefs) {
        definitionEntities.push({
          wordId: wordUuid,
          text: def.text,
          partOfSpeech: def.partOfSpeech,
          labels: def.labels,
          syllabifiedWord: def.syllabifiedWord,
          offensive: def.offensive,
          source: 'dictionary',
          sourceName: 'Merriam Webster Intermediate dictionary',
          difficulty: 'B2',
          createdByUserId,
        })
      }
    }
    await Definition.bulkCreate([...definitionEntities], { transaction })

    return createdCard
  })
}
