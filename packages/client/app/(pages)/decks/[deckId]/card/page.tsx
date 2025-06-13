import { getIsAuthed } from '@/utils'
import { notFound, redirect } from 'next/navigation'
import { getDeck } from '@/serverApi'
import AddCardForm from '@/components/AddCardForm'

export default async function Home({ params }: { params: Promise<{ deckId: string }> }) {
  const userId = await getIsAuthed()
  if (!userId) {
    redirect('/signin')
  }
  const { deckId } = await params

  const responseData = await getDeck(deckId)
  if (!responseData || responseData.deck.creatorId !== userId) {
    // Deck does not exist or user is not allowed to edit the Deck
    notFound()
  }

  return (
    <div>
      <AddCardForm deckId={deckId} />
    </div>
  )
}
