export interface Card {
  id: string
  deckId: string
  sentence: string
  createdByUserId: string
  targetWords: TargetWord[]
}

export interface TargetWord {
  id: string
  word: {
    id: string
    text: string
  }
}

export interface UserProvidedDefinition {
  sourceEntryId: string
  word: string
  text: string
  partOfSpeech: string
  syllabifiedWord: string
  pronunciationAudioUrl?: string
  offensive?: boolean
  labels?: string[]
  stems?: string[]
}

export interface CreateCardRequest {
  sentence: string
  targetWords: string[]
  definitions?: UserProvidedDefinition[]
}
export interface CreateCardResponse {
  card: Card
  notFoundWords: string[]
  inserted: boolean
}

export type EditCardRequest = Partial<CreateCardRequest>
export interface EditCardResponse {
  card: Card
  notFoundWords: string[]
}
