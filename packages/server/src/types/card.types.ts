import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { addCardToDeckSchema } from '../schemas'
import { deckIdParamUtilizedData } from '../utils'

export type addCardToDeckData = z.infer<typeof addCardToDeckSchema>
export type addCardToDeckRequest = Request<deckIdParamUtilizedData, AnyObject, addCardToDeckData>
