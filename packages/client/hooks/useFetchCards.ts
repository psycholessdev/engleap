'use client'
import React, { useEffect } from 'react'
import { getCardsByDeckId, type Card } from '@/api'

export const useFetchCards = (deckId: string) => {
  const [cards, setCards] = React.useState<Card[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const cards = await getCardsByDeckId(deckId)
        setCards(cards)
      } catch (error) {
        console.error(error)
        setCards(null)
      }
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
