'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks'
import { CreateDeck, type CreateDeckRequest } from '@/api'

export const useCreateDeck = () => {
  const router = useRouter()
  const { alert } = useNotifications()
  const [failureMessage, setFailureMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const createDeck = async (data: CreateDeckRequest) => {
    setFailureMessage('')

    try {
      setLoading(true)
      await CreateDeck(data)
      alert('Success', 'Your Deck was successfully created.')
      router.push('/decks')
      return true
    } catch (error: AxiosError) {
      if (error.response) {
        setFailureMessage(error.response?.reason || 'Unexpected error occurred')
      } else {
        setFailureMessage('Internet connection error')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  return { failureMessage, loading, createDeck }
}
