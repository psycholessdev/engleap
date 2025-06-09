'use client'
import React from 'react'
import { IconVolume } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'

import { useFetchDefinitions } from '@/hooks'
import { type Definition } from '@/api'

const SpeakerButton = () => {
  return (
    <button
      type="button"
      className="p-2.5 rounded-full bg-el-primary text-white cursor-pointer hover:bg-el-primary/60">
      <IconVolume />
    </button>
  )
}

interface IDefinition {
  definition: Definition
}

const Definition: React.FC<IDefinition> = ({ definition }) => {
  return (
    <div className="w-full flex flex-col gap-1 py-4 not-last:border-b not-last:border-b-el-outline">
      <div className="flex items-center gap-2">
        <SpeakerButton />
        <span className="font-ubuntu text-2xl text-white">
          {definition.syllabifiedWord.replaceAll('*', '·')}
        </span>
      </div>
      <span className="font-ubuntu">{definition.partOfSpeech}</span>
      <div className="flex items-center gap-1">
        {definition.offensive && <Badge variant="destructive">Offensive</Badge>}
        {definition.labels.map((l, i) => (
          <Badge variant="secondary" key={i}>
            {l}
          </Badge>
        ))}
      </div>
      <span className="font-ubuntu text-white text-lg ml-2">{definition.text}</span>
    </div>
  )
}

interface IDefinitionList {
  cardId: string
}

const DefinitionList: React.FC<IDefinitionList> = ({ cardId }) => {
  const { definitions } = useFetchDefinitions(cardId)

  if (!definitions) {
    return <span>Failed to fetch Definitions</span>
  }

  return (
    <div className="flex flex-col">
      {definitions.map((def: Definition) => (
        <Definition key={def.id} definition={def} />
      ))}
    </div>
  )
}

export default DefinitionList
