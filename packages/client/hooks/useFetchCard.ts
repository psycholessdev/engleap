'use client'
import { useAxiosErrorHandler } from '@/hooks'
import { getCardById } from '@/api'
import type { NormalizedCard } from '@/utils'

import { useEffect, useState } from 'react'

export const useFetchCard = (cardId?: string) => {
  const [card, setCard] = useState<NormalizedCard | null | undefined>(undefined)
  const { handleAxios, isLoading } = useAxiosErrorHandler()

  useEffect(() => {
    const fetchCard = async () => {
      const fetchedCard = await handleAxios(
        async () => {
          return await getCardById(cardId)
        },
        { showAlert: false }
      )

      if (fetchedCard) {
        setCard(fetchedCard)
      } else {
        setCard(null)
      }
    }

    if ((card === undefined && cardId) || (card && cardId && card.id !== cardId)) {
      fetchCard()
    }
  }, [card, cardId])

  const refetch = () => {
    setCard(undefined)
  }

  return { card, isLoading, refetch }
}
