import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { credentialsAuthSchema, createAccountSchema } from '../schemas'

export type credentialsAuthData = z.infer<typeof credentialsAuthSchema>
export type credentialsAuthRequest = Request<AnyObject, AnyObject, credentialsAuthData>

export type createAccountData = z.infer<typeof createAccountSchema>
export type createAccountRequest = Request<AnyObject, AnyObject, createAccountData>
