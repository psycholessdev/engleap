'use client'
import DeckItem from './DeckItem'
import DeckItemSkeleton from './DeckItemSkeleton'

import React from 'react'
import { useAuth, useFetchDecks } from '@/hooks'

const DeckList = () => {
  const { decks } = useFetchDecks()
  const { userId } = useAuth()

  if (decks === undefined) {
    // fetching state
    return (
      <div className="flex flex-col gap-2">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <DeckItemSkeleton key={i} />
          ))}
      </div>
    )
  }
  if (decks === null) {
    // idle state, fetch failed
    return <p>Try again</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {decks.map(deck => (
        <DeckItem
          key={deck.id}
          title={deck.title}
          cardsTotalCount={374}
          cardsNewCount={255}
          cardsDueCount={121}
          editable={deck.creatorId === userId}
        />
      ))}
    </div>
  )
}
export default DeckList
