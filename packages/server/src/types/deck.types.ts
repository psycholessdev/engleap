import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { createDeckSchema } from '../schemas'
import { DeckIdParamUtilizedData } from '../utils'

export type CreateDeckData = z.infer<typeof createDeckSchema>
export type CreateDeckRequest = Request<AnyObject, AnyObject, CreateDeckData>

export type DeleteDeckRequest = Request<DeckIdParamUtilizedData>
