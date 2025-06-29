'use client'
import React from 'react'

import { AlertProvider, AuthProvider, NotificationsProvider } from '@/hooks'
import { queryClient as queryClientInstance } from '@/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = React.useState(queryClientInstance)
  return (
    <NotificationsProvider>
      <AlertProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AuthProvider>
      </AlertProvider>
    </NotificationsProvider>
  )
}
export default AppProviders
