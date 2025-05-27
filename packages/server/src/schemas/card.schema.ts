import { z } from 'zod'
import xss from 'xss'
import { deckIdParamUtilizedSchema } from './deck.schema'

export const addCardToDeckSchema = z
  .strictObject({
    sentence: z
      .string({ message: 'sentence is required' })
      .trim()
      .min(3, { message: 'sentence should be at least 3 characters' })
      .max(4000, { message: 'sentence should be at much 4000 characters' })
      .transform(val => xss(val)),

    targetWords: z
      .array(
        z
          .string({ message: 'check targetWords array: target word can not be empty' })
          .trim()
          .toLowerCase()
          .min(1, {
            message: 'check targetWords array: target word should be at least 1 character',
          })
          .transform(val => xss(val))
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
        { message: 'all items in targetWords array should be unique' }
      ),
  })
  .refine(
    ({ sentence, targetWords }) => {
      // checks if all targetWords are included in the sentence
      const lowercaseSentence = sentence.toLowerCase()
      for (const word of targetWords) {
        if (!lowercaseSentence.includes(word)) {
          return false
        }
      }

      return true
    },
    { message: 'not all targetWords are included in the sentence. Make sure they match exactly.' }
  )

// :cardId param check
export const cardIdParamUtilizedSchema = z.strictObject({
  cardId: z
    .string({ message: 'cardId should be a valid uuid' })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
      message: 'deckId should be a valid uuid',
    }),
})

export const cardIdDeckIdScheme = cardIdParamUtilizedSchema.merge(deckIdParamUtilizedSchema)
