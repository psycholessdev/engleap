import Deck from './components/Deck'
import { getIsAuthed } from '@/utils'
import { redirect } from 'next/navigation'

export default async function Home() {
  if (!(await getIsAuthed())) {
    redirect('/signin')
  }

  return (
    <>
      <h1 className="font-ubuntu text-3xl text-white py-8">📗 My decks</h1>

      <div>
        <Deck title="B1 Law terms" cardsTotalCount={374} cardsNewCount={255} cardsDueCount={121} />
      </div>
    </>
  )
}
