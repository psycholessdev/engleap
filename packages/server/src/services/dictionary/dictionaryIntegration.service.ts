import { Transaction } from 'sequelize'
import { Word } from '../../models'
import { upsertWordsAndDefinitions } from './wordPersistence.service'
import { DefinitionDTO } from '../../types'
import { fetchDefinitionsFromAnySource } from './dictionaryRegistry'

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
      ? await Promise.all(missingWords.map(word => fetchDefinitionsFromAnySource(word)))
      : []

  const foundResults = externalDictionaryResult.filter(r => r.found)
  const notFoundWords = externalDictionaryResult.filter(r => !r.found).map(r => r.word)

  // For foundResults, extract arrays of definitions
  const definitionsRaw = foundResults.map(r => r.extractedDefinitions)
  const definitionsList: DefinitionDTO[] = []
  for (const bunchOfDefs of definitionsRaw) {
    definitionsList.push(...bunchOfDefs)
  }

  // the word texts in the same order
  const foundTexts = foundResults.map(r => r.word)

  // Persist new Words + their Definitions by calling persistence layer
  const persistResult = await upsertWordsAndDefinitions(
    foundTexts,
    definitionsList,
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
