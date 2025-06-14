import { $axios } from '@/api/baseApi'
import type { Card } from '@/api'
import { normalizeCard, type NormalizedCard } from '@/utils'

export interface CardProgress {
  id: string
  userId: string
  cardId: string
  repetitionCount: number
  easinessFactor: number
  intervalDays: number
  nextReviewAt: number
  lastReviewedAt: Date
  card: Card
}
export type NormalizedCardProgress = Omit<CardProgress, 'card'> & { card: NormalizedCard }

export const getCardsToReview = async (deckId?: string): Promise<NormalizedCardProgress[]> => {
  const res = await $axios.get('/srs/cards', {
    params: { deckId },
  })
  return (res.data as CardProgress[]).map(cp => ({ ...cp, card: normalizeCard(cp.card) }))
}

type GetCardsToReviewCountResponse = { count: number; deckId?: string }

export const getCardsToReviewCount = async (
  deckId?: string
): Promise<GetCardsToReviewCountResponse> => {
  const res = await $axios.get('/srs/cards/stats', {
    params: { deckId },
  })
  return res.data
}

type UpdateCardProgressRequest = { grade: number }
type UpdateCardProgressResponse = Omit<CardProgress, 'card'>

export const updateCardProgress = async (
  cardId: string,
  data: UpdateCardProgressRequest
): Promise<UpdateCardProgressResponse> => {
  const res = await $axios.post(`/srs/card/${cardId}`, data)
  return res.data
}
