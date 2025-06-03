import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/hooks/useAuth'

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

const serverPort = Number(process.env.SERVER_PORT || 3001)
const apiServerUrl =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${serverPort}/api`
    : `${process.env.ORIGIN_PROD_URL}/api`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ubuntu.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: `window.__API_URL__ = '${apiServerUrl}';` }} />

        <main className="w-full min-h-screen h-auto box-border flex flex-col items-center justify-center gap-5 pt-[90px] pl-[90px]">
          <AuthProvider>
            <Header />
            <Navbar />
            <div className="w-[90%] h-auto">{children}</div>
          </AuthProvider>
        </main>
      </body>
    </html>
  )
}
