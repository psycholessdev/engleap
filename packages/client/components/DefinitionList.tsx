'use client'
import React, { useEffect } from 'react'
import DefinitionCard, { DefinitionCardSkeleton } from '@/components/DefinitionCard'

import { useInView } from 'react-intersection-observer'
import { useAuth, useInfiniteDefinitions } from '@/hooks'
import type { Definition } from '@/api'

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
  const { definitions, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteDefinitions(cardId)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5 pb-20">
      {definitions &&
        definitions.map((def: Definition) => (
          <DefinitionCard
            key={def.id}
            disabled={disabled}
            definition={def}
            showButtons={
              showButtons &&
              userId &&
              def.createdByUserId &&
              def.source === 'user' &&
              def.createdByUserId === userId
            }
            onDelete={onDelete}
          />
        ))}
      {status === 'error' && <p>Try again</p>}
      {isFetching && (
        <>
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <DefinitionCardSkeleton key={i} />
            ))}
        </>
      )}
      <div ref={ref} />
    </div>
  )
}

export default DefinitionList
