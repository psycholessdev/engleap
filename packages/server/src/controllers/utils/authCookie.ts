import { Response } from 'express'
import { signJwt } from '../../utils'

export const setAuthCookie = (res: Response, userId: string) => {
  const threeMonthsMs = 1000 * 60 * 60 * 24 * 90
  res.cookie(
    'authJwt',
    signJwt(userId),
    { secure: true, httpOnly: true, expires: new Date(Date.now() + threeMonthsMs) } // 3 months
  )
}

export const deleteAuthCookie = (res: Response) => {
  res.clearCookie('authJwt')
}
