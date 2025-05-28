import {
  GetAllCardsByDeckIdRequest,
  AddCardToDeckRequest,
  GetCardByIdRequest,
  EditCardToDeckRequest,
} from '../types'
import { Response } from 'express'
import { getErrorObject, handleError } from '../utils'
import {
  addCard,
  getCardsByDeckId,
  getDeckById,
  getCardByIdWithDeckAndDefinitions,
  getCardById,
  editCard,
} from '../services'

export const getAllCardsByDeckIdController = async (
  req: GetAllCardsByDeckIdRequest,
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

export const getCardByIdController = async (req: GetCardByIdRequest, res: Response) => {
  const { deckId, cardId } = req.params
  const userId = req.authedUser?.id

  if (!userId) {
    return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
  }

  const card = await getCardByIdWithDeckAndDefinitions(cardId)
  if (!card || card.deck?.id != deckId) {
    return res.status(404).json(getErrorObject('Card not found'))
  }
  if (card.deck.creatorId !== userId && !card.deck.isPublic) {
    return res.status(403).json(getErrorObject('You do not have the right to see this card'))
  }
  return res.status(200).json(card)
}

export const addCardToDeckController = async (req: AddCardToDeckRequest, res: Response) => {
  try {
    const { sentence, targetWords, definitions } = req.body
    const { deckId } = req.params
    const userId = req.authedUser?.id

    if (!userId) {
      return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
    }

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId, ['creatorId'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this deck'))
    }

    // creates a cards and related words, fetches and creates definitions and connections between them
    const { createdCard, notFoundWords } = await addCard(
      deckId,
      sentence,
      userId,
      targetWords,
      definitions
    )

    return res.status(201).json({
      card: createdCard,
      notFoundWords,
    })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to add card')
  }
}

export const editCardController = async (req: EditCardToDeckRequest, res: Response) => {
  const { cardId, deckId } = req.params
  const { sentence, targetWords, definitions } = req.body
  const userId = req.authedUser?.id

  if (!userId) {
    return res.status(500).json(getErrorObject('Internal error: Failed to get userId'))
  }

  // checks if the user is allowed to do the action
  const card = await getCardById(cardId, ['createdByUserId', 'deckId'])
  if (!card || card.deckId != deckId) {
    return res.status(404).json(getErrorObject('Card not found'))
  }
  if (card.createdByUserId !== userId) {
    return res.status(403).json(getErrorObject('You do not have the right to edit this card'))
  }

  await editCard(cardId, userId, sentence, targetWords, definitions)
  const updatedCard = await getCardByIdWithDeckAndDefinitions(cardId)
  return res.status(200).json(updatedCard)
}
