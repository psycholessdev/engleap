import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getDeck } from '@/serverApi'
import React from 'react'
import DeckHead from '@/app/(pages)/decks/[deckId]/components/DeckHead'
import CardsList from '@/components/CardsList'

export default async function Home({ params }: { params: Promise<{ deckId: string }> }) {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }
  const { deckId } = await params

  const responseData = await getDeck(deckId)
  if (!responseData) {
    notFound()
  }

  return (
    <>
      <DeckHead
        deckId={deckId}
        creatorId={responseData.deck.creatorId}
        title={responseData.deck.title}
        isPublic={responseData.deck.isPublic}
        cardsTotal={responseData.cardsTotal}
        usersFollowing={responseData.usersFollowing}
      />
      <p className="font-ubuntu my-5 text-white text-lg">{responseData.deck.description}</p>

      <CardsList deckId={deckId} />
    </>
  )
}
