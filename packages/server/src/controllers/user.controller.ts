import { Request, Response } from 'express'
import { FollowDeckRequest, UnfollowDeckRequest } from '../types'
import { handleError } from '../utils'
import { followDeck, getUserById, unfollowDeck } from '../services'
import { getRequestUserId } from './utils'

export const getUserController = async (req: Request, res: Response) => {
  try {
    const userId = getRequestUserId(req)

    const user = await getUserById(userId, ['id', 'username', 'email', 'proficiencyLevel'])
    if (!user) {
      throw new Error('User does not exist even though user is authenticated')
    }

    return res.status(200).json(user)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get User')
  }
}

export const followDeckController = async (req: FollowDeckRequest, res: Response) => {
  try {
    const { deckId } = req.body
    const userId = getRequestUserId(req)

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

    await unfollowDeck(userId, deckId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to follow deck')
  }
}
