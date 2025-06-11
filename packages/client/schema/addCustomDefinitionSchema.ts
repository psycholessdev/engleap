import { z } from 'zod'

export const addCustomDefinitionSchema = z
  .strictObject({
    // the word this definition for, e.g., fascinating
    id: z.string().trim().toLowerCase().min(1).max(200),

    // the original word, e.g. fascinate
    word: z
      .string({ message: 'you should select a Target Word' })
      .trim()
      .toLowerCase()
      .min(1, { message: 'you should select a Target Word' })
      .max(200),

    text: z.string().trim().min(1).max(4000),

    partOfSpeech: z.string().trim().toLowerCase().min(1).max(30),

    syllabifiedWord: z.string().trim().min(1).max(200),

    offensive: z.boolean().default(false),

    stems: z.array(z.string().trim().min(1).max(30)).default([]),
  })
  .refine(
    ({ id, syllabifiedWord }) => {
      // check if syllabifiedWord matches the original
      const parsedSyllabifiedWord: string = syllabifiedWord.split('*').join('')
      return id === parsedSyllabifiedWord
    },
    { message: 'syllabifiedWord should match the original word' }
  )
