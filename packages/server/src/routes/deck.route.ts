import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  createDeckSchema,
  editDeckSchema,
  deckIdParamUtilizedSchema,
  paginationQueryUtilizedSchema,
  getPublicDecksRequestQuerySchema,
} from '../schemas'
import {
  createDeckController,
  deleteDeckController,
  getUserDecksController,
  getPublicDecksController,
  getDeckController,
  editDeckController,
} from '../controllers'

const router = express.Router()

// user's decks list
router.get(
  '/my',
  validateRequestData(paginationQueryUtilizedSchema, 'query'),
  getUserDecksController as unknown as express.RequestHandler
)

// public search
router.get(
  '/all',
  validateRequestData(getPublicDecksRequestQuerySchema, 'query'),
  getPublicDecksController as unknown as express.RequestHandler
)

router.get('/:deckId', validateRequestData(deckIdParamUtilizedSchema, 'params'), getDeckController)

router.post('/', validateRequestData(createDeckSchema), createDeckController)

router.put(
  '/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  validateRequestData(editDeckSchema),
  editDeckController
)

router.delete(
  '/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  deleteDeckController
)

export default router
