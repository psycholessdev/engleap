import React from 'react'
import { useFetchSRSCardsCount } from '@/hooks'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { IconCircleCheckFilled, IconMenuDeep, IconPencil } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

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

export const DeckItemSkeleton: React.FC<{ key?: string | number }> = () => {
  return (
    <div className="w-full h-26 py-5 px-3 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Skeleton className="lg:w-80 w-50 h-6 rounded-2xl" />
        <div className="flex items-center gap-1">
          <Skeleton className="lg:w-18 w-15 h-6 rounded-2xl" />
          <Skeleton className="lg:w-22 w-18 h-6 rounded-2xl" />
        </div>
      </div>
      <Skeleton className="w-16 h-8 rounded-lg" />
    </div>
  )
}

export default DeckItem
