import { Transaction } from 'sequelize'

const { MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY } = process.env
import { ExtractedDefinition, MerriamWebsterResponse } from '../types'
import { extractDefinitions } from './utils'
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

  return extractDefinitions(word, result)
}

// fetches and creates words and their definitions if they do not exist yet
export const createAutoMeanings = async (
  createdByUserId: string,
  targetWords: string[],
  transaction: Transaction
) => {
  // checks what words do not exist
  const existingWords = await Word.findAll({
    where: {
      text: targetWords,
    },
    transaction,
  })

  // infers the missing words
  const existingWordsValues = existingWords.map(word => word.text)
  const missingWords = targetWords.filter(word => !existingWordsValues.includes(word))

  // fetches the definitions simultaneously
  // TODO load balancing and many sources
  const dictionaryServiceResults =
    missingWords.length > 0
      ? await Promise.all([...missingWords.map(word => getMerriamWebsterIntermediateMeaning(word))])
      : []
  const fetchedDefinitions = dictionaryServiceResults
    .filter(result => result.found)
    .map(result => result.extractedDefinitions)
  const notFoundWords = dictionaryServiceResults.filter(result => !result.found)

  // saves the words and definitions
  const { insertedWords } = await saveWordsAndDefinitions(
    targetWords,
    fetchedDefinitions,
    'dictionary',
    'Merriam Webster Intermediate dictionary',
    createdByUserId,
    transaction
  )

  return {
    insertedWords,
    existingWords,
    allWords: [...insertedWords, ...existingWords],
    notFoundWords,
  }
}

export const saveWordsAndDefinitions = async (
  targetWords: string[],
  definitions: ExtractedDefinition[][],
  source: 'dictionary' | 'user',
  sourceName: 'Merriam Webster Intermediate dictionary' | undefined,
  createdByUserId: string,
  transaction: Transaction
) => {
  const defsOrWordsNotProvided =
    !targetWords || targetWords.length === 0 || !definitions || definitions.length === 0
  if (defsOrWordsNotProvided) {
    return {
      existingWords: [],
      insertedWords: [],
      allWords: [],
      insertedDefinitions: [],
    }
  }

  // inserts the words into the database
  const existingWords = await Word.findAll({
    where: {
      text: targetWords,
    },
    transaction,
  })
  const existingWordsList = existingWords.map(word => word.text)
  const wordsToInsert = targetWords.filter(word => !existingWordsList.includes(word))

  const insertedWords =
    wordsToInsert.length > 0
      ? await Word.bulkCreate([...wordsToInsert.map(word => ({ text: word }))], {
          transaction,
        })
      : []

  // inserts the definitions into the database
  const allWords = [...existingWords, ...insertedWords]
  const definitionsToInsert: Record<string, unknown>[] = []

  for (const bunchOfDefs of definitions) {
    // one word can have many definitions here
    const wordUuid = allWords.find(word => word.text === bunchOfDefs[0].word)?.id
    if (!wordUuid) {
      throw new Error('Failed to get the word associated with a definition')
    }

    for (const def of bunchOfDefs) {
      definitionsToInsert.push({
        wordId: wordUuid,
        text: def.text,
        partOfSpeech: def.partOfSpeech,
        labels: def.labels,
        syllabifiedWord: def.syllabifiedWord,
        offensive: def.offensive,
        source,
        sourceName,
        difficulty: 'B2',
        createdByUserId,
      })
    }
  }

  const insertedDefinitions =
    definitionsToInsert.length > 0
      ? await Definition.bulkCreate([...definitionsToInsert], { transaction })
      : []

  return {
    existingWords,
    insertedWords,
    allWords,
    insertedDefinitions,
  }
}
