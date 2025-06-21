'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import { IconCaretDownFilled } from '@tabler/icons-react'

import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { emojiList } from '@/app/consts'

interface IEmojiPicker {
  pickedEmoji: string
  onPick: (emoji: string) => void
  disabled?: boolean
}

const EmojiPicker: React.FC<IEmojiPicker> = ({ pickedEmoji, onPick, disabled }) => {
  const { ref, inView } = useInView()
  const [items, setItems] = useState(emojiList.slice(0, 500))

  const fetchNext = () => {
    setItems(prevItems =>
      prevItems.concat(emojiList.slice(prevItems.length - 1, prevItems.length - 1 + 500))
    )
  }

  useEffect(() => {
    if (inView && items.length !== emojiList.length) {
      fetchNext()
    }
  }, [inView, items])

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
          {items.map((emoji, i) => (
            <Toggle
              onClick={() => onPick(emoji)}
              className="cursor-pointer"
              pressed={false}
              key={i}>
              {emoji}
            </Toggle>
          ))}
          <div ref={ref} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default EmojiPicker
