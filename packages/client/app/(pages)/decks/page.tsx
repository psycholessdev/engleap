import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'
import DeckList from '@/components/DeckList'

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <h1 className="font-ubuntu text-3xl text-white py-8">📗 My decks</h1>

      <DeckList />
    </>
  )
}
