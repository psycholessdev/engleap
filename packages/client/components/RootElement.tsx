'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const RootElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  const { isLogged } = useAuth()
  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={`w-full h-screen overflow-y-auto box-border flex flex-col items-center justify-start pt-[90px] lg:pb-0 pb-20 transition-all ${
          isLogged ? 'root-element_p' : ''
        }`}>
        {children}
      </main>
    </QueryClientProvider>
  )
}
export default RootElement
