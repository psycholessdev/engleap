'use client'
import React, { useEffect } from 'react'
import { getMyDecks, type Deck } from '@/api'
import { useAxiosErrorHandler } from '@/hooks'

export const useFetchDecks = () => {
  const { handleAxios } = useAxiosErrorHandler()
  const [decks, setDecks] = React.useState<Deck[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDecks = async () => {
      const decks = await handleAxios(
        async () => {
          return await getMyDecks()
        },
        { showAlert: false }
      )

      setDecks(decks)
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
