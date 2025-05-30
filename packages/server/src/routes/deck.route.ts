import express from 'express'
import { validateRequestData } from '../middlewares'
import { createDeckSchema, deckIdParamUtilizedSchema } from '../schemas'
import { createDeckController, deleteDeckController } from '../controllers'

const router = express.Router()

router.post('/', validateRequestData(createDeckSchema), createDeckController)

router.delete(
  '/:deckId',
  validateRequestData(deckIdParamUtilizedSchema, 'params'),
  deleteDeckController
)

export default router
