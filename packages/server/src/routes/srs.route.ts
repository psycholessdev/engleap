import express from 'express'
import { validateRequestData } from '../middlewares'
import { cardIdParamUtilizedSchema, updateSrsCardSchema } from '../schemas'
import { updateSrsCardProgressController, getSrsCardsController } from '../controllers'

const router = express.Router()

router.get('/cards', getSrsCardsController)

router.post(
  '/card/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  validateRequestData(updateSrsCardSchema),
  updateSrsCardProgressController
)

export default router
