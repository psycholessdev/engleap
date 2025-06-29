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
import type { CreateCardRequest, EditCardRequest, UserProvidedDefinition } from '@/types'
import {
  CARD_CREATED,
  CARD_CREATE_FAILED,
  CHANGES_SAVED,
  CHANGES_SAVE_FAILED,
  DELETED,
  DELETE_FAILED,
  DEFINITION_CREATE_FAILED,
  DEFINITION_CREATED,
} from '@/consts'

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
      { errorMessage: CARD_CREATE_FAILED }
    )

    if (creationDetails) {
      alert('Created', CARD_CREATED)
      router.push(`/decks/${deckId}/card/${creationDetails.card.id}`)
    }
    return creationDetails
  }

  const editCard = async (cardId: string, data: EditCardRequest) => {
    const editingDetails = await handleAxios(
      async () => {
        return await editCardHandler(cardId, data)
      },
      { errorMessage: CHANGES_SAVE_FAILED }
    )

    if (editingDetails) {
      alert('Saved', CHANGES_SAVED)

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
      { errorMessage: DEFINITION_CREATE_FAILED }
    )

    if (editingDetails) {
      alert('Saved', DEFINITION_CREATED)

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
      { errorMessage: DELETE_FAILED }
    )

    if (success) {
      alert('Deleted', DELETED)

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
      { errorMessage: DELETE_FAILED }
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
