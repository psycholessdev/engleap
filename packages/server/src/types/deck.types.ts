import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { createDeckSchema, paginationQueryUtilizedSchema } from '../schemas'
import { DeckIdParamUtilizedData } from '../utils'

export type GetAllDecksData = z.infer<typeof paginationQueryUtilizedSchema>
export type GetAllDecksRequest = Request<AnyObject, AnyObject, AnyObject, GetAllDecksData>

export type CreateDeckData = z.infer<typeof createDeckSchema>
export type CreateDeckRequest = Request<AnyObject, AnyObject, CreateDeckData>

export type DeleteDeckRequest = Request<DeckIdParamUtilizedData>
