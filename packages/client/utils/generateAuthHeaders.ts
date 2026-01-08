'use server'
import { cookies } from 'next/headers'

export const generateAuthHeaders = async () => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('authJwt')

  if (!authCookie) {
    return null
  }
  return new Headers({
    Cookie: `${authCookie.name}=${authCookie.value}`,
  })
}
