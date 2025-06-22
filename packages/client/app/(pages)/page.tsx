import { Button } from '@/components/ui/button'
import TipItem from '@/app/(pages)/components/TipItem'
import { Badge } from '@/components/ui/badge'

import Image from 'next/image'
import Link from 'next/link'

import { getIsAuthed } from '@/utils'

export default async function Home() {
  const userId = await getIsAuthed()

  return (
    <div className="flex flex-col items-start pb-20">
      {/* Screen 1 */}
      <div className="w-full lg:h-screen grid lg:grid-cols-2 grid-cols-1 lg:grid-rows-1 grid-rows-[400px_1fr] relative bg-el-root-bg z-5">
        <div className="flex justify-center items-center">
          <Image
            src="/images/decorative-languages.png"
            alt="decorative languages"
            width={450}
            height={450}
            className="select-none drag-none"
          />
        </div>
        <div className="flex flex-col lg:justify-center items-center gap-7">
          <h1 className="font-ubuntu text-2xl font-medium text-white text-center">
            The free, fun, and effective way to learn a language!
          </h1>

          {!userId && (
            <div className="flex flex-col gap-2">
              <Button className="text-lg w-90" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" className="text-lg w-90" asChild>
                <Link href="/signin">I already have an account</Link>
              </Button>
            </div>
          )}
          {userId && (
            <Button className="text-lg w-90" asChild>
              <Link href="/decks">to My Decks</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Screen 2 */}
      <div className="w-full flex lg:flex-row flex-col items-start">
        <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2 flex flex-col justify-center items-center gap-7 lg:w-[50%] w-full lg:py-0 py-20">
          <Image
            src="/images/iphone-with-engleap.png"
            alt="decorative languages"
            width={150}
            height={280}
            className="select-none drag-none"
          />
          <div className="flex flex-col w-[70%] gap-2">
            <h2 className="font-ubuntu text-2xl font-medium text-white text-center">
              How it works?
            </h2>
            <h3 className="font-ubuntu text-lg text-el-inverse-primary text-center">
              It’s built on the principles of English-only immersion, space repetition, and
              contextual learning — to rewire your brain to think in English.
            </h3>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            <Badge variant="secondary">Target-Word Highlighting</Badge>
            <Badge variant="secondary">English Definitions Only</Badge>
            <Badge variant="secondary">Spaced Repetition Engine</Badge>
            <Badge variant="secondary">Pronunciation Audio</Badge>
            <Badge variant="secondary">Community Decks</Badge>
            <Badge variant="secondary">Recursive Growth</Badge>
          </div>
        </div>

        <div className="flex flex-col lg:w-[50%] w-full">
          <TipItem
            title="1 Create a Deck"
            text="Organize your vocabulary by topics, movies, shows, or personal goals"
            image="/images/screenshots/deck-item.png"
          />
          <TipItem
            title="2 Create a Card with Real Context"
            text="Add sentences you encounter in daily life — from YouTube, TikTok, movies, books, or conversations."
            image="/images/screenshots/add-card-form.png"
          />
          <TipItem
            title="3 Select target words you want to learn"
            text="If we did not detect them correctly, you can type them. Then click “Generate Definitions”."
            image="/images/screenshots/select-target-words-form.png"
          />
          <TipItem
            title="4 Review your cards Daily with SRS"
            text="EngLeap schedules your reviews using Spaced Repetition System (SM-2) to move vocabulary into your long-term memory. The more you review, the deeper your immersion."
            image="/images/screenshots/review-card.png"
          />
        </div>
      </div>
    </div>
  )
}
