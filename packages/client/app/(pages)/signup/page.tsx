import React from 'react'
import SignUpForm from './components/SignUpForm'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: "Sign up today and become fluent in English. It's free and effective!",
}

export default async function Home() {
  if (await getIsAuthed()) {
    redirect('/decks')
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SignUpForm />
    </div>
  )
}
