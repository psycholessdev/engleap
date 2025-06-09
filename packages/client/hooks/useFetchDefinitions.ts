'use client'
import React, { useEffect } from 'react'
import { getDefinitionsForCard, type Definition } from '@/api'

export const useFetchDefinitions = (cardId: string) => {
  const [definitions, setDefinitions] = React.useState<Definition[] | undefined | null>(undefined)

  useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        const definitions = await getDefinitionsForCard(cardId)
        setDefinitions(definitions)
      } catch (error) {
        console.error(error)
        setDefinitions(null)
      }
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
