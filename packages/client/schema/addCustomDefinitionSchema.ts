import { z } from 'zod'
import { partOfSpeechDefs } from '@/consts'

const partOfSpeechList = Object.keys(partOfSpeechDefs)

export const addCustomDefinitionSchema = z
  .strictObject({
    // the word this definition for, e.g., fascinating
    sourceEntryId: z.string().trim().toLowerCase().min(1).max(200),

    // the original word, e.g. fascinate
    word: z
      .string({ message: 'You must select a target word.' })
      .trim()
      .toLowerCase()
      .min(1, { message: 'You must select a target word.' })
      .max(200),

    text: z.string().trim().min(1).max(4000),

    partOfSpeech: z.enum(partOfSpeechList, {
      message: 'Select Part of Speech',
    }),

    syllabifiedWord: z.string().trim().min(1).max(200),

    offensive: z.boolean().default(false),

    stems: z.array(z.string().trim().min(1).max(30)).default([]),
  })
  .refine(
    ({ sourceEntryId, syllabifiedWord }) => {
      // check if syllabifiedWord matches the original
      const parsedSyllabifiedWord: string = syllabifiedWord.split('*').join('')
      return sourceEntryId === parsedSyllabifiedWord
    },
    { message: 'The syllabified word must match the original word.' }
  )
