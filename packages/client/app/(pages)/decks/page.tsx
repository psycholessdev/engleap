import Deck from './components/Deck'

export default function Home() {
  return (
    <>
      <h1 className="font-ubuntu text-3xl text-white py-8">📗 My decks</h1>

      <div>
        <Deck title="B1 Law terms" cardsTotalCount={374} cardsNewCount={255} cardsDueCount={121} />
      </div>
    </>
  )
}
