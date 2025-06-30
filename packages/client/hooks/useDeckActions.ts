'use client'
import { useNotifications, useAxiosErrorHandler } from '@/hooks'
import {
  copyDeck as copyDeckHandler,
  followDeck as followDeckHandler,
  unfollowDeck as unfollowDeckHandler,
} from '@/api'
import type { ChangeFollowStatusDeckRequest } from '@/types'
import {
  DECK_COPIED,
  DECK_COPY_FAILED,
  DECK_FOLLOWED,
  DECK_FOLLOW_FAILED,
  DECK_UNFOLLOW_FAILED,
  DECK_UNFOLLOWED,
} from '@/consts'

export const useDeckActions = () => {
  const alert = useNotifications()
  const { handleAxios, isLoading, failureMessage } = useAxiosErrorHandler()

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

  return { failureMessage, isLoading, copyDeck, followDeck, unfollowDeck }
}
