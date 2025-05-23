import { Request, Response, NextFunction } from 'express'
import { User } from '../models'
import getErrorObject from '../utils/getErrorObject'
declare module 'express' {
  interface Request {
    authenticated?: boolean
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHash = (req.cookies.authHash ?? '').toString().trim()
  if (!authHash) {
    res.status(403).json(getErrorObject('Unauthorized'))
  }

  const user = await User.findOne({ where: { id: authHash } })
  if (!user) {
    res.status(403).json(getErrorObject('Unauthorized'))
  }
  req.authenticated = true

  next()
}
