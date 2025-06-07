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

export const getCardsByDeckId = async (decKId: string): Promise<Card[]> => {
  const res = await $axios.get(`/cards/deck/${decKId}`)
  return res.data
}

export const deleteCard = async (cardId: string) => {
  return await $axios.delete(`/cards/${cardId}`)
}

export interface CreateCardRequest {
  sentence: string
  targetWords: string[]
}

export const createCard = async (deckId: string, data: CreateCardRequest) => {
  const res = await $axios.post(`cards/deck/${deckId}`, data)
  return res.data
}
