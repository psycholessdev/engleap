import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  getCardsRequestQuerySchema,
  addCardToDeckSchema,
  editCardToDeckSchema,
  cardIdParamUtilizedSchema,
  deckIdParamUtilizedSchema,
} from '../schemas'
import {
  getAllCardsByDeckIdController,
  addCardToDeckController,
  getCardByIdController,
  editCardController,
  deleteCardController,
} from '../controllers'

const router = express.Router()

// get cards (?limit=33&offset=1)
router.get(
  '/deck/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  validateRequestData(getCardsRequestQuerySchema, 'query'),
  getAllCardsByDeckIdController as unknown as express.RequestHandler
)

// create card
router.post(
  '/deck/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  validateRequestData(addCardToDeckSchema),
  addCardToDeckController
)

// get card
router.get(
  '/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  getCardByIdController
)

// edit card
router.put(
  '/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  validateRequestData(editCardToDeckSchema),
  editCardController
)

router.delete(
  '/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  deleteCardController
)

export default router
