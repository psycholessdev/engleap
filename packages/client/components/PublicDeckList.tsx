'use client'
import { Input } from '@/components/ui/input'
import DeckItem, { DeckItemSkeleton } from '@/components/DeckItem'
import FailureFallback from '@/components/FailureFallback'

import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useInView } from 'react-intersection-observer'
import { useInfinitePublicDecks } from '@/hooks'

import type { PublicDeck } from '@/api'

const PublicDeckList = () => {
  const { ref, inView } = useInView()
  const [searchQuery, setSearchQuery] = useState('')
  const {
    publicDecks,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfinitePublicDecks(searchQuery)

  const handleSearchChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, 700)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  useEffect(() => {
    refetch()
  }, [searchQuery, refetch])

  return (
    <div className="flex flex-col items-start gap-3 pb-20">
      <Input id="search" name="search" placeholder="Search Decks" onChange={handleSearchChange} />

      {publicDecks &&
        publicDecks.map((pd: PublicDeck) => (
          <DeckItem
            key={pd.id}
            deckId={pd.id}
            title={pd.title}
            cardsTotalCount={pd.cardCount}
            cardsDueCount={0}
          />
        ))}
      {status === 'error' && !isFetching && <FailureFallback onRetry={refetch} />}
      {isFetching &&
        Array(4)
          .fill(null)
          .map((_, i) => <DeckItemSkeleton key={i} />)}

      <div ref={ref} />
    </div>
  )
}
export default PublicDeckList
