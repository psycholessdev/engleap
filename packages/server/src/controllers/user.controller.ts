import { Request, Response } from 'express'
import { handleError } from '../utils'
import { getUserById } from '../services'
import { getRequestUserId } from './utils'

export const getUserController = async (req: Request, res: Response) => {
  try {
    const userId = getRequestUserId(req)

    const user = await getUserById(userId, ['id', 'username', 'email', 'proficiencyLevel'])
    if (!user) {
      throw new Error('User does not exist even though user is authenticated')
    }

    return res.status(200).json(user)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get User')
  }
}
