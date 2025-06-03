'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'

const RootElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLogged } = useAuth()
  return (
    <main
      className="w-full min-h-screen h-auto box-border flex flex-col items-center justify-center gap-5 pt-[90px] transition-all"
      style={{ paddingLeft: isLogged ? 90 : 0 }}>
      {children}
    </main>
  )
}
export default RootElement
