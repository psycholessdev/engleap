// Dissects a sentence into an array of strings, separating it based on the positions of specified target words.
// The function identifies occurrences of each target word within the input text, sorts them by their starting positions,
// and then extracts substrings before, between, and after these target words.
export const dissectSentenceByTargetWords = (text: string, targetWords: string[]): string[] => {
  if (!text || targetWords.length === 0) {
    return [text]
  }

  const textLowerCase = text.toLowerCase()
  const targetWordsPositions: { start: number; end: number }[] = []

  // Find all occurrences of target words and store their positions
  for (const tw of targetWords) {
    const twStartPos = textLowerCase.indexOf(tw.toLowerCase())

    if (twStartPos !== -1) {
      // Only add if the word is found
      targetWordsPositions.push({ start: twStartPos, end: twStartPos + tw.length })
    }
  }

  // If no target words were found, return the original text
  if (targetWordsPositions.length === 0) {
    return [text]
  }

  // Sort target word positions by their starting index
  targetWordsPositions.sort((a, b) => a.start - b.start)

  const dissectedSentence: string[] = []
  let lastPos = 0

  for (const twp of targetWordsPositions) {
    // Extract the text before the target word (if any)
    if (twp.start > lastPos) {
      dissectedSentence.push(text.substring(lastPos, twp.start)) // Use substring for clarity and efficiency
    }

    // Extract the target word itself
    dissectedSentence.push(text.substring(twp.start, twp.end))

    lastPos = twp.end
  }

  // Extract any remaining text after the last target word
  if (lastPos < text.length) {
    dissectedSentence.push(text.substring(lastPos))
  }

  return dissectedSentence
}
