'use client'
import React from 'react'
import Image from 'next/image'
import { IconReload } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

const FailureFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <div className="w-full py-6 px-3 border-1 border-el-outline rounded-2xl flex flex-col justify-center items-center gap-3">
      <div className="flex flex-col items-center">
        <Image
          src="/icons/white-usb-cable.png"
          alt="Cable icon"
          width={55}
          height={55}
          className="select-none drag-none"
        />
        <h2 className="font-ubuntu text-xl text-white">Failed to load content</h2>
        <span className="text-el-outline-variant">
          Try to check you internet connection and try again. If that did not help, try to refresh
          the page.
        </span>
      </div>
      <Button onClick={onRetry} variant="outline">
        <IconReload /> Try again
      </Button>
    </div>
  )
}
export default FailureFallback
