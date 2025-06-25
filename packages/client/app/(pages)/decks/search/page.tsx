import React from 'react'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'

import PublicDeckList from '@/components/PublicDeckList'

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <div className="py-8 flex flex-col items-start gap-3">
        <h1 className="font-ubuntu text-3xl text-white">🔎 Search public Decks</h1>
        <p className="text-muted-foreground text-sm">
          Browse public Decks shared by the Community of English learners.
        </p>
      </div>
      <PublicDeckList />
    </>
  )
}
