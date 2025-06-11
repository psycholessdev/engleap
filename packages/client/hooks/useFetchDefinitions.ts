'use client'
import React, { useEffect } from 'react'
import { getDefinitionsForCard, type Definition } from '@/api'
import { useAxiosErrorHandler } from '@/hooks'

export const useFetchDefinitions = (cardId: string) => {
  const { handleAxios } = useAxiosErrorHandler()
  const [definitions, setDefinitions] = React.useState<Definition[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDefinitions = async () => {
      const definitions = await handleAxios(
        async () => {
          return await getDefinitionsForCard(cardId)
        },
        { showAlert: false }
      )

      setDefinitions(definitions)
    }

    if (definitions === undefined) {
      fetchDefinitions()
    }
  }, [definitions])

  const refetchDefinitions = () => {
    setDefinitions(undefined)
  }

  return { definitions, refetchDefinitions }
}
