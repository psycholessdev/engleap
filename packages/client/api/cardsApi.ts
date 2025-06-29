import { $axios } from '@/api/baseApi'
import { normalizeCard, type NormalizedCard } from '@/utils'
import {
  Card,
  CreateCardRequest,
  CreateCardResponse,
  EditCardRequest,
  EditCardResponse,
} from '@/types'

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

export const createCard = async (
  deckId: string,
  data: CreateCardRequest
): Promise<CreateCardResponse> => {
  const res = await $axios.post(`/cards/deck/${deckId}`, data)
  return res.data
}

export const editCard = async (
  cardId: string,
  data: EditCardRequest
): Promise<EditCardResponse> => {
  const res = await $axios.put(`/cards/${cardId}`, data)
  return res.data
}
