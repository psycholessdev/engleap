import { Response } from 'express'
import {
  GetDefinitionsByWordRequest,
  GetDefinitionsForCardRequest,
  DeleteUserDefinitionRequest,
} from '../types'
import { getErrorObject, handleError } from '../utils'
import {
  getCardById,
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
    const { cardId } = req.params

    const card = await getCardById(cardId, ['id'])
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }
    // TODO check if the Deck is public (security check)

    const definitions = await getDefinitionsForCard(cardId)
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
      return res.status(403).json(getErrorObject('You can delete only definitions created by you'))
    }
    await unlinkDefinitionFromCard(defId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete definition')
  }
}
