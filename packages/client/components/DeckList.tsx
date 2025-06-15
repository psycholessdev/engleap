'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconPencil, IconMenuDeep, IconCircleCheckFilled } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAuth, useInfiniteDecks, useFetchSRSCardsCount } from '@/hooks'

interface IDeckItem {
  deckId: string
  title: string
  cardsTotalCount: number
  key?: string
  editable?: boolean
}

const DeckItem: React.FC<IDeckItem> = ({ title, cardsTotalCount, editable, deckId }) => {
  const cardsDueCount = useFetchSRSCardsCount(deckId)
  return (
    <div className="w-full py-5 px-3 flex items-center justify-between rounded-2xl cursor-pointer last:border-b-transparent hover:bg-el-secondary-container/20">
      <Link href={`/study?deckId=${deckId}`} className="flex flex-col gap-1 w-full">
        <span className="font-ubuntu text-2xl text-white select-none mr-3">{title}</span>
        <div className="flex items-center gap-1">
          <Badge>{cardsTotalCount} total</Badge>

          {!!cardsDueCount && <Badge variant="secondary">{cardsDueCount} to study</Badge>}
          {cardsTotalCount > 0 && cardsDueCount === 0 && (
            <Badge variant="secondary">
              <IconCircleCheckFilled /> All cards are finished
            </Badge>
          )}
          {cardsDueCount === undefined && <Skeleton className="w-22 h-6 rounded-2xl" />}
        </div>
      </Link>
      <Button asChild variant="secondary" size="sm">
        <Link href={`/decks/${deckId}`}>
          {editable ? (
            <>
              <IconPencil /> Edit
            </>
          ) : (
            <>
              <IconMenuDeep /> Details
            </>
          )}
        </Link>
      </Button>
    </div>
  )
}

const DeckItemSkeleton: React.FC<{ key?: string | number }> = () => {
  return (
    <div className="w-full h-26 py-5 px-3 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Skeleton className="w-80 h-6 rounded-2xl" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-18 h-6 rounded-2xl" />
          <Skeleton className="w-22 h-6 rounded-2xl" />
        </div>
      </div>
      <Skeleton className="w-16 h-8 rounded-lg" />
    </div>
  )
}

const DeckList = () => {
  const { ref, inView } = useInView()
  const { decks, hasNextPage, isFetching, fetchNextPage, status } = useInfiniteDecks()
  const { userId } = useAuth()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="flex flex-col gap-2 pb-20">
      {decks &&
        decks.map(deck => (
          <DeckItem
            key={deck.id}
            deckId={deck.id}
            title={deck.title}
            cardsTotalCount={deck.cardCount}
            editable={deck.creatorId === userId}
          />
        ))}
      {status === 'error' && <p>Try again</p>}
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
