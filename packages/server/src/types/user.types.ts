import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { credentialsAuthSchema, createAccountSchema } from '../schemas'

export type CredentialsAuthData = z.infer<typeof credentialsAuthSchema>
export type CredentialsAuthRequest = Request<AnyObject, AnyObject, CredentialsAuthData>

export type CreateAccountData = z.infer<typeof createAccountSchema>
export type CreateAccountRequest = Request<AnyObject, AnyObject, CreateAccountData>
