import { Button } from '@/components/ui/button'
import TipItem from '@/app/(pages)/components/TipItem'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import Image from 'next/image'
import Link from 'next/link'

import { getIsAuthed } from '@/utils'

export default async function Home() {
  const userId = await getIsAuthed()

  return (
    <div className="flex flex-col items-start lg:pb-0 pb-20">
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

        <div className="flex flex-col lg:w-[50%] w-full lg:gap-30 gap-15">
          <TipItem
            title="1 Create a Deck"
            text="Organize your vocabulary by topic, movie, show, or personal goal"
            image="/images/screenshots/deck-item.png"
          />
          <TipItem
            title="2 Create a Card with Real Context"
            text="Use sentences you encounter in daily life — from YouTube, TikTok, movies, books, or conversations"
            image="/images/screenshots/add-card-form.png"
          />
          <TipItem
            title="3 Select target words you want to learn"
            text="If we don’t detect them correctly, you can type them manually. Then click 'Generate Definitions'"
            image="/images/screenshots/select-target-words-form.png"
          />
          <TipItem
            title="4 Review your cards Daily with SRS"
            text="EngLeap uses the Spaced Repetition System (SM-2) to help move vocabulary into your long-term memory. The more you review, the deeper your immersion."
            image="/images/screenshots/review-card.png"
          />
        </div>
      </div>

      {/* FAQ */}
      <h1 className="font-ubuntu text-2xl font-medium text-white">FAQ</h1>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>How to customize an existing Deck?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance font-ubuntu">
            <p>
              To customize a Deck, simply copy it. Once copied, you have full control — as if you
              created it. You can edit custom definitions, change cards, and add your own. Your
              learning progress will be copied too. Tip: Unfollow the original Deck to avoid
              reviewing the same cards twice.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is Spaced Repetition System?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance font-ubuntu">
            <p>
              Spaced repetition is a learning technique where you review material at increasing
              intervals over time. The idea is to strengthen memory by reviewing information shortly
              after learning it, then again as memory starts to fade, and then at longer intervals.
              This method is designed to enhance long-term retention by optimizing the timing of
              review sessions.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Where do we get Definitions from?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance font-ubuntu">
            <p>Definitions are generated using the Merriam-Webster Intermediate Dictionary API.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is it free?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance font-ubuntu">
            <p>
              Yes! EngLeap is completely free and open-source. If you find it helpful, please
              support the project by{' '}
              <Link href="https://github.com/psycholessdev/engleap" target="_blank">
                giving it a ⭐️ on GitHub
              </Link>{' '}
              — it really helps!
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Footer */}
      <footer className="w-full lg:py-20 py-5 grid lg:grid-cols-2 grid-cols-1 lg:grid-rows-1 grid-rows-2 border-1 border-el-outline rounded-3xl">
        <div className="flex justify-center items-center">
          <Image
            src="/favicon.png"
            alt="EngLeap logo"
            width={130}
            height={130}
            className="select-none drag-none"
          />
        </div>
        <div className="flex flex-col items-center">
          <Button variant="link" asChild>
            <Link href="https://psycholess.com/" target="_blank">
              Developer&apos;s site
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="https://github.com/psycholessdev/engleap" target="_blank">
              Give me a star on GitHub
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="https://github.com/thyagoluciano/sm2" target="_blank">
              SM-2 Spaced Repetition algorithm
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="https://www.merriam-webster.com/" target="_blank">
              Merriam-Webster dictionary
            </Link>
          </Button>
          <h4 className="font-ubuntu text-white mt-4">EngLeap app, Psycholess (developer), 2025</h4>
        </div>
      </footer>
    </div>
  )
}
