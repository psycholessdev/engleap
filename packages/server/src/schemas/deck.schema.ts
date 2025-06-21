import { z } from 'zod'
import xss from 'xss'
import { paginationQueryUtilizedSchema } from './utils'

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

  emoji: z.string().emoji().default('📗'),

  isPublic: z.coerce.boolean().default(true),
})

export const editDeckSchema = createDeckSchema.partial()

export const getPublicDecksRequestQuerySchema = paginationQueryUtilizedSchema.extend({
  query: z.string().trim().max(50).optional(),
})

// :deckId param check
export const deckIdParamUtilizedSchema = z.strictObject({
  deckId: z
    .string({ message: 'you should provide a valid uuid' })
    .uuid({ message: 'deckId should be a valid uuid' }),
})
