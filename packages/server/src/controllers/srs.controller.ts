import { Response } from 'express'
import { UpdateSrsCardRequest, GetSrsCardsRequest } from '../types'
import { handleError, getErrorObject } from '../utils'
import { getRequestUserId } from './utils'
import {
  updateSrsProgress,
  getSrsWithCards,
  countSrsDueCards,
  getCardById,
  getDeckById,
  getIsFollowingDeck,
} from '../services'

export const updateSrsCardProgressController = async (req: UpdateSrsCardRequest, res: Response) => {
  try {
    const { cardId } = req.params
    const { grade } = req.body
    const userId = getRequestUserId(req)

    const card = await getCardById(cardId, ['deckId'])
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }

    const isFollowing = await getIsFollowingDeck(userId, card.deckId)
    if (!isFollowing) {
      return res.status(403).json(getErrorObject('You are not following the deck'))
    }

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

    if (deckId) {
      const deck = await getDeckById(deckId)
      if (!deck) {
        return res.status(404).json(getErrorObject('Deck not found'))
      }
    }

    const srsWithCards = await getSrsWithCards(userId, deckId)
    return res.status(200).json(srsWithCards)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get SRS cards')
  }
}

export const getSrsCardsStatsController = async (req: GetSrsCardsRequest, res: Response) => {
  try {
    const { deckId } = req.query
    const userId = getRequestUserId(req)

    if (deckId) {
      const deck = await getDeckById(deckId)
      if (!deck) {
        return res.status(404).json(getErrorObject('Deck not found'))
      }
    }

    const srsDue = await countSrsDueCards(userId, deckId)
    return res.status(200).json({ count: srsDue, deckId })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to count SRS cards')
  }
}
