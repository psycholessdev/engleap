import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  createDeckSchema,
  getAllCardsByDeckIdSchema,
  deckIdParamUtilizedSchema,
  addCardToDeckSchema,
  cardIdDeckIdScheme,
  editCardToDeckSchema,
} from '../schemas'
import {
  createDeckController,
  getAllCardsByDeckIdController,
  addCardToDeckController,
  getCardByIdController,
  editCardController,
} from '../controllers'

const router = express.Router()

router.post('/', validateRequestData(createDeckSchema), createDeckController)

// get cards (?limit=33&offset=1)
router.get(
  '/:deckId/cards',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  validateRequestData(getAllCardsByDeckIdSchema, 'query'),
  getAllCardsByDeckIdController as unknown as express.RequestHandler
)

// create card
router.post(
  '/:deckId/cards',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  validateRequestData(addCardToDeckSchema),
  addCardToDeckController
)

// get card
router.get(
  '/:deckId/cards/:cardId',
  validateRequestData(cardIdDeckIdScheme, 'params'),
  getCardByIdController
)

// edit card
router.put(
  '/:deckId/cards/:cardId',
  validateRequestData(cardIdDeckIdScheme, 'params'),
  validateRequestData(editCardToDeckSchema),
  editCardController
)

export default router
