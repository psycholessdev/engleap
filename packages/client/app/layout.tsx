import React from 'react'
import './globals.css'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import RootElement from '@/components/RootElement'
import { Ubuntu } from 'next/font/google'

import type { Metadata, Viewport } from 'next'
import { getBackendUrl } from '@/utils'
import { AuthProvider } from '@/hooks/useAuth'
import { NotificationsProvider } from '@/hooks'

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['300', '500', '700'],
})

export const metadata: Metadata = {
  title:
    'EngLeap — Start thinking in English — not just translating it. Make your next leap with EngLeap',
  description:
    'EngLeap is a powerful English learning app that helps you master the language naturally and effectively, without relying on your native tongue.',
}

export const viewport: Viewport = {
  themeColor: '#050E00',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ubuntu.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{ __html: `window.__API_URL__ = '${getBackendUrl(true)}';` }}
        />

        <NotificationsProvider>
          <AuthProvider>
            <RootElement>
              <Header />
              <Navbar />
              <div className="w-[90%] h-full">{children}</div>
            </RootElement>
          </AuthProvider>
        </NotificationsProvider>
      </body>
    </html>
  )
}
