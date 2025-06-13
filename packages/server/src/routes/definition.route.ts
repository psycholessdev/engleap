import express from 'express'
import { validateRequestData } from '../middlewares'
import { wordParamSchema, cardIdParamUtilizedSchema, defIdParamUtilizedSchema } from '../schemas'
import {
  getDefinitionsByWordController,
  getDefinitionsForCardController,
  deleteUserDefinitionController,
} from '../controllers'

const router = express.Router()

router.get(
  '/word/:word',
  validateRequestData(wordParamSchema, 'params'),
  getDefinitionsByWordController
)

router.delete(
  '/:defId',
  validateRequestData(defIdParamUtilizedSchema, 'params'),
  deleteUserDefinitionController
)

router.get(
  '/card/:cardId',
  validateRequestData(cardIdParamUtilizedSchema, 'params'),
  getDefinitionsForCardController
)

export default router
