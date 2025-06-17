import { Response } from 'express'
import type {
  CreateDeckRequest,
  DeleteDeckRequest,
  GetAllDecksRequest,
  GetPublicDecksRequest,
  GetDeckRequest,
  EditDeckRequest,
  FollowDeckRequest,
  UnfollowDeckRequest,
} from '../types'
import {
  createDeck,
  deleteDeck,
  getDeckPlainById,
  getDeckWithInfo,
  getDecksWithInfoByUserId,
  getPublicDecksWithInfo,
  updateDeck,
  followDeck,
  unfollowDeck,
} from '../services'
import { getErrorObject, handleError } from '../utils'
import { getRequestUserId } from './utils'

export const getDeckController = async (req: GetDeckRequest, res: Response) => {
  try {
    const { deckId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deckWithInfo = await getDeckWithInfo(deckId, userId)
    if (!deckWithInfo) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deckWithInfo.creatorId !== userId && !deckWithInfo.isPublic) {
      return res.status(403).json(getErrorObject('You do not have the right to see this deck'))
    }

    return res.status(200).json(deckWithInfo)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the deck')
  }
}

export const getUserDecksController = async (req: GetAllDecksRequest, res: Response) => {
  try {
    const { offset, limit } = req.query
    const userId = getRequestUserId(req)

    const decks = await getDecksWithInfoByUserId(userId, offset, limit)
    return res.status(200).json(decks)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get decks')
  }
}

export const getPublicDecksController = async (req: GetPublicDecksRequest, res: Response) => {
  try {
    const { query, offset, limit } = req.query

    const decks = await getPublicDecksWithInfo(query ?? '', offset, limit)
    return res.status(200).json(decks)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get public decks')
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
    const deck = await getDeckPlainById(deckId, ['id', 'creatorId'])
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
    const deck = await getDeckPlainById(deckId, ['id', 'creatorId'])
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

export const followDeckController = async (req: FollowDeckRequest, res: Response) => {
  try {
    const { deckId } = req.body
    const userId = getRequestUserId(req)

    const deck = await getDeckPlainById(deckId, ['id'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }

    await followDeck(userId, deckId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to follow deck')
  }
}

export const unfollowDeckController = async (req: UnfollowDeckRequest, res: Response) => {
  try {
    const { deckId } = req.body
    const userId = getRequestUserId(req)
    const deck = await getDeckPlainById(deckId, ['id', 'creatorId'])

    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }

    if (userId === deck.creatorId) {
      return res.status(403).json(getErrorObject('Creators cannot unfollow their own decks'))
    }

    await unfollowDeck(userId, deckId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to follow deck')
  }
}
