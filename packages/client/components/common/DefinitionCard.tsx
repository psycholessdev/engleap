'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { IconVolume, IconHelpOctagon } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useAuth } from '@/hooks'

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
      setAudio(val => {
        if (val) val.remove()
        return null
      })
    }
  }, [audioUrl])
  return (
    <button
      type="button"
      disabled={!audioUrl}
      onClick={handlePlayAudio}
      aria-label="Play pronunciation"
      className={`p-2.5 rounded-full bg-el-primary text-white hover:bg-el-primary/60 ${
        audioUrl ? 'cursor-pointer' : 'opacity-30 bg-el-primary/60'
      }`}>
      <IconVolume />
    </button>
  )
}

interface IDefinitionCard {
  disabled?: boolean
  definition: Definition
  showButtons?: boolean
  onDelete?: (defId: string) => void
}

export const DefinitionCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="p-6 rounded-full" />
        <Skeleton className="rounded-2xl w-30 h-5" />
      </div>
      <Skeleton className="rounded-2xl w-10 h-3" />
      <div />
      <Skeleton className="ml-2 rounded-2xl lg:w-120 w-80 lg:h-6 h-4" />
    </div>
  )
}

const DefinitionCard: React.FC<IDefinitionCard> = ({
  definition,
  disabled = false,
  showButtons = false,
  onDelete,
}) => {
  const { userId } = useAuth()
  const handleDelete = () => {
    if (onDelete) {
      onDelete(definition.id)
    }
  }
  return (
    <div className="w-full flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <SpeakerButton audioUrl={!disabled && definition.audio} />
        <span className="font-ubuntu text-2xl text-white">
          {definition.syllabifiedWord.replaceAll('*', '·')}
        </span>
      </div>
      <span className="font-ubuntu">{definition.partOfSpeech}</span>
      <div className="flex items-center gap-1">
        {definition.offensive && <Badge variant="destructive">Offensive</Badge>}
        {definition.source === 'user' && (
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Badge variant="secondary">
                User-defined
                <IconHelpOctagon />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {userId && definition.createdByUserId === userId ? (
                <span>Written by you</span>
              ) : userId && definition.approved ? (
                <span>Reviewed by an AI</span>
              ) : (
                <span>Was not reviewed</span>
              )}
            </TooltipContent>
          </Tooltip>
        )}
        {definition.labels.map((l, i) => (
          <Badge variant="secondary" key={i}>
            {l}
          </Badge>
        ))}
      </div>
      <span className="font-ubuntu text-white lg:text-lg lg:leading-6 leading-5 ml-2">
        {definition.text}
      </span>
      {showButtons && (
        <Button
          className="mt-2"
          type="button"
          disabled={disabled}
          variant="destructive"
          onClick={handleDelete}>
          Delete
        </Button>
      )}
    </div>
  )
}
export default React.memo(DefinitionCard)
