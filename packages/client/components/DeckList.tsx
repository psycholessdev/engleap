'use client'
import { DeckItem, DeckItemSkeleton, FetchFailureFallback } from '@/components/common'

import { useDebouncedCallback } from 'use-debounce'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAuth, useInfiniteDecks } from '@/hooks'

import type { DeckWithCardInfo } from '@/types'

const DeckList = () => {
  const { ref, inView } = useInView()
  const { decks, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, refetch, status } =
    useInfiniteDecks()
  const { userId } = useAuth()

  const debouncedFetchNextPage = useDebouncedCallback(() => {
    fetchNextPage()
  }, 200)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      debouncedFetchNextPage()
    }
  }, [inView, hasNextPage, debouncedFetchNextPage, isFetchingNextPage])

  return (
    <div className="flex flex-col gap-2 pb-20" aria-live="polite">
      {decks &&
        decks.map((deck: DeckWithCardInfo) => (
          <DeckItem
            key={deck.id}
            deckId={deck.id}
            title={deck.title}
            emoji={deck.emoji}
            cardsTotalCount={Number(deck.cardCount)}
            cardsDueCount={Number(deck.dueCardCount)}
            editable={deck.creatorId === userId}
          />
        ))}

      {!isFetching && decks && decks.length === 0 && (
        <FetchFailureFallback
          hideButton
          icon="/icons/empty-cardboard-box.png"
          title="Nothing here"
          text="Create your first Deck or try to go over the Public Decks list"
        />
      )}
      {status === 'error' && !isFetching && <FetchFailureFallback onRetry={refetch} />}
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
export { DeckList }
