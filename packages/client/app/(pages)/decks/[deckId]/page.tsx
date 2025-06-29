import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getDeck } from '@/serverApi'
import type { Metadata } from 'next'
import React from 'react'

import DeckHead from '@/app/(pages)/decks/[deckId]/components/DeckHead'
import CardsList from '@/components/CardsList'

type Params = Promise<{ deckId: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { deckId } = await params

  if (!deckId) {
    return { title: 'Error' }
  }
  const deck = await getDeck(deckId)
  if (!deck) {
    return { title: 'Error' }
  }

  return { title: deck.title }
}

export default async function Home({ params }: { params: Params }) {
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
