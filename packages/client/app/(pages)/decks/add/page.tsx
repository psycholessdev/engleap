import React from 'react'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

import CreateDeckForm from './components/CreateDeckForm'

export const metadata: Metadata = {
  title: 'Create Deck - Organize your vocabulary by topics, movies, shows, or personal goals',
}

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <h1 className="font-ubuntu text-3xl text-white py-8">🚀 Create a new Deck</h1>

      <CreateDeckForm />
    </>
  )
}
