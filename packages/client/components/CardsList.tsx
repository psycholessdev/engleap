'use client'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'

import { type Card } from '@/api'
import { type TargetWord } from '@/api'

import { useAuth, useCardEditor, useFetchCards } from '@/hooks'

interface ICardItem {
  cardId: string
  sentence: string
  targetWords: TargetWord[]
  showButtons?: boolean
}

export const CardItem: React.FC<ICardItem> = ({ sentence, targetWords, showButtons, cardId }) => {
  const { loading, deleteCard } = useCardEditor()
  return (
    <div className="w-full py-5 border-b border-b-el-outline flex items-center justify-between hover:bg-el-secondary-container/20 cursor-pointer">
      <div className="flex flex-col gap-1">
        <Label className="text-white text-lg">{sentence}</Label>
        <div className="flex items-center gap-1">
          {targetWords.map(t => (
            <Badge key={t.id}>{t.word.text}</Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {loading && <Loader2Icon className="animate-spin" />}
        {showButtons && (
          <Button variant="outline" size="sm">
            <IconEdit />
          </Button>
        )}
        {showButtons && (
          <Button variant="outline" size="sm" onClick={() => deleteCard(cardId)}>
            <IconTrash />
          </Button>
        )}
      </div>
    </div>
  )
}

const CardItemSkeleton: React.FC = () => {
  return (
    <div className="w-full h-23 py-5">
      <div className="flex flex-col gap-1">
        <Skeleton className="w-150 h-6 rounded-2xl" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-18 h-6 rounded-xl" />
          <Skeleton className="w-18 h-6 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

interface ICardsList {
  deckId: string
  showButtons?: boolean
}

const CardsList: React.FC<ICardsList> = ({ deckId }) => {
  const { userId } = useAuth()
  const { cards } = useFetchCards(deckId)

  if (cards === undefined) {
    // fetching state
    return (
      <div className="flex flex-col gap-2">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <CardItemSkeleton key={i} />
          ))}
      </div>
    )
  }
  if (cards === null) {
    // idle state, fetch failed
    return <p>Try again</p>
  }

  return (
    <div>
      {cards.map((card: Card) => (
        <CardItem
          key={card.id}
          cardId={card.id}
          sentence={card.sentence}
          targetWords={card.targetWords}
          showButtons={userId === card.createdByUserId}
        />
      ))}
    </div>
  )
}

export default CardsList
