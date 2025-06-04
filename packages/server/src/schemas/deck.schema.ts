import { z } from 'zod'
import xss from 'xss'

export const createDeckSchema = z.strictObject({
  title: z
    .string({ message: 'title is required' })
    .trim()
    .min(2, { message: 'title should be at least 2 characters' })
    .max(160, { message: 'title should be at much 160 characters' })
    .transform(val => xss(val)),

  description: z.coerce
    .string()
    .trim()
    .max(4000, { message: 'description should be at much 4000 characters' })
    .default('')
    .transform(val => xss(val)),

  isPublic: z.coerce.boolean().default(true),
})

// :deckId param check
export const deckIdParamUtilizedSchema = z.strictObject({
  deckId: z
    .string({ message: 'you should provide a valid uuid' })
    .uuid({ message: 'deckId should be a valid uuid' }),
})
