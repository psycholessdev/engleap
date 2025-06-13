import type { ZodSchema } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { getErrorObject } from '../utils'

type Source = 'body' | 'query' | 'params'

export const validateRequestData = <T extends ZodSchema>(schema: T, source: Source = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source]
    const result = await schema.safeParseAsync(dataToValidate)

    if (!result.success) {
      const errorMessage = result?.error?.errors?.[0]?.message || 'Validation failed'

      return res.status(400).json(getErrorObject(errorMessage))
    }

    Object.assign(req[source], result.data)
    return next()
  }
}
