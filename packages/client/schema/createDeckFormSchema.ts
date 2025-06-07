import { z } from 'zod'

export const createDeckFormSchema = z.object({
  title: z
    .string({ message: 'title is required' })
    .min(2, { message: 'title should be at least 2 characters' })
    .max(160, { message: 'title should be at much 160 characters' }),

  description: z
    .string()
    .max(4000, { message: 'description should be at much 4000 characters' })
    .optional(),

  isPublic: z.boolean().default(true),
})

export const editDeckSchema = createDeckFormSchema.partial()
