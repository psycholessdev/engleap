import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import Link from 'next/link'
import React from 'react'

interface IPublicDeckItem {
  deckId: string
  title: string
  description: string
  emoji: string
  cardsTotalCount: number
  followersCount: number
}

const PublicDeckItem: React.FC<IPublicDeckItem> = ({
  deckId,
  title,
  description,
  emoji,
  cardsTotalCount,
  followersCount,
}) => {
  return (
    <div className="w-full p-3 flex items-center justify-between rounded-2xl cursor-pointer last:border-b-transparent hover:bg-el-secondary-container/20">
      <Link href={`/decks/${deckId}`} className="flex flex-col w-full">
        <span className="font-ubuntu text-2xl text-white select-none">
          {emoji} {title}
        </span>
        <span className="font-ubuntu text-el-secondary-container pb-2 select-none">
          {description}
        </span>
        <div className="flex items-center gap-1">
          <Badge>{cardsTotalCount} cards</Badge>
          <Badge variant="secondary">{followersCount} people following</Badge>
        </div>
      </Link>
    </div>
  )
}

export const PublicDeckItemSkeleton: React.FC<{ key?: string | number }> = () => {
  return (
    <div className="flex flex-col w-full p-5 gap-1">
      <Skeleton className="w-60 h-6 rounded-2xl" />
      <Skeleton className="w-90 h-4 rounded-2xl" />
      <div className="flex items-center gap-1 mt-3">
        <Skeleton className="w-19 h-6 rounded-2xl" />
        <Skeleton className="w-25 h-6 rounded-2xl" />
      </div>
    </div>
  )
}

export default PublicDeckItem
