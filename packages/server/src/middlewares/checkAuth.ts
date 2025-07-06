import { Request, Response, NextFunction } from 'express'
import { User } from '../models'
import { getErrorObject, handleError, verifyJwt } from '../utils'
declare module 'express' {
  interface Request {
    authedUser?: User
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authJwt = (req.cookies?.authJwt ?? '').toString()
    if (authJwt) {
      req.authedUser = await verifyJwt(authJwt)
    }

    if (req.path.startsWith('/api/auth') || req.authedUser) {
      return next()
    } else {
      return res.status(403).json(getErrorObject('Unauthorized'))
    }
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to check auth token')
  }
}
