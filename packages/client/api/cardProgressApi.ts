import { $axios } from '@/api/baseApi'
import { normalizeCard } from '@/utils'
import {
  CardProgress,
  NormalizedCardProgress,
  UpdateCardProgressRequest,
  UpdateCardProgressResponse,
} from '@/types'

export const getCardsToReview = async (deckId?: string): Promise<NormalizedCardProgress[]> => {
  const res = await $axios.get('/srs/cards', {
    params: { deckId },
  })
  return (res.data as CardProgress[]).map(cp => ({ ...cp, card: normalizeCard(cp.card) }))
}

export const updateCardProgress = async (
  cardId: string,
  data: UpdateCardProgressRequest
): Promise<UpdateCardProgressResponse> => {
  const res = await $axios.post(`/srs/card/${cardId}`, data)
  return res.data
}
