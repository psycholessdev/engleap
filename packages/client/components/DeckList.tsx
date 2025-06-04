'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconPencil } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

import React from 'react'
import { type Deck } from '@/api'
import { useAuth, useFetchDecks } from '@/hooks'

interface IDeckItem {
  deckId: string
  title: string
  cardsTotalCount: number
  cardsNewCount: number
  cardsDueCount: number
  key?: string
  editable?: boolean
}

const DeckItem: React.FC<IDeckItem> = ({
  title,
  cardsTotalCount,
  cardsNewCount,
  cardsDueCount,
  editable,
  deckId,
}) => {
  return (
    <Link
      href={`/decks/${deckId}`}
      className="w-full py-5 px-3 flex justify-between rounded-2xl cursor-pointer last:border-b-transparent hover:bg-el-secondary-container/20">
      <div className="flex items-center gap-1">
        <span className="font-ubuntu text-2xl text-white select-none mr-3">{title}</span>
        <Badge>{cardsTotalCount} total</Badge>
        <Badge variant="secondary">{cardsNewCount} new</Badge>
        <Badge variant="secondary">{cardsDueCount} to review</Badge>
      </div>
      {editable && (
        <Button variant="secondary" size="sm">
          <IconPencil /> Edit
        </Button>
      )}
    </Link>
  )
}

const DeckItemSkeleton: React.FC<{ key?: string | number }> = () => {
  return <Skeleton className="w-full h-18 py-5 px-3 rounded-2xl" />
}

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
      {decks.map((deck: Deck) => (
        <DeckItem
          key={deck.id}
          deckId={deck.id}
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
