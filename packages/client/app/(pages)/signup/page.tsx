import React from 'react'
import AuthCard from './components/AuthCard'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'

export default async function Home() {
  if (await getIsAuthed()) {
    redirect('/decks')
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <AuthCard />
    </div>
  )
}
