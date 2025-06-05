'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks'
import {
  createDeck as createDeckHandler,
  editDeck as editDeckHandler,
  followDeck as followDeckHandler,
  unfollowDeck as unfollowDeckHandler,
  type ChangeFollowStatusDeckRequest,
  type CreateDeckRequest,
  type EditDeckRequest,
} from '@/api'

export const useDeckController = () => {
  const router = useRouter()
  const { alert } = useNotifications()
  const [failureMessage, setFailureMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const createDeck = async (data: CreateDeckRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      await createDeckHandler(data)
      alert('Success', 'Your Deck was successfully created.')
      router.push('/decks')
      return true
    } catch (error: AxiosError) {
      if (error.response) {
        alert('Error', error.response?.reason || 'Unexpected error occurred', 'failure')
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        alert('Failure', 'Internet connection error', 'failure')
        setFailureMessage('Internet connection error')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const editDeck = async (deckId: string, data: EditDeckRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      const editedDeck = await editDeckHandler(deckId, data)
      alert('Success', 'The changes were saved')
      return editedDeck
    } catch (error: AxiosError) {
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

  const followDeck = async (data: ChangeFollowStatusDeckRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      await followDeckHandler(data)
      alert('Success', 'Now you are following the Deck')
      return true
    } catch (error: AxiosError) {
      if (error.response) {
        alert('Error', error.response?.reason || 'Unexpected error occurred', 'failure')
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        alert('Failure', 'Internet connection error', 'failure')
        setFailureMessage('Internet connection error')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const unfollowDeck = async (data: ChangeFollowStatusDeckRequest) => {
    setFailureMessage('')

    try {
      if (loading) return false

      setLoading(true)
      await unfollowDeckHandler(data)
      alert('Success', 'You are no longer following the Deck')
      return true
    } catch (error: AxiosError) {
      if (error.response) {
        alert('Error', error.response?.reason || 'Unexpected error occurred', 'failure')
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        alert('Failure', 'Internet connection error', 'failure')
        setFailureMessage('Internet connection error')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  return { failureMessage, loading, createDeck, editDeck, followDeck, unfollowDeck }
}
