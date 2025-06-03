import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconUserCircle } from '@tabler/icons-react'

const Header = () => {
  return (
    <header className="absolute top-0 left-0 h-[90px] w-full bg-el-root-bg z-[4500] flex justify-between items-center px-4 border-b-1 border-b-el-outline">
      <div>
        <Link href="/" className="flex items-center">
          <Image
            src="/favicon.png"
            alt="App Logo"
            className="select-none drag-none"
            width={41}
            height={40}
          />
          <h3 className="text-el-primary text-2xl ml-7 select-none">EngLeap</h3>
        </Link>
      </div>
      <Button variant="outline" size="sm">
        <IconUserCircle /> Log in
      </Button>
    </header>
  )
}

export default Header
