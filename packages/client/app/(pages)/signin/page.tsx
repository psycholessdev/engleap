import React from 'react'
import SignInForm from './components/SignInForm'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in and start reviewing your cards',
}

export default async function Home() {
  if (await getIsAuthed()) {
    redirect('/decks')
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SignInForm />
    </div>
  )
}
