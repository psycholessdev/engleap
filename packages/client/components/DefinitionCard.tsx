'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { IconVolume } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'

import type { Definition } from '@/api'

interface ISpeakerButton {
  audioUrl?: string
}

const SpeakerButton: React.FC<ISpeakerButton> = ({ audioUrl }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayAudio = () => {
    if (audio) {
      audio.play()
    }
  }

  useEffect(() => {
    setAudio(new Audio(audioUrl))

    return () => {
      if (audio) {
        audio.remove()
        setAudio(undefined)
      }
    }
  }, [])
  return (
    <button
      type="button"
      disabled={!audioUrl}
      onClick={handlePlayAudio}
      className={`p-2.5 rounded-full bg-el-primary text-white hover:bg-el-primary/60 ${
        audioUrl ? 'cursor-pointer' : 'opacity-30 bg-el-primary/60'
      }`}>
      <IconVolume />
    </button>
  )
}

interface IDefinitionCard {
  definition: Definition
}

export const DefinitionCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Skeleton className="p-6 rounded-full" />
        <Skeleton className="rounded-2xl w-30 h-5" />
      </div>
      <Skeleton className="rounded-2xl w-10 h-3" />
      <div />
      <Skeleton className="ml-2 rounded-2xl w-120 h-6" />
    </div>
  )
}

const DefinitionCard: React.FC<IDefinitionCard> = ({ definition }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <SpeakerButton audioUrl={definition.audio} />
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
export default DefinitionCard
