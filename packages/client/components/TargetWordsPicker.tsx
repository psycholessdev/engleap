'use client'
import React from 'react'
import { Toggle } from '@/components/ui'

interface TargetWordsPickerProps {
  disabled: boolean
  targetWordsToSelect: string[]
  selectedTargetWords: string[]
  onTargetWordClick: (word: string) => void
}

const TargetWordsPicker: React.FC<TargetWordsPickerProps> = ({
  targetWordsToSelect,
  selectedTargetWords,
  onTargetWordClick,
  disabled,
}) => {
  return (
    <>
      {targetWordsToSelect.map((w, i) => (
        <Toggle
          pressed={selectedTargetWords.includes(w)}
          onPressedChange={() => onTargetWordClick(w)}
          variant="outline"
          className="cursor-pointer"
          key={`${w}-${i}`}
          disabled={disabled}>
          {w}
        </Toggle>
      ))}
    </>
  )
}

export { TargetWordsPicker }
