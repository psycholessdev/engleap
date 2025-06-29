export interface Definition {
  id: string
  sourceEntryId: string
  wordId: string
  audio?: string
  text: string
  partOfSpeech:
    | 'noun'
    | 'pronoun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'phrasal verb'
    | 'idiom'
    | 'preposition'
    | 'conjunction'
    | 'interjection'
  labels: string[]
  syllabifiedWord: string
  offensive: boolean
  source: 'dictionary' | 'user'
  sourceName?: string
  approved: boolean
  createdByUserId: string
}

export type GetDefinitionsForCardResponse = Definition[]
