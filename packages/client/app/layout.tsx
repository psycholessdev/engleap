import React from 'react'
import './globals.css'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import MainElementWrapper from '@/components/MainElementWrapper'
import AppProviders from '@/components/AppProviders'
import { Ubuntu } from 'next/font/google'

import type { Metadata, Viewport } from 'next'
import { getBackendUrl } from '@/utils'

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | EngLeap',
    default:
      'EngLeap — Start thinking in English — not just translating it. Make your next leap with EngLeap!',
  },
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

        <AppProviders>
          <MainElementWrapper>
            <Header />
            <Navbar />
            <div className="w-[90%] h-full">{children}</div>
          </MainElementWrapper>
        </AppProviders>
      </body>
    </html>
  )
}
