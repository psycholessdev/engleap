export interface UserSignInData {
  email: string
  password: string
}

export interface UserSignUpData {
  username: string
  email: string
  password: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export type UserSignResponse = { userId: string }

export interface GetUserResponse {
  id: string
  username: string
  email: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}
