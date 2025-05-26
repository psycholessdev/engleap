import { Response } from 'express'
import { createDeckRequest } from '../types'
import { createDeck } from '../services'
import { getErrorObject, handleError } from '../utils'

export const createDeckController = async (req: createDeckRequest, res: Response) => {
  try {
    const { title, description, isPublic } = req.body
    const userId = req.authedUser?.id

    if (!userId) {
      return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
    }

    const createdDeck = await createDeck(title, description, userId, isPublic)
    return res.status(201).json(createdDeck)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to create deck')
  }
}
