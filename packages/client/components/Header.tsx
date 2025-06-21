'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconUserCircle, IconLogout2 } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks'

const Header = () => {
  const { isLogged, isLoading, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 lg:h-[90px] h-20 w-full bg-el-root-bg z-[4500] flex justify-between items-center px-4 border-b-1 border-b-el-outline">
      <div>
        <Link href="/" className="flex items-center lg:gap-7 gap-3">
          <Image
            src="/favicon.png"
            alt="App Logo"
            className="select-none drag-none"
            width={41}
            height={40}
          />
          <h3 className="text-el-primary text-2xl select-none">EngLeap</h3>
        </Link>
      </div>

      {isLoading && <Skeleton className="w-23 h-8 rounded-lg" />}
      {!isLoading &&
        (isLogged ? (
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <IconLogout2 /> Log out
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">
              <IconUserCircle /> Log in
            </Link>
          </Button>
        ))}
    </header>
  )
}

export default Header
