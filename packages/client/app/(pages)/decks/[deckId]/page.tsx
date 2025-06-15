import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getDeck } from '@/serverApi'
import React from 'react'
import DeckHead from '@/app/(pages)/decks/[deckId]/components/DeckHead'
import CardsList from '@/components/CardsList'

export default async function Home({ params }: { params: Promise<{ deckId: string }> }) {
  const userId = await getIsAuthed()
  if (!userId) {
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
        showEditButtons={userId === responseData.deck.creatorId}
        title={responseData.deck.title}
        description={responseData.deck.description}
        isPublic={responseData.deck.isPublic}
        cardsTotal={responseData.cardsTotal}
        usersFollowing={responseData.usersFollowing}
        followingDefault={responseData.isUserFollowing}
      />
      <p className="font-ubuntu my-5 text-white lg:text-lg">{responseData.deck.description}</p>

      <CardsList
        deckId={deckId}
        cardCount={responseData.cardsTotal}
        showButtons={userId === responseData.deck.creatorId}
      />
    </>
  )
}
