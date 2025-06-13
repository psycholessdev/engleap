import type { Request } from 'express'
import { z } from 'zod'
import { updateSrsCardSchema } from '../schemas'
import type { AnyObject } from './utils.types'
import { cardIdParamUtilizedData } from '../utils'

export type UpdateSrsCardData = z.infer<typeof updateSrsCardSchema>
export type UpdateSrsCardRequest = Request<cardIdParamUtilizedData, AnyObject, UpdateSrsCardData>
