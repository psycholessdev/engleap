import express from 'express'
import { validateRequestData } from '../middlewares'
import { credentialsAuthSchema, createAccountSchema } from '../schemas'
import { authenticateController, createAccountController, logoutController } from '../controllers'

const router = express.Router()

router.post('/signin', validateRequestData(credentialsAuthSchema), authenticateController)

router.post('/signup', validateRequestData(createAccountSchema), createAccountController)

router.post('/logout', logoutController)

export default router
