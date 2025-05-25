import { Request, Response, NextFunction } from 'express'
import { getUserByAuth } from '../services'
import { User } from '../models'
import { getErrorObject, handleError } from '../utils'
declare module 'express' {
  interface Request {
    authedUser?: User
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // authHash cookie => ${user_id}_${passwordHash}
    const authHash = (req.cookies?.authHash ?? '').toString().trim()
    const parsedCookie = authHash.split('_')
    if (authHash && parsedCookie.length == 2) {
      try {
        const user = await getUserByAuth(parsedCookie[0], parsedCookie[1])
        if (user) {
          req.authedUser = user
        }
      } catch (error) {
        console.error(error)
        return res.status(500).json(getErrorObject('Error while fetching the user'))
      }
    }

    if (req.path.startsWith('/auth') || req.authedUser) {
      return next()
    } else {
      return res.status(403).json(getErrorObject('Unauthorized'))
    }
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to check auth token')
  }
}
