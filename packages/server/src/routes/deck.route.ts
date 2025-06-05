import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  createDeckSchema,
  editDeckSchema,
  deckIdParamUtilizedSchema,
  paginationQueryUtilizedSchema,
} from '../schemas'
import {
  createDeckController,
  deleteDeckController,
  getAllDecksController,
  getDeckController,
  editDeckController,
} from '../controllers'

const router = express.Router()

router.get(
  '/',
  validateRequestData(paginationQueryUtilizedSchema, 'query'),
  getAllDecksController as unknown as express.RequestHandler
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
