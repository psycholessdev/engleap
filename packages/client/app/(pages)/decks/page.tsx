import React from 'react'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import DeckList from '@/components/DeckList'
import AddButtonGhost from '@/components/common/AddButtonGhost'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Decks',
}

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <div className="py-8 flex flex-col items-start gap-3">
        <h1 className="font-ubuntu text-3xl text-white">📗 My decks</h1>
        <p className="text-muted-foreground text-sm">
          To study a Deck, just click on it. To study all your Decks at once, use the Study button
          in the navbar.
        </p>
      </div>

      <Link href="/decks/add">
        <AddButtonGhost text="Create Deck" />
      </Link>
      <DeckList />
    </>
  )
}
