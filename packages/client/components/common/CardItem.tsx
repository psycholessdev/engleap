import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconEdit, IconTrash } from '@tabler/icons-react'

import React from 'react'
import Link from 'next/link'
import type { TargetWord } from '@/api'

// Highlighted list of target words
const TargetWordsBadges: React.FC<{ targetWords: TargetWord[] }> = ({ targetWords }) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {targetWords.map(t => (
        <Badge key={t.id}>{t.word.text}</Badge>
      ))}
    </div>
  )
}

interface ICardItem {
  loading: boolean
  deckId: string
  cardId: string
  sentence: string
  targetWords: TargetWord[]
  showButtons?: boolean
  onDelete?: (cardId: string) => void
  onClick: (cardId: string) => void
}

const CardItem: React.FC<ICardItem> = ({
  sentence,
  targetWords,
  showButtons,
  cardId,
  deckId,
  onDelete,
  onClick,
  loading,
}) => {
  const handleDeleteCard = () => {
    if (onDelete) {
      onDelete(cardId)
    }
  }

  return (
    <div className="w-full py-5 border-b border-b-el-outline flex items-center justify-between hover:bg-el-secondary-container/20 cursor-pointer">
      <div className="flex flex-col gap-2" onClick={() => onClick(cardId)}>
        <Label className="text-white text-lg leading-5">{sentence}</Label>
        <TargetWordsBadges targetWords={targetWords} />
      </div>
      <div className="flex items-center gap-2">
        {loading && <Loader2Icon className="animate-spin" />}
        {showButtons && (
          <Button variant="outline" size="sm" aria-label="Edit Card" disabled={loading} asChild>
            <Link href={`/decks/${deckId}/card/${cardId}`}>
              <IconEdit /> <span className="lg:inline hidden">Edit</span>
            </Link>
          </Button>
        )}
        {showButtons && (
          <Button
            variant="outline"
            size="sm"
            aria-label="Delete Card"
            onClick={handleDeleteCard}
            disabled={loading}>
            <IconTrash />
          </Button>
        )}
      </div>
    </div>
  )
}

export const CardItemSkeleton: React.FC = () => {
  return (
    <div className="w-full h-23 py-5">
      <div className="flex flex-col lg:gap-1 gap-2">
        <Skeleton className="lg:w-150 w-60 lg:h-6 h-4 rounded-2xl" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-18 h-6 rounded-xl" />
          <Skeleton className="w-18 h-6 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(CardItem)
