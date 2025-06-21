import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import {
  createDeckSchema,
  paginationQueryUtilizedSchema,
  editDeckSchema,
  changeFollowStatusDeckSchema,
  getPublicDecksRequestQuerySchema,
} from '../schemas'
import { DeckIdParamUtilizedData } from '../utils'

export type GetAllDecksData = z.infer<typeof paginationQueryUtilizedSchema>
export type GetAllDecksRequest = Request<AnyObject, AnyObject, AnyObject, GetAllDecksData>

export type GetPublicDecksData = z.infer<typeof getPublicDecksRequestQuerySchema>
export type GetPublicDecksRequest = Request<AnyObject, AnyObject, AnyObject, GetPublicDecksData>

export type CreateDeckData = z.infer<typeof createDeckSchema>
export type CreateDeckRequest = Request<AnyObject, AnyObject, CreateDeckData>

export type EditDeckData = z.infer<typeof editDeckSchema>
export type EditDeckRequest = Request<DeckIdParamUtilizedData, AnyObject, EditDeckData>

export type GetDeckRequest = Request<DeckIdParamUtilizedData>
export type DeleteDeckRequest = Request<DeckIdParamUtilizedData>

export type changeFollowStatusDeckData = z.infer<typeof changeFollowStatusDeckSchema>
export type FollowDeckRequest = Request<AnyObject, AnyObject, changeFollowStatusDeckData>
export type UnfollowDeckRequest = Request<AnyObject, AnyObject, changeFollowStatusDeckData>
