import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is invalid' }),
  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
})
