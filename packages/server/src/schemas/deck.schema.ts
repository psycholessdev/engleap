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

export const getAllCardsByDeckIdSchema = z.strictObject({
  offset: z.coerce.number({ message: 'offset should be a number' }).min(0).default(0),

  limit: z.coerce
    .number({ message: 'limit should be a number' })
    .min(0, { message: 'limit should be greater than 0' })
    .max(100, { message: 'limit should be at much 100 characters' })
    .default(10),
})

// :deckId param check
export const deckIdParamUtilizedSchema = z.strictObject({
  deckId: z
    .string({ message: 'deckId should be a valid uuid' })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
      message: 'deckId should be a valid uuid',
    }),
})
