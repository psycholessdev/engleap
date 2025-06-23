import { IDictionaryService } from './baseDictionaryService'
import {
  DictionaryServiceResult,
  DefinitionDTO,
  MerriamWebsterResponse,
  MerriamWebsterEntry,
} from '../../types'

const API_KEY = process.env.MERRIAM_WEBSTER_INTERMEDIATE_DICTIONARY_API_KEY

export class MerriamWebsterIntermediateService implements IDictionaryService {
  readonly sourceName = 'merriam-webster-intermediate'
  private readonly apiKey: string

  constructor() {
    if (!API_KEY) {
      throw new Error('Missing Merriam-Webster API key')
    }
    this.apiKey = API_KEY
  }

  async fetchDefinitions(word: string): Promise<DictionaryServiceResult> {
    const url = `https://www.dictionaryapi.com/api/v3/references/sd3/json/${encodeURIComponent(
      word
    )}?key=${this.apiKey}`

    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error(`Merriam-Webster API error: ${resp.statusText}`)
    }
    const json = (await resp.json()) as MerriamWebsterResponse

    return this.parseResponse(word, json)
  }

  private parseResponse(word: string, entries: MerriamWebsterResponse): DictionaryServiceResult {
    // If entries is an array of strings => suggestions
    if (Array.isArray(entries) && entries.length > 0 && typeof entries[0] === 'string') {
      return {
        word,
        found: false,
        extractedDefinitions: [],
        similarWords: entries as string[],
      }
    }
    if (!Array.isArray(entries) || entries.length === 0) {
      return {
        word,
        found: false,
        extractedDefinitions: [],
        similarWords: [],
      }
    }

    // entries is MerriamWebsterEntry[]
    const definitions: DefinitionDTO[] = []

    for (const entry of entries as MerriamWebsterEntry[]) {
      const syllabifiedWord = entry.hwi.hw
      // pronunciation: take first prs if exists
      const audioCode = entry.hwi?.prs?.[0]?.sound?.audio
      const pronunciationAudioUrl = audioCode
        ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioCode[0]}/${audioCode}.mp3`
        : undefined
      const partOfSpeech = entry.fl
      const offensive = entry.meta?.offensive ?? false
      const stems = entry.meta?.stems ?? []

      // Handle entries without 'def' field (like cross-references)
      if (!entry.def || entry.def.length === 0) {
        // Try to use shortdef as fallback if available
        const shortDefs = entry.shortdef ?? []
        for (const shortDef of shortDefs) {
          if (shortDef && shortDef.trim()) {
            definitions.push({
              word,
              sourceEntryId: entry.meta?.id?.split(':')[0] ?? word,
              sourceName: this.sourceName,
              text: shortDef.trim(),
              partOfSpeech: partOfSpeech ?? '',
              difficulty: undefined,
              syllabifiedWord: syllabifiedWord ?? '',
              pronunciationAudioUrl,
              offensive,
              labels: [],
              stems,
            })
          }
        }
        continue
      }

      // Process def blocks
      const sseqBlocks = entry.def.flatMap(defBlock => defBlock.sseq)

      for (const senseGroup of sseqBlocks) {
        for (const [type, sense] of senseGroup) {
          if (type !== 'sense') continue

          let text = ''
          const labels: string[] = []

          // Ensure dt exists
          if (!sense.dt) continue

          for (const [dtType, dtVal] of sense.dt) {
            if (dtType === 'text' && typeof dtVal === 'string') {
              // FIXED: Properly remove Merriam-Webster format codes using regex
              text = this.cleanMerriamWebsterText(dtVal)
            }
          }

          // Handle labels
          if (Array.isArray(sense.lbs)) {
            labels.push(...sense.lbs)
          }

          // Only add definition if text is not empty after cleaning
          if (text && text.trim()) {
            definitions.push({
              word,
              sourceEntryId: entry.meta?.id?.split(':')[0] ?? word,
              sourceName: this.sourceName,
              text: text.trim(),
              partOfSpeech: partOfSpeech ?? 'unknown',
              difficulty: undefined,
              syllabifiedWord: syllabifiedWord ?? '',
              pronunciationAudioUrl,
              offensive,
              labels,
              stems,
            })
          }
        }
      }
    }

    return {
      word,
      serviceName: this.sourceName,
      found: definitions.length > 0,
      extractedDefinitions: definitions,
      similarWords: [],
    }
  }

  private cleanMerriamWebsterText(text: string): string {
    return (
      text
        // Remove all format codes like {bc}, {sx|word||}, {it}text{/it}, etc.
        .replace(/\{[^}]*}/g, '')
        // Clean up multiple spaces and commas
        .replace(/\s*,\s*,\s*/g, ', ') // Fix double commas
        .replace(/^\s*,\s*/, '') // Remove leading comma
        .replace(/\s*,\s*$/, '') // Remove trailing comma
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
    )
  }
}
