import { $axios } from '@/api/baseApi'

export interface Definition {
  id: string
  wordId: string
  audio?: string
  text: string
  partOfSpeech: string
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
  cardId: string
): Promise<GetDefinitionsForCardResponse> => {
  const res = await $axios.get(`/definitions/card/${cardId}`)
  return res.data
}
