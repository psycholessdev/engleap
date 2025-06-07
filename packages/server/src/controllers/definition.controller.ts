import { Response } from 'express'
import { GetDefinitionsByWordRequest, GetDefinitionsForCardRequest } from '../types'
import { getErrorObject, handleError } from '../utils'
import { getCardById, getDefinitionsByWord, getDefinitionsForCard } from '../services'

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
