import { Transaction, Op } from 'sequelize'

const { MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY } = process.env
import { MerriamWebsterResponse } from '../types'
import { extractDefinitions } from '../services/utils'
import { Definition, Word } from '../models'

export const getMerriamWebsterIntermediateMeaning = async (word: string) => {
  if (!MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY) {
    throw new Error('Failed to get MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY')
  }

  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/sd3/json/${word}?key=${MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY}`
  )
  if (!response.ok) {
    throw new Error('Failed to get the meaning')
  }
  const result = (await response.json()) as MerriamWebsterResponse

  return extractDefinitions(result)
}

// fetches and creates words and their definitions if they do not exist yet
export const createMeanings = async (
  createdByUserId: string,
  targetWords: string[],
  transaction: Transaction
) => {
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
  const dictionaryServiceResults =
    missingWords.length > 0
      ? await Promise.all([...missingWords.map(word => getMerriamWebsterIntermediateMeaning(word))])
      : []
  const fetchedDefinitions = dictionaryServiceResults
    .filter(result => result.found)
    .map(result => result.extractedDefinitions)

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

  // inserts the definitions into the database
  const definitionEntities: Record<string, unknown>[] = []
  for (const bunchOfDefs of fetchedDefinitions) {
    // one word can have many definitions here
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

  return { insertedWords, existingWords, allWords: [...insertedWords, ...existingWords] }
}
