import { z } from 'zod'
import xss from 'xss'

export const credentialsAuthSchema = z.strictObject({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'You should provide a valid email address' }),

  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
})

export const createAccountSchema = z.strictObject({
  username: z
    .string({ message: 'username is required' })
    .trim()
    .min(3, { message: 'username should be at least 3 characters' })
    .max(18, { message: 'username should be at much 18 characters' })
    .transform(val => xss(val)),

  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'You should provide a valid email address' }),

  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),

  proficiencyLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
})
