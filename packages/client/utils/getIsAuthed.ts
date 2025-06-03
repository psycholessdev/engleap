import { cookies } from 'next/headers'
import { getBackendUrl } from '@/utils/getBackendUrl'

const backendUrl = getBackendUrl()

export const getIsAuthed = async () => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('authHash')

  if (!authCookie) {
    return false
  }
  try {
    const res = await fetch(`${backendUrl}/user`, {
      cache: 'no-cache',
      headers: new Headers({
        Cookie: `${authCookie.name}=${authCookie.value}`,
      }),
    })
    return res.ok
  } catch (error) {
    console.error(error)
    return false
  }
}
