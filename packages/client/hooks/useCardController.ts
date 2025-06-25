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
import type { CreateCardRequest, EditCardRequest, UserProvidedDefinition } from '@/api'

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
      alert('Created', 'The Card was successfully created.')
      router.push(`/decks/${deckId}/card/${creationDetails.card.id}`)
    }
    return creationDetails
  }

  const editCard = async (cardId: string, data: EditCardRequest) => {
    const editingDetails = await handleAxios(
      async () => {
        return await editCardHandler(cardId, data)
      },
      { errorMessage: 'Failed to edit Card' }
    )

    if (editingDetails) {
      alert('Saved', 'The changes were saved.')

      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['definitions'] })
    }
    return editingDetails
  }

  const addCustomDefinition = async (
    cardId: string,
    sentence: string,
    targetWords: string[],
    def: UserProvidedDefinition
  ) => {
    const editingDetails = await handleAxios(
      async () => {
        return await editCardHandler(cardId, { sentence, targetWords, definitions: [def] })
      },
      { errorMessage: 'Failed to add custom Definition' }
    )

    if (editingDetails) {
      alert('Saved', 'The changes were saved.')

      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['definitions'] })
    }
    return editingDetails
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
      alert('Deleted', 'The Definition was deleted.')

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
