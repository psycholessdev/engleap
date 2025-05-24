import { z } from 'zod'

export const credentialsAuthSchema = z.strictObject({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'You should provide a valid email address' }),

  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
})
