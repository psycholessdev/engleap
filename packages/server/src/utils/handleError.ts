import { NOT_FOUND_MESSAGES } from '../constants'
import type { Response } from 'express'
import { getErrorObject } from './getErrorObject'
import { UniqueConstraintError } from 'sequelize'

export function handleError(
  error: unknown,
  res: Response,
  message = 'An unexpected error occurred'
) {
  if (error instanceof Error) {
    if (error.name == 'SequelizeUniqueConstraintError' && error instanceof UniqueConstraintError) {
      // when trying to insert a unique value into db that already exists
      return res.status(409).json({ message: error.errors[0].message })
    }

    const errorMessage = NOT_FOUND_MESSAGES[error.message as keyof typeof NOT_FOUND_MESSAGES]
    if (errorMessage) {
      return res.status(404).json(getErrorObject(errorMessage))
    }
  }

  // in case of custom error (message prop) or if nothing matches the error
  return res.status(500).json(getErrorObject(message))
}
