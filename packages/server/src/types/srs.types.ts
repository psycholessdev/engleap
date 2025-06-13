import type { Request } from 'express'
import { z } from 'zod'
import { getSrsCardsParamSchema, updateSrsCardSchema } from '../schemas'
import type { AnyObject } from './utils.types'
import { cardIdParamUtilizedData } from '../utils'

export type GetSrsCardsData = z.infer<typeof getSrsCardsParamSchema>
export type GetSrsCardsRequest = Request<AnyObject, AnyObject, AnyObject, GetSrsCardsData>

export type UpdateSrsCardData = z.infer<typeof updateSrsCardSchema>
export type UpdateSrsCardRequest = Request<cardIdParamUtilizedData, AnyObject, UpdateSrsCardData>
