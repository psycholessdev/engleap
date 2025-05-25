import express from 'express'
import { validateRequestData } from '../middlewares'
import { createDeckSchema, getAllCardsByDeckIdSchema, deckIdParamUtilizedSchema } from '../schemas'
import { createDeckController, getAllCardsByDeckIdController } from '../controllers'

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
// router.post('/:deckId/cards')

export default router
