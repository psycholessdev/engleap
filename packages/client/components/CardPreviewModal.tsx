'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Sentence } from '@/components/StudyCards'
import DefinitionList from '@/components/DefinitionList'
import FetchFailureFallback from '@/components/common/FetchFailureFallback'
import { Loader2Icon } from 'lucide-react'

import React from 'react'
import { useFetchCard } from '@/hooks'

interface ICardPreviewModal {
  cardId?: string
  opened: boolean
  onClose: () => void
}

const CardPreviewModal: React.FC<ICardPreviewModal> = ({ cardId, opened, onClose }) => {
  const { card, isLoading, refetch } = useFetchCard(cardId)

  return (
    <AlertDialog open={opened}>
      <AlertDialogContent className="max-h-full overflow-y-auto overflow-x-hidden">
        <AlertDialogHeader className="flex flex-row justify-between items-center">
          <AlertDialogTitle>Card Preview</AlertDialogTitle>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogHeader>
        {/* Loader */}
        {isLoading && (
          <div className="flex flex-col items-center">
            <Loader2Icon className="animate-spin" />
            <h2>Please wait</h2>
          </div>
        )}

        {/* Content */}
        {card && !isLoading && (
          <Sentence text={card.sentence} targetWords={card.targetWords} showBg />
        )}
        {card && !isLoading && <DefinitionList cardId={card.id} />}

        {/* Fallback UI */}
        {!isLoading && !card && <FetchFailureFallback onRetry={refetch} />}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default CardPreviewModal
