import { IDictionaryService } from './baseDictionaryService'
import { MerriamWebsterIntermediateService } from './merriamWebsterIntermediateService'
import type { DictionaryServiceResult } from '../../types'
import { getCachedServiceResponse, cacheServiceResponse } from '../../services'

const services: IDictionaryService[] = [new MerriamWebsterIntermediateService()]

// Fetch definitions using available services in order, until found
// If a service returns found=true, return that result.
export async function fetchDefinitionsFromAnySource(
  word: string
): Promise<DictionaryServiceResult> {
  const similarWordsAggregated: Set<string> = new Set()

  for (const service of services) {
    try {
      const cachedNotFound = await getCachedServiceResponse(service.sourceName, word)
      if (cachedNotFound) {
        cachedNotFound.similarWords.forEach(w => similarWordsAggregated.add(w))
        continue
      }

      const result = await service.fetchDefinitions(word)
      if (!result.found) {
        await cacheServiceResponse(service.sourceName, word, result.similarWords)
        result.similarWords.forEach(w => similarWordsAggregated.add(w))
        continue
      }

      return result
    } catch (err) {
      console.error(`Error in ${service.sourceName}:`, err)
    }
  }
  // None found: return aggregated suggestions
  return {
    word,
    found: false,
    extractedDefinitions: [],
    similarWords: Array.from(similarWordsAggregated),
  }
}
