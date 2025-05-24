import express from 'express'
import { validateRequestData } from '../middlewares'
import { credentialsAuthSchema } from '../schemas'
import { credentialsAuthController } from '../controllers'

const router = express.Router()

router.post('/credentials', validateRequestData(credentialsAuthSchema), credentialsAuthController)

export default router
