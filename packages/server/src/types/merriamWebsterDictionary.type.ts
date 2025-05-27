export interface DictionaryServiceResult {
  found: boolean
  extractedDefinitions: ExtractedDefinition[]
  similarWords: string[]
}

export type ExtractedDefinition = {
  id: string
  text: string
  partOfSpeech: string
  syllabifiedWord: string
  pronunciationAudioUrl?: string
  offensive: boolean
  labels: string[]
  stems: string[]
}

export type MerriamWebsterResponse = Array<MerriamWebsterEntry> | string[]

export interface MerriamWebsterEntry {
  meta: {
    id: string
    uuid: string
    src: string
    section: string
    stems: string[]
    offensive: boolean
  }
  hwi: HeadwordInfo
  fl: string // Part of speech (e.g., noun, verb)
  def?: DefinitionBlock[]
  et?: Array<[string, string]> // Etymology
  shortdef: string[]
}

export interface HeadwordInfo {
  hw: string // e.g., "drag*on" with breaks
  prs?: Pronunciation[]
}

export interface Pronunciation {
  mw: string // pronunciation spelling, e.g., "ˈdrag-ən"
  sound?: {
    audio: string // e.g., "dragon01"
  }
}

export interface DefinitionBlock {
  sseq: SenseSequence[][]
}

export type SenseSequence = ['sense', Sense] | ['bs', unknown] // 'bs' stands for "because of sense" or similar, rarely used

export interface Sense {
  sn?: string // sense number
  dt: DefinitionText[] // definitions, possibly with formatting like {bc}
  lbs?: string[] // labels like "capitalized", "usually", "often"
  sdsense?: {
    sd: string // sub-definition label
    dt: DefinitionText[]
  }
}

export type DefinitionText = ['text', string] | ['vis', Array<{ t: string }>]
