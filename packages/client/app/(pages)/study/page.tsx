import type { Metadata } from 'next'
import StudyCards from '@/components/StudyCards'
import { getIsAuthed } from '@/utils'
import { redirect, notFound } from 'next/navigation'

import { getDeck } from '@/serverApi'

export const metadata: Metadata = {
  title: 'Review you Decks',
  description:
    'EngLeap schedules your reviews using spaced repetition to move vocabulary into your long-term memory. The more you review, the deeper your immersion.',
}

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
