'use client'
import { useRouter } from 'next/navigation'
import { useNotifications, useAxiosErrorHandler } from '@/hooks'
import {
  createDeck as createDeckHandler,
  editDeck as editDeckHandler,
  copyDeck as copyDeckHandler,
  followDeck as followDeckHandler,
  unfollowDeck as unfollowDeckHandler,
  type ChangeFollowStatusDeckRequest,
  type CreateDeckRequest,
  type EditDeckRequest,
} from '@/api'

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
      { errorMessage: 'Failed to create Deck' }
    )

    if (isSuccess) {
      alert('Created', 'Your Deck was successfully created.')
      router.push('/decks')
    }
    return !!isSuccess
  }

  const editDeck = async (deckId: string, data: EditDeckRequest) => {
    const editedDeck = await handleAxios(
      async () => {
        return await editDeckHandler(deckId, data)
      },
      { errorMessage: 'Failed to edit Deck' }
    )

    if (editedDeck) {
      alert('Saved', 'The changes were saved')
    }
    return editedDeck
  }

  const copyDeck = async (deckId: string) => {
    const copiedDeck = await handleAxios(
      async () => {
        return await copyDeckHandler(deckId)
      },
      { errorMessage: 'Failed to copy Deck' }
    )

    if (copiedDeck) {
      alert(
        'Copied',
        'The copy was made and all of your study progress was transferred successfully'
      )
    }
    return copiedDeck
  }

  const followDeck = async (data: ChangeFollowStatusDeckRequest) => {
    const isSuccess = await handleAxios(
      async () => {
        await followDeckHandler(data)
        return true
      },
      { errorMessage: 'Failed to follow Deck' }
    )

    if (isSuccess) {
      alert('Followed', 'Now you are following the Deck')
    }
    return !!isSuccess
  }

  const unfollowDeck = async (data: ChangeFollowStatusDeckRequest) => {
    const isSuccess = await handleAxios(
      async () => {
        await unfollowDeckHandler(data)
        return true
      },
      { errorMessage: 'Failed to unfollow Deck' }
    )

    if (isSuccess) {
      alert('Unfollowed', 'You are no longer following the Deck')
    }
    return !!isSuccess
  }

  return { failureMessage, isLoading, createDeck, editDeck, copyDeck, followDeck, unfollowDeck }
}
