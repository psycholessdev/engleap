import { Response } from 'express'

export const setAuthCookie = (res: Response, userId: string, hashedPassword: string) => {
  const threeMonthsMs = 1000 * 60 * 60 * 24 * 90
  res.cookie(
    'authHash',
    `${userId}_${hashedPassword}`,
    { secure: true, httpOnly: true, expires: new Date(Date.now() + threeMonthsMs) } // 3 months
  )
}

export const deleteAuthCookie = (res: Response) => {
  res.clearCookie('authHash')
}
