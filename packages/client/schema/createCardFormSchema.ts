import { z } from 'zod'

export const createCardFormSchema = z
  .object({
    sentence: z
      .string({ message: 'Specify a sentence with the target word(s)' })
      .trim()
      .min(3, { message: 'Sentence should be at least 3 characters' })
      .max(4000, {
        message:
          'Sentence should be at much 4000 characters. If you think you need more please contact me.',
      }),
    targetWords: z
      .array(
        z.string({ message: 'Specify Target Word(s)' }).trim().toLowerCase().min(1, {
          message: 'Check targetWords array: each target word should be at least 1 character',
        })
      )
      .refine(
        array => {
          // searches for duplicates in targetWords array
          const foundWords: string[] = []

          for (const word of array) {
            if (foundWords.includes(word)) {
              return false
            }
            foundWords.push(word)
          }
          return true
        },
        { message: 'All items in targetWords array should be unique' }
      ),
    userSpecifiedTargetWords: z
      .string({ message: 'Specify Target Word(s)' })
      .trim()
      .toLowerCase()
      .transform(str =>
        str
          .split(',')
          .map(w => w.trim())
          .join(',')
      )
      .refine(
        str => {
          // searches for duplicates in targetWords array
          const foundWords: string[] = []

          for (const word of str.split(',')) {
            if (foundWords.includes(word)) {
              return false
            }
            foundWords.push(word)
          }
          return true
        },
        { message: 'All items in targetWords array should be unique. Do not repeat them.' }
      )
      .optional(),
  })
  .refine(
    ({ targetWords, userSpecifiedTargetWords }) => {
      const tw = new Set<string>(targetWords)
      const ustw = new Set<string>(userSpecifiedTargetWords.split(','))

      return tw.keys.length === ustw.keys.length
    },
    { message: 'all items in targetWords array should be unique' }
  )
