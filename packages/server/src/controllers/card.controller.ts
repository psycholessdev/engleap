import { getAllCardsByDeckIdRequest } from '../types/deck.types'
import { Response } from 'express'
import { getErrorObject } from '../utils'
import { getCardsByDeckId, getDeckById } from '../services'

export const getAllCardsByDeckIdController = async (
  req: getAllCardsByDeckIdRequest,
  res: Response
) => {
  const { offset, limit } = req.query
  const { deckId } = req.params
  const userId = req.authedUser?.id

  if (!userId) {
    return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
  }

  const deck = await getDeckById(deckId, ['id', 'creatorId', 'isPublic'])
  if (!deck) {
    return res.status(404).json(getErrorObject('Deck not found'))
  }

  if (deck.isPublic || deck.creatorId === userId) {
    const cards = await getCardsByDeckId(deckId, offset, limit)
    return res.status(200).json(cards)
  } else {
    return res.status(403).json(getErrorObject('You do not have the right to access this deck'))
  }
}
