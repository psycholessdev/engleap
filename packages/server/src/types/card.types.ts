import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { addCardToDeckSchema, editCardToDeckSchema, getCardsRequestQuerySchema } from '../schemas'
import { DeckIdParamUtilizedData, cardIdParamUtilizedData } from '../utils'

export type AddCardToDeckData = z.infer<typeof addCardToDeckSchema>
export type AddCardToDeckRequest = Request<DeckIdParamUtilizedData, AnyObject, AddCardToDeckData>

export type GetCardByIdRequest = Request<cardIdParamUtilizedData>
export type DeleteCardByIdRequest = Request<cardIdParamUtilizedData>

export type EditCardToDeckData = z.infer<typeof editCardToDeckSchema>
export type EditCardToDeckRequest = Request<cardIdParamUtilizedData, AnyObject, EditCardToDeckData>

export type GetAllCardsByDeckIdData = z.infer<typeof getCardsRequestQuerySchema>
export type GetAllCardsByDeckIdRequest = Request<
  DeckIdParamUtilizedData,
  AnyObject,
  AnyObject,
  GetAllCardsByDeckIdData
>
