import { getAllCardsByDeckIdRequest, addCardToDeckRequest, getCardByIdRequest } from '../types'
import { Response } from 'express'
import { getErrorObject, handleError } from '../utils'
import { addCard, getCardsByDeckId, getDeckById, getCardById } from '../services'

export const getAllCardsByDeckIdController = async (
  req: getAllCardsByDeckIdRequest,
  res: Response
) => {
  try {
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
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to get cards')
  }
}

export const getCardByIdController = async (req: getCardByIdRequest, res: Response) => {
  const { deckId, cardId } = req.params
  const userId = req.authedUser?.id

  if (!userId) {
    return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
  }

  const card = await getCardById(cardId)
  if (!card || card.deck?.id != deckId) {
    return res.status(404).json(getErrorObject('Card not found'))
  }
  if (card.deck.creatorId !== userId && !card.deck.isPublic) {
    return res.status(403).json(getErrorObject('You do not have the right to see this card'))
  }
  return res.status(200).json(card)
}

export const addCardToDeckController = async (req: addCardToDeckRequest, res: Response) => {
  try {
    const { sentence, targetWords } = req.body
    const { deckId } = req.params
    const userId = req.authedUser?.id

    if (!userId) {
      return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
    }

    // check the right to do the action
    const deck = await getDeckById(deckId, ['creatorId'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this deck'))
    }

    // creates a cards and related words, fetches and creates definitions and connections between them
    const createdCard = await addCard(deckId, sentence, userId, targetWords)

    return res.status(201).json(createdCard)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to add card')
  }
}
