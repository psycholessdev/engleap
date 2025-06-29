'use client'
import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'

interface HandleAxiosOptions {
  errorTitle?: string
  errorMessage?: string
  showAlert?: boolean
  createFailureMessage?: boolean

  // parallel requests are blocked by default
  allowParallelLoading?: boolean

  // if set to true, loading state will not be affected for this request
  // Note: request still will be rejected if parallel loading disabled and another request is executing
  ignoreLoading?: boolean
}

export const useAxiosErrorHandler = () => {
  const [parallelLoadings, setParallelLoadings] = useState(0)
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
      ignoreLoading = false,
    } = options || {}

    if (!allowParallelLoading && parallelLoadings > 0) {
      throw new Error(
        'Cannot perform another request until the previous one is finished. If you want to do requests in parallel, enable the allowParallelLoading flag.'
      )
    }

    try {
      if (!ignoreLoading) {
        setParallelLoadings(value => value + 1)
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
      if (!ignoreLoading) {
        setParallelLoadings(value => value - 1)
      }
    }
  }

  return { handleAxios, isLoading: parallelLoadings > 0, failureMessage }
}
