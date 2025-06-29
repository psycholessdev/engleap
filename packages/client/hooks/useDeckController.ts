'use client'
import { useRouter } from 'next/navigation'
import { useNotifications, useAxiosErrorHandler } from '@/hooks'
import {
  createDeck as createDeckHandler,
  editDeck as editDeckHandler,
  copyDeck as copyDeckHandler,
  followDeck as followDeckHandler,
  unfollowDeck as unfollowDeckHandler,
} from '@/api'
import type { ChangeFollowStatusDeckRequest, CreateDeckRequest, EditDeckRequest } from '@/types'
import {
  DECK_CREATED,
  DECK_CREATE_FAILED,
  CHANGES_SAVE_FAILED,
  CHANGES_SAVED,
  DECK_COPIED,
  DECK_COPY_FAILED,
  DECK_FOLLOWED,
  DECK_FOLLOW_FAILED,
  DECK_UNFOLLOW_FAILED,
  DECK_UNFOLLOWED,
} from '@/consts'

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

  const copyDeck = async (deckId: string) => {
    const copiedDeck = await handleAxios(
      async () => {
        return await copyDeckHandler(deckId)
      },
      { errorMessage: DECK_COPY_FAILED }
    )

    if (copiedDeck) {
      alert('Copied', DECK_COPIED)
    }
    return copiedDeck
  }

  const followDeck = async (data: ChangeFollowStatusDeckRequest) => {
    const isSuccess = await handleAxios(
      async () => {
        await followDeckHandler(data)
        return true
      },
      { errorMessage: DECK_FOLLOW_FAILED }
    )

    if (isSuccess) {
      alert('Following', DECK_FOLLOWED)
    }
    return !!isSuccess
  }

  const unfollowDeck = async (data: ChangeFollowStatusDeckRequest) => {
    const isSuccess = await handleAxios(
      async () => {
        await unfollowDeckHandler(data)
        return true
      },
      { errorMessage: DECK_UNFOLLOW_FAILED }
    )

    if (isSuccess) {
      alert('Unfollowed', DECK_UNFOLLOWED)
    }
    return !!isSuccess
  }

  return { failureMessage, isLoading, createDeck, editDeck, copyDeck, followDeck, unfollowDeck }
}
