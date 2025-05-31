import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  createDeckSchema,
  deckIdParamUtilizedSchema,
  paginationQueryUtilizedSchema,
} from '../schemas'
import { createDeckController, deleteDeckController, getAllDecksController } from '../controllers'

const router = express.Router()

router.get(
  '/',
  validateRequestData(paginationQueryUtilizedSchema, 'query'),
  getAllDecksController as unknown as express.RequestHandler
)

router.post('/', validateRequestData(createDeckSchema), createDeckController)

router.delete(
  '/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  deleteDeckController
)

export default router
