import type { Metadata } from 'next'
import React from 'react'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'

import PublicDeckList from '@/components/PublicDeckList'

export const metadata: Metadata = {
  title: 'Search Public Decks - choose the topic you like',
  description:
    'Browse or study decks created by other users for inspiration or specific themes. Learn only what you find interesting!',
}

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
