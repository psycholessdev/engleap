'use client'
import { useState } from 'react'
import { deleteCard as deleteCardHandler } from '@/api'
import { useNotifications } from '@/hooks/useNotifications'

interface IUseCardEditor {
  onDeleteCard?: (cardId: string) => void
}

export const useCardEditor = ({ onDeleteCard }: IUseCardEditor) => {
  const [loading, setLoading] = useState(false)
  const { alert } = useNotifications()

  const deleteCard = async (cardId: string): Promise<boolean> => {
    try {
      if (loading) return false

      setLoading(true)
      await deleteCardHandler(cardId)
      if (onDeleteCard) {
        onDeleteCard(cardId)
      }
      return true
    } catch (error: AxiosError) {
      if (!error.response) {
        alert('Failed to delete card', 'Check your internet connection', 'failure')
      } else {
        alert(
          'Failed to delete card',
          'Card does not exist or you do not have the right to delete it.',
          'failure'
        )
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, deleteCard }
}
