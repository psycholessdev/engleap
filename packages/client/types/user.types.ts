import { userSignInFormSchema, userSignupFormSchema } from '@/schema'
import { z } from 'zod'

export type UserSignInFormData = z.infer<typeof userSignInFormSchema>

export type UserSignUpFormData = z.infer<typeof userSignupFormSchema>

export type UserSignResponse = { userId: string }

export interface GetUserResponse {
  id: string
  username: string
  email: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}
