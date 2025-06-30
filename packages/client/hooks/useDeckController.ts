'use client'
import { useRouter } from 'next/navigation'
import { useNotifications, useAxiosErrorHandler } from '@/hooks'
import { createDeck as createDeckHandler, editDeck as editDeckHandler } from '@/api'
import type { CreateDeckRequest, EditDeckRequest } from '@/types'
import { DECK_CREATED, DECK_CREATE_FAILED, CHANGES_SAVE_FAILED, CHANGES_SAVED } from '@/consts'

export const useDeckController = () => {
  const router = useRouter()
  const alert = useNotifications()
  const { handleAxios, isLoading, failureMessage } = useAxiosErrorHandler()

  const createDeck = async (data: CreateDeckRequest) => {
    const isSuccess = await handleAxios(
      async () => {
        await createDeckHandler(data)
        return true
      },
      { errorMessage: DECK_CREATE_FAILED }
    )

    if (isSuccess) {
      alert('Created', DECK_CREATED)
      router.push('/decks')
    }
    return !!isSuccess
  }

  const editDeck = async (deckId: string, data: EditDeckRequest) => {
    const editedDeck = await handleAxios(
      async () => {
        return await editDeckHandler(deckId, data)
      },
      { errorMessage: CHANGES_SAVE_FAILED }
    )

    if (editedDeck) {
      alert('Saved', CHANGES_SAVED)
    }
    return editedDeck
  }

  return { failureMessage, isLoading, createDeck, editDeck }
}
