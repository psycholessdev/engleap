import { Response } from 'express'
import { getUserByCredentials } from '../services'
import { credentialsAuthRequest } from '../types'
import md5 from 'md5'
import getErrorObject from '../utils/getErrorObject'

export const credentialsAuthController = async (req: credentialsAuthRequest, res: Response) => {
  try {
    if (req.authedUser) {
      return res
        .status(409)
        .json(getErrorObject('You already authenticated, please log out first.'))
    }

    const { email, password } = req.body
    const hashedPassword = md5(password)
    const user = await getUserByCredentials(email, hashedPassword)

    if (!user) {
      return res
        .status(403)
        .json(getErrorObject('Authentication failed: The credentials are wrong'))
    }
    res.cookie(
      'authHash',
      `${user.id}_${hashedPassword}`,
      { secure: true, httpOnly: true, expires: new Date(Date.now() + 86400 * 30 * 3) } // 3 months
    )
    return res.status(200).json({ authenticated: true, userId: user.id })
  } catch (error) {
    console.error(error)
    return res.status(403).json(getErrorObject('Unauthorized'))
  }
}
