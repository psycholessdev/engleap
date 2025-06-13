import StudyCards from '@/components/StudyCards'
import { getIsAuthed } from '@/utils'
import { redirect, notFound } from 'next/navigation'

import { getDeck } from '@/serverApi'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ deckId?: string }>
}) {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  const deckId = (await searchParams).deckId
  if (deckId) {
    const deck = await getDeck(deckId)

    if (!deck) notFound()
  }

  return <StudyCards deckId={deckId} />
}
