'use client'
import React from 'react'
import Image from 'next/image'
import { IconReload } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

interface IFetchFailureFallback {
  className?: string
  icon?: string
  title?: string
  text?: string
  hideButton?: boolean
  onRetry?: () => void
}

// Beautiful card with retry button
const FetchFailureFallback: React.FC<IFetchFailureFallback> = ({
  hideButton,
  onRetry,
  className,
  icon = '/icons/white-usb-cable.png',
  title = 'Failed to load content',
  text = 'Try to check you internet connection and try again. If that did not help, try to refresh the page.',
}) => {
  return (
    <div
      className={`w-full py-6 px-3 border-1 border-el-outline rounded-2xl flex flex-col justify-center items-center gap-3 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Image
          src={icon}
          alt="Cable icon"
          width={55}
          height={55}
          className="select-none drag-none"
        />
        <h2 className="font-ubuntu text-xl text-white">{title}</h2>
        <span className="text-el-outline-variant">{text}</span>
      </div>
      {!hideButton && (
        <Button onClick={onRetry} variant="outline">
          <IconReload /> Try again
        </Button>
      )}
    </div>
  )
}
export default FetchFailureFallback
