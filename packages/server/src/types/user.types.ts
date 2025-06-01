import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import {
  credentialsAuthSchema,
  createAccountSchema,
  changeFollowStatusDeckSchema,
} from '../schemas'

export type CredentialsAuthData = z.infer<typeof credentialsAuthSchema>
export type CredentialsAuthRequest = Request<AnyObject, AnyObject, CredentialsAuthData>

export type CreateAccountData = z.infer<typeof createAccountSchema>
export type CreateAccountRequest = Request<AnyObject, AnyObject, CreateAccountData>

export type changeFollowStatusDeckData = z.infer<typeof changeFollowStatusDeckSchema>
export type FollowDeckRequest = Request<AnyObject, AnyObject, changeFollowStatusDeckData>
export type UnfollowDeckRequest = Request<AnyObject, AnyObject, changeFollowStatusDeckData>
