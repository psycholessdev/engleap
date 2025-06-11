'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks'
import {
  createCard as createCardHandler,
  editCard as editCardHandler,
  deleteCard as deleteCardHandler,
} from '@/api'
import type { CreateCardRequest, EditCardRequest, Card, Definition } from '@/api'

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

  const editCard = async (cardId: string, data: EditCardRequest): Promise<Card | null> => {
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

  const addCustomDefinition = async (
    cardId: string,
    sentence: string,
    targetWords: string[],
    def: Definition
  ) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)

      const card = await editCardHandler(cardId, { sentence, targetWords, definitions: [def] })
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

  const deleteCard = async (cardId: string) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      await deleteCardHandler(cardId)
      return true
    } catch (error: AxiosError) {
      console.log(error)
      if (error.response) {
        alert('Failed to delete card', 'Check your internet connection', 'failure')
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        alert(
          'Failed to delete card',
          'Card does not exist or you do not have the right to delete it.',
          'failure'
        )
        setFailureMessage('Internet connection error')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, failureMessage, createCard, editCard, addCustomDefinition, deleteCard }
}
