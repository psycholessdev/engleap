import { $axios } from '@/api/baseApi'

export interface Definition {
  id: string
  wordId: string
  audio?: string
  text: string
  partOfSpeech:
    | 'noun'
    | 'pronoun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'phrasal verb'
    | 'idiom'
    | 'preposition'
    | 'conjunction'
    | 'interjection'
  labels: string[]
  syllabifiedWord: string
  offensive: boolean
  source: 'dictionary' | 'user'
  sourceName?: string
  approved: boolean
  createdByUserId: string
}

type GetDefinitionsForCardResponse = Definition[]

export const getDefinitionsForCard = async (
  cardId: string,
  offset: number,
  limit: number
): Promise<GetDefinitionsForCardResponse> => {
  const res = await $axios.get(`/definitions/card/${cardId}`, {
    params: { offset, limit },
  })
  return res.data
}

export const deleteDefinition = async (defId: string) => {
  await $axios.delete(`/definitions/${defId}`)
}
