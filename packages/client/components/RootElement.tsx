'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'

const RootElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLogged } = useAuth()
  return (
    <main role="main" className={`main ${isLogged ? 'nav-padding' : ''}`}>
      {children}
    </main>
  )
}
export default RootElement
