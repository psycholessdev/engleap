import { $axios } from '@/api/baseApi'
import { UserSignInData, UserSignUpData, UserSignResponse, GetUserResponse } from '@/types'

export const userSignIn = async (data: UserSignInData): Promise<UserSignResponse> => {
  const res = await $axios.post('/auth/signin', data)
  return res.data
}

export const userSignUp = async (data: UserSignUpData): Promise<UserSignResponse> => {
  const res = await $axios.post('/auth/signup', data)
  return res.data
}

export const userLogOut = async () => {
  await $axios.post('/auth/logout')
}

export const getUser = async (): Promise<GetUserResponse> => {
  const res = await $axios.get('/user')
  return res.data
}
