import { $axios } from '@/api/baseApi'

interface GetUserResponse {
  id: string
  username: string
  email: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export const getUser = async (): Promise<GetUserResponse> => {
  const res = await $axios.get('/user')
  return res.data
}
