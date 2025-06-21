import type { Card, TargetWord } from '@/api'

const convertRawTargetWords = (rawTargetWords: TargetWord[]): string[] => {
  return rawTargetWords.map(rtw => rtw.word.text)
}

export type NormalizedCard = Omit<Card, 'targetWords'> & { targetWords: string[] }

// Convert targetWords from Sequelize-include format to string[] and return normalized Card
export const normalizeCard = (card: Card): NormalizedCard => {
  const normalizedCard = structuredClone(card)
  normalizedCard.targetWords = convertRawTargetWords(card.targetWords)

  return normalizedCard as NormalizedCard
}
