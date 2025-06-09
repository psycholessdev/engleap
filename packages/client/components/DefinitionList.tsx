'use client'
import React from 'react'
import DefinitionCard, { DefinitionCardSkeleton } from '@/components/DefinitionCard'

import { useFetchDefinitions } from '@/hooks'
import type { Definition } from '@/api'

interface IDefinitionList {
  cardId: string
}

const DefinitionList: React.FC<IDefinitionList> = ({ cardId }) => {
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
        <DefinitionCard key={def.id} definition={def} />
      ))}
    </div>
  )
}

export default DefinitionList
