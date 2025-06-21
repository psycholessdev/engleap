import express from 'express'
import { validateRequestData } from '../middlewares'
import {
  wordParamSchema,
  cardIdParamUtilizedSchema,
  defIdParamUtilizedSchema,
  paginationQueryUtilizedSchema,
} from '../schemas'
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
  validateRequestData(paginationQueryUtilizedSchema, 'query'),
  getDefinitionsForCardController as unknown as express.RequestHandler
)

export default router
