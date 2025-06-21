import { $axios } from '@/api/baseApi'
import { normalizeCard, type NormalizedCard } from '@/utils'

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
  deckId: string,
  querySentence: string | undefined,
  offset: number,
  limit: number
): Promise<Card[]> => {
  const res = await $axios.get(`/cards/deck/${deckId}`, {
    params: { sentence: querySentence, offset, limit },
  })
  return res.data
}

export const getCardById = async (cardId: string): Promise<NormalizedCard> => {
  const res = await $axios.get(`/cards/${cardId}`)
  return normalizeCard(res.data as Card)
}

export const deleteCard = async (cardId: string) => {
  return await $axios.delete(`/cards/${cardId}`)
}

export interface CreateCardRequest {
  sentence: string
  targetWords: string[]
  definitions?: UserProvidedDefinition[]
}
interface CreateCardResponse {
  card: Card
  notFoundWords: string[]
  inserted: boolean
}

export const createCard = async (
  deckId: string,
  data: CreateCardRequest
): Promise<CreateCardResponse> => {
  const res = await $axios.post(`/cards/deck/${deckId}`, data)
  return res.data
}

export type EditCardRequest = Partial<CreateCardRequest>
interface EditCardResponse {
  card: Card
  notFoundWords: string[]
}

export const editCard = async (
  cardId: string,
  data: EditCardRequest
): Promise<EditCardResponse> => {
  const res = await $axios.put(`/cards/${cardId}`, data)
  return res.data
}
