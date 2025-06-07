import express from 'express'
import { validateRequestData } from '../middlewares'
import { wordParamSchema, cardIdParamUtilizedSchema } from '../schemas'
import { getDefinitionsByWordController, getDefinitionsForCardController } from '../controllers'

const router = express.Router()

router.get('/:word', validateRequestData(wordParamSchema, 'params'), getDefinitionsByWordController)

router.get(
  '/card/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  getDefinitionsForCardController
)

export default router
