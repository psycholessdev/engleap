'use client'
import { useEffect, useState } from 'react'
import { getCardsToReviewCount } from '@/api'
import { useAxiosErrorHandler } from '@/hooks/useAxiosErrorHandler'

export const useFetchSRSCardsCount = (deckId?: string) => {
  const [dueCount, setDueCount] = useState<number | undefined>(undefined)
  const { handleAxios } = useAxiosErrorHandler()

  useEffect(() => {
    const request = async () => {
      const count = await handleAxios(async () => {
        const res = await getCardsToReviewCount(deckId)
        return res.count
      })

      if (typeof count === 'number') {
        setDueCount(count)
      }
    }

    request()
  }, [deckId])

  return dueCount
}
