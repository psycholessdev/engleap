'use client'
import React, { useEffect } from 'react'
import { getCardsByDeckId, type Card } from '@/api'
import { useAxiosErrorHandler } from '@/hooks'

export const useFetchCards = (deckId: string) => {
  const { handleAxios } = useAxiosErrorHandler()
  const [cards, setCards] = React.useState<Card[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDecks = async () => {
      const cards = await handleAxios(
        async () => {
          return await getCardsByDeckId(deckId)
        },
        { showAlert: false }
      )

      setCards(cards)
    }

    if (cards === undefined) {
      fetchDecks()
    }
  }, [cards])

  const refetchCards = () => {
    setCards(undefined)
  }

  return { cards, refetchCards }
}
