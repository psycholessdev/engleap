'use client'
import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'

interface HandleAxiosOptions {
  errorTitle?: string
  errorMessage?: string
  showAlert?: boolean
  createFailureMessage?: boolean

  // parallel requests are blocked by default
  // if set to true loading state will be ignored for this request and parallel request can be performed
  allowParallelLoading?: boolean
}

export const useAxiosErrorHandler = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [failureMessage, setFailureMessage] = useState('')
  const alert = useNotifications()

  const handleAxios = async <T>(
    callback: () => Promise<T | null>,
    options?: HandleAxiosOptions
  ): Promise<T | null> => {
    const {
      errorTitle = 'Request Failed',
      errorMessage = 'Unexpected error occurred',
      showAlert = true,
      createFailureMessage = true,
      allowParallelLoading = false,
    } = options || {}

    try {
      if (!allowParallelLoading && isLoading) return null

      if (!allowParallelLoading) {
        setIsLoading(true)
      }
      setFailureMessage('')

      return await callback()
    } catch (error: AxiosError) {
      let reason = 'Internet connection error: Check your internet connection'
      if (error.response) {
        reason = `${errorMessage}. ${error.response?.data?.reason}`
      }

      console.log(error)

      if (showAlert) {
        alert(errorTitle, reason, 'failure')
      }
      if (createFailureMessage) {
        setFailureMessage(reason)
      }

      return null
    } finally {
      if (!allowParallelLoading) {
        setIsLoading(false)
      }
    }
  }

  return { handleAxios, isLoading, failureMessage }
}
