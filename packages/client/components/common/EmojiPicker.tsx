'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import { IconCaretDownFilled } from '@tabler/icons-react'

import React from 'react'
import { emojiList } from '@/consts'

interface IEmojiPicker {
  pickedEmoji: string
  onPick: (emoji: string) => void
  disabled?: boolean
}

const EmojiPicker: React.FC<IEmojiPicker> = ({ pickedEmoji, onPick, disabled }) => {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Toggle className="cursor-pointer" pressed={true} disabled={disabled}>
          <span>{pickedEmoji}</span>
          <IconCaretDownFilled />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="h-70 overflow-y-auto">
        <div className="grid grid-cols-5">
          {emojiList.map((emoji, i) => (
            <Toggle
              onClick={() => onPick(emoji)}
              className="cursor-pointer"
              pressed={false}
              key={i}>
              {emoji}
            </Toggle>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default EmojiPicker
