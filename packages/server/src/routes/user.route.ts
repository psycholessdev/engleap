import express from 'express'
import { validateRequestData } from '../middlewares'
import { changeFollowStatusDeckSchema } from '../schemas'
import { followDeckController, unfollowDeckController } from '../controllers'

const router = express.Router()

router.post('/decks', validateRequestData(changeFollowStatusDeckSchema), followDeckController)

router.delete('/decks', validateRequestData(changeFollowStatusDeckSchema), unfollowDeckController)

export default router
