const { MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY } = process.env
import { MerriamWebsterResponse } from '../types'
import { extractDefinitions } from '../services/utils'

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
