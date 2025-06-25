import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import React from 'react'
import CreateDeckForm from './components/CreateDeckForm'

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
