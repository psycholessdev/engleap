import { Response } from 'express'
import {
  CreateDeckRequest,
  DeleteDeckRequest,
  GetAllDecksRequest,
  GetDeckRequest,
  EditDeckRequest,
} from '../types'
import {
  createDeck,
  deleteDeck,
  getDeckById,
  getDecksByUserId,
  getDeckStats,
  updateDeck,
} from '../services'
import { getErrorObject, handleError } from '../utils'
import { getRequestUserId } from './utils'

export const getDeckController = async (req: GetDeckRequest, res: Response) => {
  try {
    const { deckId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId, ['id', 'title', 'description', 'creatorId', 'isPublic'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId && !deck.isPublic) {
      return res.status(403).json(getErrorObject('You do not have the right to see this deck'))
    }
    const stats = await getDeckStats(deckId, userId)

    return res.status(200).json({ deck, ...stats })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the deck')
  }
}

export const getAllDecksController = async (req: GetAllDecksRequest, res: Response) => {
  try {
    const { offset, limit } = req.query
    const userId = getRequestUserId(req)

    const decks = await getDecksByUserId(userId, offset, limit)
    return res.status(200).json(decks)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get decks')
  }
}

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

export const editDeckController = async (req: EditDeckRequest, res: Response) => {
  try {
    const { deckId } = req.params
    const { title, description, isPublic } = req.body
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId, ['id', 'creatorId'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to delete this deck'))
    }

    const updatedDeck = await updateDeck(deckId, title, description, isPublic)
    return res.status(200).json(updatedDeck)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the deck')
  }
}

export const deleteDeckController = async (req: DeleteDeckRequest, res: Response) => {
  try {
    const { deckId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId, ['id', 'creatorId'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to delete this deck'))
    }

    await deleteDeck(deckId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the deck')
  }
}
