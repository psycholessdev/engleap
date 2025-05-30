import { Response } from 'express'
import { CreateDeckRequest, DeleteDeckRequest } from '../types'
import { createDeck, deleteDeck, getDeckById } from '../services'
import { getErrorObject, handleError } from '../utils'
import { getRequestUserId } from './utils'

export const createDeckController = async (req: CreateDeckRequest, res: Response) => {
  try {
    const { title, description, isPublic } = req.body
    const userId = getRequestUserId(req)

    const createdDeck = await createDeck(title, description, userId, isPublic)
    return res.status(201).json(createdDeck)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to create deck')
  }
}

export const deleteDeckController = async (req: DeleteDeckRequest, res: Response) => {
  try {
    const { deckId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId)
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this card'))
    }

    await deleteDeck(deckId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the deck')
  }
}
