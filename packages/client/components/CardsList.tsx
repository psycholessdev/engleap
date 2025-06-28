'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import AddButtonGhost from '@/components/common/AddButtonGhost'
import CardItem, { CardItemSkeleton } from '@/components/common/CardItem'
import FetchFailureFallback from '@/components/common/FetchFailureFallback'
import CardPreviewModal from '@/components/CardPreviewModal'

import { type Card } from '@/api'

import { useDebouncedCallback } from 'use-debounce'
import { useInView } from 'react-intersection-observer'
import { useCardController, useInfiniteCards } from '@/hooks'
import { useRouter } from 'next/navigation'

interface ICardsList {
  deckId: string
  showButtons?: boolean
  cardCount?: number
}

const CardsList: React.FC<ICardsList> = ({ deckId, cardCount, showButtons }) => {
  const router = useRouter()
  const { ref, inView } = useInView()
  const { loading, deleteCard } = useCardController()
  const [cardPreviewModalId, setCardPreviewModalId] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const { cards, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
    useInfiniteCards(deckId, searchQuery)

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId).then(deleted => {
      if (deleted) {
        refetch()
      }
    })
  }

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
      <div className="flex items-center gap-3">
        <h2 className="font-ubuntu text-2xl text-white">🚀 Cards</h2>
        {typeof cardCount === 'number' && <Badge>{cardCount} items</Badge>}
      </div>
      <Input id="search" name="search" placeholder="Search Cards" onChange={handleSearchChange} />
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
            onClick={setCardPreviewModalId}
            onDelete={handleDeleteCard}
          />
        ))}
      {status === 'error' && !isFetching && <FetchFailureFallback onRetry={refetch} />}
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

      <CardPreviewModal
        cardId={cardPreviewModalId}
        opened={Boolean(cardPreviewModalId)}
        onClose={() => setCardPreviewModalId(undefined)}
      />
    </div>
  )
}

export default CardsList
