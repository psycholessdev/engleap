import { hyphenate } from 'hyphen/en-us'

export async function syllabify(word: string): Promise<string> {
  const hyphenated = await hyphenate(word)
  // Replace soft hyphens with asterisks
  return hyphenated.replace(/\u00AD/g, '*')
}
