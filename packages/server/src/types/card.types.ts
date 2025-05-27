import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { addCardToDeckSchema, editCardToDeckSchema } from '../schemas'
import { DeckIdParamUtilizedData, cardIdParamUtilizedData } from '../utils'

export type AddCardToDeckData = z.infer<typeof addCardToDeckSchema>
export type AddCardToDeckRequest = Request<DeckIdParamUtilizedData, AnyObject, AddCardToDeckData>

type CardIdDeckIdParamUtilizedData = cardIdParamUtilizedData & DeckIdParamUtilizedData
export type GetCardByIdRequest = Request<CardIdDeckIdParamUtilizedData>

export type EditCardToDeckData = z.infer<typeof editCardToDeckSchema>
export type EditCardToDeckRequest = Request<
  CardIdDeckIdParamUtilizedData,
  AnyObject,
  EditCardToDeckData
>
