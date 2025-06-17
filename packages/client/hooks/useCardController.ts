'use client'
import { useRouter } from 'next/navigation'
import { useAxiosErrorHandler, useNotifications } from '@/hooks'
import {
  createCard as createCardHandler,
  editCard as editCardHandler,
  deleteCard as deleteCardHandler,
  deleteDefinition as deleteDefinitionHandler,
} from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import type { CreateCardRequest, EditCardRequest, Card, UserProvidedDefinition } from '@/api'

export const useCardController = () => {
  const router = useRouter()
  const alert = useNotifications()
  const queryClient = useQueryClient()
  const { handleAxios, isLoading, failureMessage } = useAxiosErrorHandler()

  const createCard = async (deckId: string, data: CreateCardRequest) => {
    const creationDetails = await handleAxios(
      async () => {
        return await createCardHandler(deckId, data)
      },
      { errorMessage: 'Failed to create Card' }
    )

    if (creationDetails) {
      alert('Success', 'The Card was successfully created.')
      router.push(`/decks/${deckId}/card/${creationDetails.card.id}`)
    }
    return creationDetails
  }

  const editCard = async (cardId: string, data: EditCardRequest): Promise<Card | null> => {
    const card = await handleAxios(
      async () => {
        return await editCardHandler(cardId, data)
      },
      { errorMessage: 'Failed to edit Card' }
    )

    if (card) {
      alert('Success', 'The changes were saved.')

      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['definitions'] })
    }
    return card
  }

  const addCustomDefinition = async (
    cardId: string,
    sentence: string,
    targetWords: string[],
    def: UserProvidedDefinition
  ) => {
    const card = await handleAxios(
      async () => {
        return await editCardHandler(cardId, { sentence, targetWords, definitions: [def] })
      },
      { errorMessage: 'Failed to add custom Definition' }
    )

    if (card) {
      alert('Success', 'The changes were saved.')

      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['definitions'] })
    }
    return card
  }

  const deleteCustomDefinition = async (defId: string) => {
    const success = await handleAxios(
      async () => {
        await deleteDefinitionHandler(defId)
        return true
      },
      { errorMessage: 'Failed to delete custom Definition' }
    )

    if (success) {
      alert('Success', 'The Definition was deleted.')

      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['definitions'] })
    }
    return !!success
  }

  const deleteCard = async (cardId: string) => {
    const success = await handleAxios(
      async () => {
        await deleteCardHandler(cardId)
        return true
      },
      { errorMessage: 'Card does not exist or you do not have the right to delete it' }
    )

    return !!success
  }

  return {
    isLoading,
    failureMessage,
    createCard,
    editCard,
    addCustomDefinition,
    deleteCard,
    deleteCustomDefinition,
  }
}
