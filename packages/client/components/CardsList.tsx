'use client'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AddCardButton from './AddCardButton'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'

import { type Card } from '@/api'
import { type TargetWord } from '@/api'

import { useCardEditor, useFetchCards } from '@/hooks'
import { useRouter } from 'next/navigation'

interface ICardItem {
  cardId: string
  sentence: string
  targetWords: TargetWord[]
  showButtons?: boolean
  onDelete?: (cardId: string) => void
}

export const CardItem: React.FC<ICardItem> = ({
  sentence,
  targetWords,
  showButtons,
  cardId,
  onDelete,
}) => {
  const { loading, deleteCard } = useCardEditor({ onDeleteCard: onDelete })
  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteCard(cardId)
  }

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
          <Button variant="outline" size="sm" onClick={handleDeleteCard}>
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

const CardsList: React.FC<ICardsList> = ({ deckId, showButtons }) => {
  const router = useRouter()
  const { cards, refetchCards } = useFetchCards(deckId)
  let cardNodes: React.ReactNode | null

  if (cards === undefined) {
    // fetching state
    cardNodes = (
      <div className="flex flex-col gap-2">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <CardItemSkeleton key={i} />
          ))}
      </div>
    )
  } else if (cards === null) {
    // idle state, fetch failed
    cardNodes = <p>Try again</p>
  } else {
    cardNodes = cards.map((card: Card) => (
      <CardItem
        key={card.id}
        cardId={card.id}
        sentence={card.sentence}
        targetWords={card.targetWords}
        showButtons={showButtons}
        onDelete={() => refetchCards()}
      />
    ))
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <h2 className="font-ubuntu text-2xl text-white">🚀 Cards</h2>
        <Badge>{cards?.length || 0} items</Badge>
      </div>
      <Input id="search" name="search" placeholder="Search Cards" />
      {showButtons && <AddCardButton onClick={() => router.push(`/decks/${deckId}/card`)} />}
      {cardNodes}
    </div>
  )
}

export default CardsList
