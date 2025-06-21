'use server'
import { getBackendUrl, generateAuthHeaders } from '@/utils'

const backendUrl = getBackendUrl()

export const getIsAuthed = async (): Promise<null | string> => {
  const headers = await generateAuthHeaders()

  if (!headers) return null

  try {
    const res = await fetch(`${backendUrl}/user`, {
      cache: 'no-cache',
      headers,
    })
    if (res.ok) {
      const user = await res.json()
      return user.id
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}
