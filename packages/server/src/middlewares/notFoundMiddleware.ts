import { Request, Response } from 'express'
import { getErrorObject } from '../utils'

export const notFoundMiddleware = (_: Request, res: Response) => {
  res.status(404).json(getErrorObject('Route not found or method is not allowed'))
}
