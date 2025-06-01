import {
  GetAllCardsByDeckIdRequest,
  AddCardToDeckRequest,
  GetCardByIdRequest,
  EditCardToDeckRequest,
  DeleteCardByIdRequest,
} from '../types'
import { Response } from 'express'
import { getErrorObject, handleError } from '../utils'
import {
  addCard,
  getCardsByDeckId,
  getDeckById,
  getCardByIdWithWords,
  getCardById,
  editCard,
  deleteCardById,
} from '../services'
import { getRequestUserId } from './utils'

export const getAllCardsByDeckIdController = async (
  req: GetAllCardsByDeckIdRequest,
  res: Response
) => {
  try {
    const { offset, limit } = req.query
    const { deckId } = req.params
    const userId = getRequestUserId(req)

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
  try {
    const { cardId } = req.params
    const userId = getRequestUserId(req)

    const card = await getCardByIdWithWords(cardId)
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }
    const deck = await getDeckById(card.deckId, ['creatorId', 'isPublic'])
    if (!deck || (deck.creatorId !== userId && !deck.isPublic)) {
      return res.status(403).json(getErrorObject('You do not have the right to see this card'))
    }
    return res.status(200).json(card)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to retrieve the card')
  }
}

export const deleteCardController = async (req: DeleteCardByIdRequest, res: Response) => {
  try {
    const { cardId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const card = await getCardById(cardId, ['createdByUserId'])
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }
    if (card.createdByUserId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this card'))
    }

    await deleteCardById(cardId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to delete the card')
  }
}

export const addCardToDeckController = async (req: AddCardToDeckRequest, res: Response) => {
  try {
    const { sentence, targetWords, definitions } = req.body
    const { deckId } = req.params
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const deck = await getDeckById(deckId, ['creatorId'])
    if (!deck) {
      return res.status(404).json(getErrorObject('Deck not found'))
    }
    if (deck.creatorId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this deck'))
    }

    // creates a cards and related words, fetches and creates definitions and connections between them
    const { createdCard, notFoundWords, inserted } = await addCard(
      deckId,
      sentence,
      userId,
      targetWords,
      definitions
    )

    return res.status(201).json({
      card: createdCard,
      notFoundWords,
      inserted,
    })
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to add card')
  }
}

export const editCardController = async (req: EditCardToDeckRequest, res: Response) => {
  try {
    const { cardId } = req.params
    const { sentence, targetWords, definitions } = req.body
    const userId = getRequestUserId(req)

    // checks if the user is allowed to do the action
    const card = await getCardById(cardId, ['createdByUserId'])
    if (!card) {
      return res.status(404).json(getErrorObject('Card not found'))
    }
    if (card.createdByUserId !== userId) {
      return res.status(403).json(getErrorObject('You do not have the right to edit this card'))
    }

    await editCard(cardId, userId, sentence, targetWords, definitions)

    const updatedCard = await getCardByIdWithWords(cardId)
    return res.status(200).json(updatedCard)
  } catch (error) {
    return handleError(error, res, 'Internal error: Failed to edit the card')
  }
}
