import { Transaction } from 'sequelize'
import { Word } from '../../models'
import { fetchMerriamWebsterIntermediateDefinitions } from './dictionaryAdapter.service'
import { upsertWordsAndDefinitions } from './wordPersistence.service'

export const ensureWordsInDictionary = async (
  createdByUserId: string,
  targetWords: string[],
  transaction: Transaction
) => {
  // Find all existing Word rows for those targetWords
  const existingWords = await Word.findAll({
    where: {
      text: targetWords,
    },
    transaction,
  })
  const existingTexts = existingWords.map(w => w.text)

  // Figure out which words are missing
  const missingWords = targetWords.filter(w => !existingTexts.includes(w))

  // Fetch definitions from MW for each missing simultaneously
  // TODO load balancing and many sources
  const externalDictionaryResult =
    missingWords.length > 0
      ? await Promise.all(
          missingWords.map(word => fetchMerriamWebsterIntermediateDefinitions(word))
        )
      : []

  const foundResults = externalDictionaryResult.filter(r => r.found)
  const notFoundWords = externalDictionaryResult.filter(r => !r.found).map(r => r.word)

  // For foundResults, extract arrays of definitions
  const definitionsList = foundResults.map(r => r.extractedDefinitions)
  // the word texts in the same order
  const foundTexts = foundResults.map(r => r.word)

  // Persist new Words + their Definitions by calling persistence layer
  const persistResult = await upsertWordsAndDefinitions(
    foundTexts,
    definitionsList,
    'dictionary',
    'Merriam Webster Intermediate dictionary',
    createdByUserId,
    transaction
  )

  return {
    persistedWords: [...existingWords, ...persistResult.insertedWords],
    insertedWords: persistResult.insertedWords,
    existingWords,
    notFoundWords,
    insertedDefinitions: persistResult.insertedDefinitions,
  }
}
