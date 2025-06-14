import React from 'react'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import DeckList from '@/components/DeckList'

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <div className="py-8 flex flex-col gap-3">
        <h1 className="font-ubuntu text-3xl text-white">📗 My decks</h1>
        <p className="text-muted-foreground text-sm">
          To study a Deck, just click on it. To study all the Decks simultaneously, click the Study
          button on the navbar.
        </p>
      </div>

      <DeckList />
    </>
  )
}
