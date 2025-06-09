'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks'
import {
  createCard as createCardHandler,
  editCard as editCardHandler,
  type CreateCardRequest,
  type EditCardRequest,
} from '@/api'

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

  const editCard = async (cardId: string, data: EditCardRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      const card = await editCardHandler(cardId, data)
      alert('Success', 'The changes were saved.')

      // TODO refetch definitions in DefinitionList component and do not update the whole page
      router.refresh()
      location.reload() // it's a temporary fix

      return card
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

  return { loading, failureMessage, createCard, editCard }
}
