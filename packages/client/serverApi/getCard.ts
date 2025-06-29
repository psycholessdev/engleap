import { getBackendUrl, generateAuthHeaders } from '@/utils'

const backendUrl = getBackendUrl()

export const getCard = async (cardId: string) => {
  const headers = await generateAuthHeaders()

  if (!headers) return null
  try {
    const res = await fetch(`${backendUrl}/cards/${cardId}`, {
      headers,
    })
    const data = await res.json()
    if (res.ok) {
      return data
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}
