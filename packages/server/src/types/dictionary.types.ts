export interface DictionaryServiceResult {
  serviceName?: string
  word: string
  found: boolean
  extractedDefinitions: DefinitionDTO[]
  similarWords: string[]
}

// A unified definition format returned by any dictionary source.
export type DefinitionDTO = {
  word: string // exact name in local db (placed)
  sourceEntryId: string // what word this definition for (place)
  sourceName?: string
  text: string
  partOfSpeech: string
  difficulty?: string
  syllabifiedWord: string
  pronunciationAudioUrl?: string
  offensive: boolean
  labels: string[]
  stems: string[]
}
