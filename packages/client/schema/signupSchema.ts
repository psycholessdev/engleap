import { z } from 'zod'

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(18, { message: 'Username can be up to 18 characters.' }),
  email: z.string({ message: 'Email is required.' }).email({ message: 'Email is invalid' }),
  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters long.' }),
  proficiencyLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], {
    message: 'Proficiency level is required.',
  }),
})
