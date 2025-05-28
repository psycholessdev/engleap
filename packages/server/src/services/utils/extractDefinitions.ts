import {
  MerriamWebsterResponse,
  ExtractedDefinition,
  MerriamWebsterEntry,
  DictionaryServiceResult,
} from '../../types'

// result.shortdef string[] meaning (like drag*on)
// result.fl string Part of speech (like noun or verb)
// result.hwi.hw string pronunciation
// result.hwi.prs object[] sound.audio audio
// result.meta.offensive boolean
// result.meta.stems string[] synonyms (like with -s or with nearly the same meaning)
export function extractDefinitions(
  word: string,
  entries: MerriamWebsterResponse
): DictionaryServiceResult {
  if (!isMerriamWebsterEntry(entries)) {
    // not found
    return {
      id: word,
      found: false,
      extractedDefinitions: [],
      similarWords: entries,
    }
  }

  const definitions: ExtractedDefinition[] = []

  for (const entry of entries) {
    const syllabifiedWord = entry.hwi?.hw ?? ''
    const audio = entry.hwi?.prs?.[0]?.sound?.audio
    const audioUrl = audio
      ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audio[0]}/${audio}.mp3`
      : undefined
    const partOfSpeech = entry.fl
    const offensive = entry.meta.offensive
    const stems = entry.meta.stems ?? []

    const sseqBlocks = entry.def?.flatMap(defBlock => defBlock.sseq) ?? []

    for (const senseGroup of sseqBlocks) {
      for (const [type, sense] of senseGroup) {
        if (type !== 'sense') continue

        const labels: string[] = []
        let text = ''

        for (const [dtType, dtVal] of sense.dt) {
          if (dtType === 'text' && typeof dtVal === 'string') {
            // Clean definition text
            text = dtVal.replace(/\{.*?}/g, '').trim()
          }
        }

        if (Array.isArray(sense.lbs)) {
          labels.push(...sense.lbs)
        }

        if (text) {
          definitions.push({
            id: entry.meta.id,
            word,
            text,
            partOfSpeech,
            syllabifiedWord,
            pronunciationAudioUrl: audioUrl,
            offensive,
            labels,
            stems,
          })
        }
      }
    }
  }

  return {
    id: word,
    found: true,
    extractedDefinitions: definitions,
    similarWords: [],
  }
}

function isMerriamWebsterEntry(
  entries: MerriamWebsterResponse
): entries is Array<MerriamWebsterEntry> {
  return entries.length != 0 && typeof entries[0] !== 'string'
}
