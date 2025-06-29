'use client'
import DeckItem, { DeckItemSkeleton } from '@/components/DeckItem'
import FailureFallback from '@/components/FailureFallback'

import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAuth, useInfiniteDecks } from '@/hooks'

import type { DeckWithCardInfo } from '@/api'

const DeckList = () => {
  const { ref, inView } = useInView()
  const { decks, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, refetch, status } =
    useInfiniteDecks()
  const { userId } = useAuth()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  return (
    <div className="flex flex-col gap-2 pb-20">
      {decks &&
        decks.map((deck: DeckWithCardInfo) => (
          <DeckItem
            key={deck.id}
            deckId={deck.id}
            title={deck.title}
            emoji={deck.emoji}
            cardsTotalCount={deck.cardCount}
            cardsDueCount={deck.dueCardCount}
            editable={deck.creatorId === userId}
          />
        ))}
      {status === 'error' && !isFetching && <FailureFallback onRetry={refetch} />}
      {isFetching && (
        <>
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <DeckItemSkeleton key={i} />
            ))}
        </>
      )}
      <div ref={ref} />
    </div>
  )
}
export default DeckList
