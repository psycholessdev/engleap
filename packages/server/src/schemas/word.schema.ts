import { z } from 'zod'

// :word param check
export const wordParamSchema = z.strictObject({
  word: z.string().trim().min(2).max(200),
})
