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

  const deck = await getDeck(deckId)
  if (!deck) {
    notFound()
  }

  return (
    <>
      <DeckHead
        deckId={deckId}
        showEditButtons={userId === deck.creatorId}
        title={deck.title}
        description={deck.description}
        emoji={deck.emoji}
        isPublic={deck.isPublic}
        cardsTotal={deck.cardCount}
        usersFollowing={deck.usersFollowing}
        followingDefault={deck.isUserFollowing}
      />
      <p className="font-ubuntu my-5 text-white lg:text-lg">{deck.description}</p>

      <CardsList
        deckId={deckId}
        cardCount={Number(deck.cardCount)}
        showButtons={userId === deck.creatorId}
      />
    </>
  )
}
