import { z } from 'zod'
import xss from 'xss'

export const addCardToDeckSchema = z
  .strictObject({
    sentence: z
      .string({ message: 'sentence is required' })
      .trim()
      .min(3, { message: 'sentence should be at least 3 characters' })
      .max(4000, { message: 'sentence should be at much 4000 characters' })
      .transform(val => xss(val)),

    targetWords: z.array(
      z
        .string({ message: 'check targetWords array: target word can not be empty' })
        .trim()
        .min(1, { message: 'check targetWords array: target word should be at least 1 character' })
        .transform(val => xss(val))
    ),
  })
  .refine(
    ({ sentence, targetWords }) => {
      // checks if all targetWords are included in the sentence
      for (const word of targetWords) {
        if (!sentence.includes(word)) {
          return false
        }
      }

      return true
    },
    { message: 'not all targetWords are included in the sentence. Make sure they match exactly.' }
  )
