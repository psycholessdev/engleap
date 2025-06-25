import { z } from 'zod'

export const getSrsCardsParamSchema = z.strictObject({
  deckId: z.string().uuid().optional(),
})

export const updateSrsCardSchema = z.strictObject({
  grade: z
    .number({ message: 'You must specify a grade. It should be number in the range from 0 to 5.' })
    .min(0, { message: 'Grade should be in the range from 0 to 5' })
    .max(5, { message: 'Grade should be in the range from 0 to 5' }),
})
