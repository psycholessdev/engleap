import { z } from 'zod'

export const createDeckFormSchema = z.object({
  title: z
    .string({ message: 'Deck title is required.' })
    .min(2, { message: 'The title must be at least 2 characters long.' })
    .max(160, { message: 'The title can be up to 160 characters.' }),

  description: z
    .string()
    .max(4000, { message: 'The description can be up to 4000 characters.' })
    .optional(),

  emoji: z
    .string()
    .emoji({
      message:
        'Internal error: we could not recognize this as an icon. This will not be fixed automatically. Please choose different icon.',
    })
    .default('📗'),

  isPublic: z.boolean().default(true),
})

export const editDeckSchema = createDeckFormSchema.partial()
