'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks'
import { createCard as createCardHandler, type CreateCardRequest } from '@/api'

export const useCardController = () => {
  const router = useRouter()
  const { alert } = useNotifications()
  const [failureMessage, setFailureMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const createCard = async (deckId: string, data: CreateCardRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      const creationDetails = await createCardHandler(deckId, data)
      alert('Success', 'The Card was successfully created.')
      router.push(`/decks/${deckId}/card/${creationDetails.card.id}`)
      return creationDetails
    } catch (error: AxiosError) {
      console.log(error)
      if (error.response) {
        alert('Error', error.response?.reason || 'Unexpected error occurred', 'failure')
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        alert('Failure', 'Internet connection error', 'failure')
        setFailureMessage('Internet connection error')
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, failureMessage, createCard }
}
