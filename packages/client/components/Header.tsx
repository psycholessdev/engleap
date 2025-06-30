'use client'
import React from 'react'
import AuthButton from '@/components/common/AuthButton'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks'

const Header = () => {
  const { isLogged, isLoading, logout } = useAuth()

  return (
    <header className="header-container">
      <div>
        <Link href="/" className="flex items-center lg:gap-7 gap-3" aria-label="Navigate to home">
          <Image
            src="/favicon.png"
            aria-label="EngLeap logo"
            alt="App Logo"
            className="select-none drag-none"
            width={41}
            height={40}
            priority
          />
          <h3 className="text-el-primary text-2xl select-none">EngLeap</h3>
        </Link>
      </div>

      <AuthButton isLoading={isLoading} isLogged={isLogged} onLogout={logout} />
    </header>
  )
}

export default Header
