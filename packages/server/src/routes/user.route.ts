import express from 'express'
import { validateRequestData } from '../middlewares'
import { changeFollowStatusDeckSchema } from '../schemas'
import { followDeckController, unfollowDeckController, getUserController } from '../controllers'

const router = express.Router()

router.get('/', getUserController)

router.post('/decks', validateRequestData(changeFollowStatusDeckSchema), followDeckController)

router.delete('/decks', validateRequestData(changeFollowStatusDeckSchema), unfollowDeckController)

export default router
