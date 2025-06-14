'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconPencil, IconMenuDeep, IconCircleCheckFilled } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

import React from 'react'
import { useAuth, useFetchDecks, useFetchSRSCardsCount } from '@/hooks'

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
          {cardsDueCount === 0 && (
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
  const { decks } = useFetchDecks()
  const { userId } = useAuth()

  if (decks === undefined) {
    // fetching state
    return (
      <div className="flex flex-col gap-2">
        {Array(6)
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
          deckId={deck.id}
          title={deck.title}
          cardsTotalCount={deck.cardCount}
          editable={deck.creatorId === userId}
        />
      ))}
    </div>
  )
}
export default DeckList
