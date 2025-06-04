import { $axios } from '@/api/baseApi'

type UserSignResponse = { userId: string }

export interface UserSignInData {
  email: string
  password: string
}

export const userSignIn = async (data: UserSignInData): Promise<UserSignResponse> => {
  const res = await $axios.post('/auth/signin', data)
  return res.data
}

export interface UserSignUpData {
  username: string
  email: string
  password: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export const userSignUp = async (data: UserSignUpData): Promise<UserSignResponse> => {
  const res = await $axios.post('/auth/signup', data)
  return res.data
}

export const userLogOut = async () => {
  await $axios.post('/auth/logout')
}
