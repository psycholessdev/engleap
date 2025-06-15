'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AddButtonGhost from './AddButtonGhost'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'

import { type Card } from '@/api'
import { type TargetWord } from '@/api'

import { useInView } from 'react-intersection-observer'
import { useCardController, useInfiniteCards } from '@/hooks'
import { useRouter } from 'next/navigation'

interface ICardItem {
  loading: boolean
  deckId: string
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
  deckId,
  onDelete,
  loading,
}) => {
  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (onDelete) {
      onDelete(cardId)
    }
  }

  return (
    <Link
      href={showButtons ? `/decks/${deckId}/card/${cardId}` : '#'}
      className="w-full py-5 border-b border-b-el-outline flex items-center justify-between hover:bg-el-secondary-container/20 cursor-pointer">
      <div className="flex flex-col gap-2">
        <Label className="text-white text-lg leading-5">{sentence}</Label>
        <div className="flex items-center gap-1">
          {targetWords.map(t => (
            <Badge key={t.id}>{t.word.text}</Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {loading && <Loader2Icon className="animate-spin" />}
        {showButtons && (
          <Button variant="outline" size="sm" disabled={loading}>
            <IconEdit /> <span className="lg:inline hidden">Edit</span>
          </Button>
        )}
        {showButtons && (
          <Button variant="outline" size="sm" onClick={handleDeleteCard} disabled={loading}>
            <IconTrash />
          </Button>
        )}
      </div>
    </Link>
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
  cardCount?: number
}

const CardsList: React.FC<ICardsList> = ({ deckId, cardCount, showButtons }) => {
  const router = useRouter()
  const { cards, fetchNextPage, hasNextPage, isFetching, status, refetch } =
    useInfiniteCards(deckId)
  const { ref, inView } = useInView()
  const { loading, deleteCard } = useCardController()

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId).then(deleted => {
      if (deleted) {
        refetch()
      }
    })
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="flex flex-col items-start gap-3 pb-20">
      <div className="flex items-center gap-3">
        <h2 className="font-ubuntu text-2xl text-white">🚀 Cards</h2>
        {cardCount && <Badge>{cardCount} items</Badge>}
      </div>
      <Input id="search" name="search" placeholder="Search Cards" />
      {showButtons && (
        <AddButtonGhost text="Add Card" onClick={() => router.push(`/decks/${deckId}/card`)} />
      )}

      {cards &&
        cards.map((card: Card) => (
          <CardItem
            key={card.id}
            cardId={card.id}
            deckId={deckId}
            sentence={card.sentence}
            targetWords={card.targetWords}
            showButtons={showButtons}
            loading={loading}
            onDelete={handleDeleteCard}
          />
        ))}
      {status === 'error' && <p>Try again</p>}
      {isFetching && (
        <>
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <CardItemSkeleton key={i} />
            ))}
        </>
      )}

      <div ref={ref} />
    </div>
  )
}

export default CardsList
