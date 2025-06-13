import { Response } from 'express'
import { UpdateSrsCardRequest, GetSrsCardsRequest } from '../types'
import { handleError } from '../utils'
import { getRequestUserId } from './utils'
import { updateSrsProgress, getSrsWithCards } from '../services'

export const updateSrsCardProgressController = async (req: UpdateSrsCardRequest, res: Response) => {
  try {
    const { cardId } = req.params
    const { grade } = req.body
    const userId = getRequestUserId(req)

    const progress = await updateSrsProgress(userId, cardId, grade)
    return res.status(200).json(progress)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to update SRS progress')
  }
}

export const getSrsCardsController = async (req: GetSrsCardsRequest, res: Response) => {
  try {
    const { deckId } = req.query
    const userId = getRequestUserId(req)

    const srsWithCards = await getSrsWithCards(userId, deckId)
    return res.status(200).json(srsWithCards)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get SRS cards')
  }
}
