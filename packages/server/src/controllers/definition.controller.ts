import { Response } from 'express'
import {
  GetDefinitionsByWordRequest,
  GetDefinitionsForCardRequest,
  DeleteUserDefinitionRequest,
} from '../types'
import { getErrorObject, handleError } from '../utils'
import {
  getCardById,
  getDeckPlainById,
  getDefinitionsByWord,
  getDefinitionsForCard,
  getDefinitionById,
  unlinkDefinitionFromCard,
} from '../services'
import { getRequestUserId } from './utils'

export const getDefinitionsByWordController = async (
  req: GetDefinitionsByWordRequest,
  res: Response
) => {
  try {
    const { word } = req.params

    const definitions = await getDefinitionsByWord(word)
    return res.status(200).json(definitions)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get definitions')
  }
}

export const getDefinitionsForCardController = async (
  req: GetDefinitionsForCardRequest,
  res: Response
) => {
  try {
    const { offset, limit } = req.query
    const { cardId } = req.params

    // security checks
    const card = await getCardById(cardId, ['id', 'deckId'])
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }
    const deck = await getDeckPlainById(card.deckId, ['id', 'isPublic'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (!deck.isPublic) {
      return res.status(403).json(getErrorObject('Deck is not public'))
    }

    const definitions = await getDefinitionsForCard(cardId, 'safe', offset, limit)
    return res.status(200).json(definitions)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get definitions')
  }
}

export const deleteUserDefinitionController = async (
  req: DeleteUserDefinitionRequest,
  res: Response
) => {
  try {
    const { defId } = req.params
    const userId = getRequestUserId(req)

    const def = await getDefinitionById(defId, ['id', 'source', 'createdByUserId'])
    if (!def) {
      return res.status(404).json(getErrorObject('Definition not found'))
    }
    if (def.source !== 'user' || def.createdByUserId !== userId) {
      return res.status(403).json(getErrorObject('You can only delete definitions created by you'))
    }
    await unlinkDefinitionFromCard(defId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete definition')
  }
}
