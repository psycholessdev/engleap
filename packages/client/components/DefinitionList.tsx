'use client'
import React from 'react'
import DefinitionCard, { DefinitionCardSkeleton } from '@/components/DefinitionCard'

import { useAuth, useFetchDefinitions } from '@/hooks'
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
  const { definitions } = useFetchDefinitions(cardId)

  if (definitions === null) {
    return <span>Loading</span>
  }

  if (definitions === undefined) {
    return (
      <div className="flex flex-col gap-5">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <DefinitionCardSkeleton key={i} />
          ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {definitions.map((def: Definition) => (
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
    </div>
  )
}

export default DefinitionList
