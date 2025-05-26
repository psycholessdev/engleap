import { MerriamWebsterResponse, ExtractedDefinition } from '../../types'

// result.shortdef string[] meaning (like drag*on)
// result.fl string Part of speech (like noun or verb)
// result.hwi.hw string pronunciation
// result.hwi.prs object[] sound.audio audio
// result.meta.offensive boolean
// result.meta.stems string[] synonyms (like with -s or with nearly the same meaning)
export function extractDefinitions(entries: MerriamWebsterResponse): ExtractedDefinition[] {
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
        const synonyms: string[] = []
        let text = ''

        for (const [dtType, dtVal] of sense.dt) {
          if (dtType === 'text' && typeof dtVal === 'string') {
            // Clean definition text
            text = dtVal.replace(/\{.*?}/g, '').trim()

            // Extract synonyms inside {sx|word||}
            const sxMatches = dtVal.match(/\{sx\|([^|}]+)\|/g)
            if (sxMatches) {
              for (const match of sxMatches) {
                const synonym = match.match(/\{sx\|([^|}]+)\|/)?.[1]
                if (synonym && !synonyms.includes(synonym)) {
                  synonyms.push(synonym)
                }
              }
            }
          }
        }

        if (Array.isArray(sense.lbs)) {
          labels.push(...sense.lbs)
        }

        if (text) {
          definitions.push({
            id: entry.meta.id,
            text,
            partOfSpeech,
            syllabifiedWord,
            pronunciationAudioUrl: audioUrl,
            offensive,
            labels,
            synonyms,
            stems,
          })
        }
      }
    }
  }

  return definitions
}
