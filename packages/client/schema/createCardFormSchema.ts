import { z } from 'zod'

export const createCardFormSchema = z
  .object({
    sentence: z
      .string({ message: 'Please enter a sentence that includes the target word(s).' })
      .trim()
      .min(3, { message: 'The sentence must be at least 3 characters long.' })
      .max(4000, {
        message:
          'The sentence can be up to 4000 characters. If you need more space, feel free to contact us.',
      }),
    targetWords: z
      .array(
        z
          .string({ message: 'Please specify at least one target word.' })
          .trim()
          .toLowerCase()
          .min(1, {
            message: 'Each target word must be at least 1 character long.',
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
        { message: 'Target words must be unique. Please remove any duplicates.' }
      ),
    userSpecifiedTargetWords: z
      .string({ message: 'Please specify at least one target word.' })
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
        { message: 'Target words must be unique. Please remove any duplicates.' }
      )
      .optional(),
  })
  .refine(
    ({ targetWords, userSpecifiedTargetWords }) => {
      const tw = new Set<string>(targetWords)
      const ustw = new Set<string>(userSpecifiedTargetWords.split(','))

      return tw.keys.length === ustw.keys.length
    },
    { message: 'Target words must be unique. Please remove any duplicates.' }
  )
