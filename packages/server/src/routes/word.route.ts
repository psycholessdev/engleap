import express from 'express'
import { validateRequestData } from '../middlewares'
import { wordParamSchema } from '../schemas'
import { getMatchedWordsController } from '../controllers'

const router = express.Router()

router.get('/:word', validateRequestData(wordParamSchema, 'params'), getMatchedWordsController)

export default router
