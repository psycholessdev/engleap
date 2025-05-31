import express from 'express'
import { validateRequestData } from '../middlewares'
import { wordParamSchema } from '../schemas'
import { getDefinitionsByWordController } from '../controllers'

const router = express.Router()

router.get('/:word', validateRequestData(wordParamSchema, 'params'), getDefinitionsByWordController)

export default router
