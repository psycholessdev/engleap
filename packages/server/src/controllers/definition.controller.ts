import { Response } from 'express'
import { GetDefinitionsByWordRequest } from '../types'
import { handleError } from '../utils'
import { getDefinitionsByWord } from '../services'

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
