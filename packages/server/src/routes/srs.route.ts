import express from 'express'
import { validateRequestData } from '../middlewares'
import { cardIdParamUtilizedSchema, updateSrsCardSchema, getSrsCardsParamSchema } from '../schemas'
import { updateSrsCardProgressController, getSrsCardsController } from '../controllers'

const router = express.Router()

// ?deckId={deckId}
router.get('/cards', validateRequestData(getSrsCardsParamSchema, 'query'), getSrsCardsController)

router.post(
  '/card/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  validateRequestData(updateSrsCardSchema),
  updateSrsCardProgressController
)

export default router
