import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getCard } from '@/serverApi'
import AddCardForm from '@/components/AddCardForm'

export default async function Home({
  params,
}: {
  params: Promise<{ deckId: string; cardId: string }>
}) {
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
