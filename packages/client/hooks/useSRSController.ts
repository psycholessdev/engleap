'use client'
import { useState, useEffect } from 'react'
import { getCardsToReview, updateCardProgress } from '@/api'
import type { NormalizedCardProgress } from '@/types'
import { useAxiosErrorHandler } from '@/hooks/useAxiosErrorHandler'
import { SRS_PAGE_SIZE, PROGRESS_SAVE_FAILED } from '@/consts'

export const useSRSController = (deckId?: string) => {
  const { handleAxios, isLoading } = useAxiosErrorHandler()
  const [cardSRSPool, setCardSRSPool] = useState<NormalizedCardProgress[]>([])
  const [allCardsFetched, setAllCardsFetched] = useState(false)

  useEffect(() => {
    const updatePool = async () => {
      const fetchedCards = await handleAxios(
        async () => {
          return await getCardsToReview(deckId)
        },
        { errorTitle: 'Failed to get more cards' }
      )

      if (fetchedCards) {
        if (fetchedCards.length > 0) {
          setCardSRSPool(cards => [...cards, ...fetchedCards])
        }

        // API has a limit of 20 cards per request
        // if received less than 20, not further requests required
        if (fetchedCards.length < SRS_PAGE_SIZE) {
          setAllCardsFetched(true)
        }
      }
    }

    if (
      (cardSRSPool.length < 5 && !isLoading && !allCardsFetched) ||
      (cardSRSPool.length === 0 && !isLoading)
    ) {
      updatePool()
    }
  }, [cardSRSPool, deckId])

  const finishCard = async (cardId: string, grade: number) => {
    setCardSRSPool(pool => pool.filter(progress => progress.cardId !== cardId))

    const updatedCardProgress = await handleAxios(
      async () => {
        return await updateCardProgress(cardId, { grade })
      },
      {
        errorTitle: 'Failed to save your progress',
        errorMessage: PROGRESS_SAVE_FAILED,
        allowParallelLoading: true,
        ignoreLoading: true,
      }
    )

    if (!updatedCardProgress) {
      console.log('TODO schedule update later')
      // TODO schedule update later via browser storage API
    }

    return updatedCardProgress
  }

  return { cardSRSPool, finishCard, allCardsFetched }
}
