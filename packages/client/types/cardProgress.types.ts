import type { Card } from '@/api'
import type { NormalizedCard } from '@/utils'

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

export type UpdateCardProgressRequest = { grade: number }
export type UpdateCardProgressResponse = Omit<CardProgress, 'card'>
