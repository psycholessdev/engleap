'use client'
import React, { useState } from 'react'
import DefinitionList from '@/components/DefinitionList'
import { Button } from '@/components/ui/button'
import { IconEye } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'

import { dissectSentenceByTargetWords } from '@/utils'
import { useSRSController } from '@/hooks'

const Sentence: React.FC<{
  text: string
  targetWords: string[]
  showBg?: boolean
}> = ({ text, targetWords, showBg }) => {
  const dissectedSentence = dissectSentenceByTargetWords(text, targetWords)
  return (
    <div
      className={`w-full rounded-2xl flex justify-center items-center transition-colors my-6 py-5 px-3 ${
        showBg ? 'bg-el-tertiary-container' : ''
      }`}>
      <p className="font-ubuntu lg:text-2xl text-lg leading-7 text-white">
        {dissectedSentence.map((word, i) => {
          return targetWords.includes(word) ? (
            <span className="px-1 bg-el-inverse-primary text-black rounded-lg" key={i}>
              {word}
            </span>
          ) : (
            <span key={i}>{word}</span>
          )
        })}
      </p>
    </div>
  )
}

const ActionBar: React.FC<{
  revealed: boolean
  onReveal: () => void
  onRate: (rate: number) => void
}> = ({ revealed, onReveal, onRate }) => {
  return (
    <div className="sticky bottom-0 w-full py-3 border-t-1 border-t-el-outline flex flex-col items-center gap-3 bg-el-root-bg">
      {revealed && <h2 className="text-xl">Rate your answer</h2>}
      <div className="w-full flex justify-center gap-2">
        {!revealed && (
          <Button variant="secondary" onClick={onReveal}>
            <IconEye />
            Reveal Answer
          </Button>
        )}
        {revealed && (
          <>
            <Button variant="destructive" onClick={() => onRate(0)}>
              (0) Completely forgot
            </Button>
            <Button variant="secondary" onClick={() => onRate(1)}>
              (1) Incorrect but familiar
            </Button>
            <Button variant="secondary" onClick={() => onRate(2)}>
              (2) Incorrect but remembered after hint
            </Button>
            <Button variant="secondary" onClick={() => onRate(3)}>
              (3) Correct but difficult recall
            </Button>
            <Button variant="secondary" onClick={() => onRate(4)}>
              (4) Correct response after hesitation
            </Button>
            <Button onClick={() => onRate(5)}>(5) Perfect recall</Button>
          </>
        )}
      </div>
    </div>
  )
}

interface IStudyCards {
  deckId?: string
}

const StudyCards: React.FC<IStudyCards> = ({ deckId }) => {
  const { cardSRSPool, finishCard, allCardsFetched } = useSRSController(deckId)
  const [revealed, setRevealed] = useState(false)

  const handleCardPass = (grade: number) => {
    setRevealed(false)
    finishCard(cardSRSPool[0].cardId, grade)
  }

  return (
    <div className="w-full h-full py-3">
      {!allCardsFetched && cardSRSPool.length === 0 && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}

      {allCardsFetched && cardSRSPool.length === 0 && (
        <div className="w-full h-full flex justify-center items-center">
          That&apos;s all for today. Great job!
        </div>
      )}

      {cardSRSPool.length > 0 && (
        <>
          <div className="w-full h-auto min-h-full flex flex-col justify-center items-center lg:border-1 lg:border-el-outline rounded-3xl lg:p-6">
            <Sentence
              text={cardSRSPool[0].card.sentence}
              targetWords={cardSRSPool[0].card.targetWords}
              showBg={revealed}
            />
            {revealed && <DefinitionList cardId={cardSRSPool[0].card.id} />}
          </div>

          <ActionBar
            onReveal={() => setRevealed(true)}
            revealed={revealed}
            onRate={handleCardPass}
          />
        </>
      )}
    </div>
  )
}
export default StudyCards
