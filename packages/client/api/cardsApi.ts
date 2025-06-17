import { $axios } from '@/api/baseApi'

export interface Card {
  id: string
  deckId: string
  sentence: string
  createdByUserId: string
  targetWords: TargetWord[]
}

export interface TargetWord {
  id: string
  word: {
    id: string
    text: string
  }
}

export interface UserProvidedDefinition {
  sourceEntryId: string
  word: string
  text: string
  partOfSpeech: string
  syllabifiedWord: string
  pronunciationAudioUrl?: string
  offensive?: boolean
  labels?: string[]
  stems?: string[]
}

export const getCardsByDeckId = async (
  decKId: string,
  querySentence: string | undefined,
  offset: number,
  limit: number
): Promise<Card[]> => {
  const res = await $axios.get(`/cards/deck/${decKId}`, {
    params: { sentence: querySentence, offset, limit },
  })
  return res.data
}

export const deleteCard = async (cardId: string) => {
  return await $axios.delete(`/cards/${cardId}`)
}

export interface CreateCardRequest {
  sentence: string
  targetWords: string[]
  definitions?: UserProvidedDefinition[]
}

export const createCard = async (deckId: string, data: CreateCardRequest) => {
  const res = await $axios.post(`/cards/deck/${deckId}`, data)
  return res.data
}

export type EditCardRequest = Partial<CreateCardRequest>

export const editCard = async (cardId: string, data: EditCardRequest) => {
  const res = await $axios.put(`/cards/${cardId}`, data)
  return res.data
}
