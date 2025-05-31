import { z } from 'zod'
import xss from 'xss'
import { uuidUtilizedSchema } from './utils'

export const extractedDefinitionSchema = z.strictObject({
  id: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(200)
    .transform(val => xss(val)),

  word: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(200)
    .transform(val => xss(val)),

  text: z
    .string()
    .trim()
    .min(1)
    .max(4000)
    .transform(val => xss(val)),

  partOfSpeech: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(30)
    .transform(val => xss(val)),

  syllabifiedWord: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .transform(val => xss(val)),

  pronunciationAudioUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .transform(val => xss(val))
    .optional(),

  offensive: z.boolean().default(false),

  labels: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .min(1)
        .max(30)
        .transform(val => xss(val))
    )
    .default([]),

  stems: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(30)
        .transform(val => xss(val))
    )
    .default([]),
})

const userProvidedDefinitions = z
  .array(z.array(extractedDefinitionSchema).min(1).max(10))
  .min(1)
  .max(15)

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

    definitions: userProvidedDefinitions.optional(),
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

    definitions: userProvidedDefinitions.optional(),
  })
  .refine(
    ({ sentence, targetWords, definitions }) => {
      if (!!sentence !== !!targetWords) {
        // ether both sentence and targetWords should be provided
        // or none of them at all
        return false
      }
      if (!sentence || !targetWords) {
        // makes typescript happy
        return false
      }

      // checks if all targetWords are included in the sentence
      const lowercaseSentence = sentence.toLowerCase()
      for (const word of targetWords) {
        if (!lowercaseSentence.includes(word)) {
          return false
        }
      }

      if (definitions) {
        // checks regarding definitions
        if (!targetWords) {
          // targetWords should be provided
          return false
        }
        const wordsLowercase = definitions.map(def => def[0].word.toLowerCase())
        for (const word of wordsLowercase) {
          if (!targetWords.includes(word)) {
            // unrecognized definition
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
  cardId: uuidUtilizedSchema,
})
