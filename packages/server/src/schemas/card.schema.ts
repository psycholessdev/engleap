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

export const editCardToDeckSchema = z
  .strictObject({
    sentence: z
      .string({ message: 'sentence is required' })
      .trim()
      .min(3, { message: 'sentence should be at least 3 characters' })
      .max(4000, { message: 'sentence should be at much 4000 characters' })
      .transform(val => xss(val))
      .optional(),

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
      )
      .optional(),

    definitions: z
      .array(
        z
          .record(
            z
              .string()
              .trim()
              .min(2)
              .max(200)
              .transform(val => xss(val)),
            z
              .string()
              .trim()
              .min(2)
              .max(4000)
              .transform(val => xss(val))
          )
          .refine(record => Object.keys(record).length === 1, {
            message:
              'you should provide a valid definition: object with key (target word) and value (definition). Other fields should not be present',
          })
      )
      .optional(),
  })
  .refine(
    ({ sentence, targetWords, definitions }) => {
      if ((!sentence && targetWords) || (sentence && !targetWords)) {
        // ether both sentence and targetWords should be provided
        // or none of them at all
        return false
      }
      if (!sentence || !targetWords) {
        // making typescript happy
        return false
      }

      // check if all targetWords are included in the sentence
      const lowercaseSentence = sentence.toLowerCase()
      for (const word of targetWords) {
        if (!lowercaseSentence.includes(word)) {
          return false
        }
      }

      if (definitions) {
        // checks regarding definitions
        const wordsLowercase = definitions.map(
          word => Object.keys(word)?.[0]?.toLowerCase() || null
        )
        for (const word of wordsLowercase) {
          if (!word || !targetWords.includes(word)) {
            // empty or unrecognized definitions not listed in targetWords array
            return false
          }
        }
      }

      return true
    },
    {
      message:
        'check the data you provided: ether both sentence and targetWords should be provided or none of them at all. If they are provided, all targetWords should be included in the sentence. Also, if you provided custom definitions, make sure they listed in targetWords array.',
    }
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
