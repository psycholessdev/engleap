import { Response } from 'express'
import { GetWordsRequest } from '../types'
import { handleError } from '../utils'
import { getMatchedWords } from '../services'

export const getMatchedWordsController = async (req: GetWordsRequest, res: Response) => {
  try {
    const { word } = req.params

    const fetchedWord = await getMatchedWords(word)
    return res.status(200).json(fetchedWord)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get words')
  }
}
