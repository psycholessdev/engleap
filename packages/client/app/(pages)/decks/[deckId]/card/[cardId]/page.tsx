import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getCard } from '@/serverApi'
import AddCardForm from '@/components/AddCardForm'
import type { Metadata } from 'next'

type Params = Promise<{ deckId: string; cardId: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { cardId } = await params

  if (!cardId) {
    return { title: 'Error' }
  }
  const card = await getCard(cardId)
  if (!card) {
    return { title: 'Error' }
  }

  return { title: `Edit Card - ${card.sentence}` }
}

export default async function Home({ params }: { params: Params }) {
  const userId = await getIsAuthed()
  if (!userId) {
    redirect('/signin')
  }
  const { deckId, cardId } = await params

  const card = await getCard(cardId)
  if (!card || card.createdByUserId !== userId) {
    // Deck does not exist or user is not allowed to edit the Deck
    notFound()
  }

  return (
    <div>
      <AddCardForm deckId={deckId} cardToEdit={card} />
    </div>
  )
}
