import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'

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
    <html lang="en">
      <body className={`${ubuntu.variable} antialiased`}>
        <main className="w-full h-auto box-border flex flex-col items-center justify-center gap-5 pt-[90px] pl-[90px]">
          <Header />
          <Navbar />
          <div className="w-[90%] h-auto">{children}</div>
        </main>
      </body>
    </html>
  )
}
