'use client'
import React, { useEffect } from 'react'
import { getMyDecks, type Deck } from '@/api'

export const useFetchDecks = () => {
  const [decks, setDecks] = React.useState<Deck[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const decks = await getMyDecks()
        setDecks(decks)
      } catch (error) {
        console.error(error)
        setDecks(null)
      }
    }

    if (decks === undefined) {
      fetchDecks()
    }
  }, [decks])

  const refetchDecks = () => {
    setDecks(undefined)
  }

  return { decks, refetchDecks }
}
