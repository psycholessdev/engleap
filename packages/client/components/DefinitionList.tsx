'use client'
import React, { useEffect } from 'react'
import DefinitionCard, { DefinitionCardSkeleton } from '@/components/common/DefinitionCard'
import FetchFailureFallback from '@/components/common/FetchFailureFallback'

import { useDebouncedCallback } from 'use-debounce'
import { useInView } from 'react-intersection-observer'
import { useAuth, useInfiniteDefinitions } from '@/hooks'
import { canEditDefinition } from '@/utils'
import type { Definition } from '@/types'

const DefinitionsListSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <DefinitionCardSkeleton key={i} />
        ))}
    </>
  )
}

interface IDefinitionList {
  cardId: string
  disabled?: boolean
  showButtons?: boolean
  onDelete?: (defId: string) => void
}

const DefinitionList: React.FC<IDefinitionList> = ({
  cardId,
  disabled = false,
  showButtons = false,
  onDelete,
}) => {
  const { userId } = useAuth()
  const { ref, inView } = useInView()
  const {
    definitions,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    status,
  } = useInfiniteDefinitions(cardId)

  const debouncedFetchNextPage = useDebouncedCallback(() => {
    fetchNextPage()
  }, 200)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      debouncedFetchNextPage()
    }
  }, [inView, hasNextPage, debouncedFetchNextPage, isFetchingNextPage])

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5 pb-20 w-full" aria-live="polite">
      {definitions &&
        definitions.map((def: Definition) => (
          <DefinitionCard
            key={def.id}
            disabled={disabled}
            definition={def}
            showButtons={showButtons && canEditDefinition(def, userId)}
            onDelete={onDelete}
          />
        ))}
      {status === 'error' && !isFetching && <FetchFailureFallback onRetry={refetch} />}
      {isFetching && <DefinitionsListSkeleton />}
      <div ref={ref} />
    </div>
  )
}

export default DefinitionList
