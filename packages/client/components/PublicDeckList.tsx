'use client'
import { Input } from '@/components/ui/input'
import PublicDeckItem, { PublicDeckItemSkeleton } from '@/components/common/PublicDeckItem'
import FetchFailureFallback from '@/components/common/FetchFailureFallback'

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

      <div className="grid xl:grid-cols-2 grid-cols-1 lg:gap-2 w-full">
        {publicDecks &&
          publicDecks.map((pd: PublicDeck) => (
            <PublicDeckItem
              key={pd.id}
              deckId={pd.id}
              title={pd.title}
              description={pd.description}
              emoji={pd.emoji}
              cardsTotalCount={pd.cardCount}
              followersCount={pd.usersFollowing}
            />
          ))}
        {status === 'error' && !isFetching && <FetchFailureFallback onRetry={refetch} />}
        {isFetching &&
          Array(4)
            .fill(null)
            .map((_, i) => <PublicDeckItemSkeleton key={i} />)}
      </div>

      <div ref={ref} />
    </div>
  )
}
export default PublicDeckList
