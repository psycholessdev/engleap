// most basic words the learner is supposed to be familiar with
const nonTargetWords = new Set([
  'a',
  'an',
  'the',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  "i'm",
  "i've",
  "you've",
  "you'd",
  "he's",
  "he'd",
  "they're",
  "they've",
  "it's",
  'me',
  'him',
  'her',
  'hers',
  'us',
  'them',
  'my',
  'your',
  'his',
  'its',
  'our',
  'their',
  'is',
  'am',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  "isn't",
  "ain't",
  'aren\nt',
  "wasn't",
  "weren't",
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
  'will',
  'would',
  "would've",
  'can',
  'could',
  "could've",
  'shall',
  'should',
  "should've",
  'may',
  'might',
  'must',
  'this',
  'that',
  'these',
  'those',
  'here',
  "that's",
  "there's",
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'as',
  'about',
  'into',
  'over',
  'under',
  'after',
  'before',
  'between',
  'during',
  'without',
  'through',
  'around',
  'against',
  'and',
  'or',
  'but',
  'so',
  'because',
  'if',
  'when',
  'while',
  'although',
  'though',
  'until',
  'not',
  'no',
  'yes',
  'too',
  'very',
  'just',
  'only',
  'even',
  'also',
  'really',
  'well',
])

export const generateTargetWords = (rawSentence: string): string[] => {
  const cleaned = rawSentence
    .toLowerCase()
    .replace(/<\/?[^>]+>/g, '') // remove html tags
    .replace(/[^\w\s'-]/g, '') // remove punctuation except hyphen and apostrophe
    .split(/\s+/)

  const seen = new Set<string>()
  const results: string[] = []

  for (const word of cleaned) {
    if (
      word &&
      !nonTargetWords.has(word) &&
      /^[a-zA-Z'-]+$/.test(word) && // exclude numbers, symbols
      !seen.has(word)
    ) {
      seen.add(word)
      results.push(word)
    }
  }

  return results
}
