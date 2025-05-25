import type { Request } from 'express'
import type { AnyObject } from './utils.types'
import { z } from 'zod'
import { createDeckSchema, getAllCardsByDeckIdSchema, deckIdParamUtilizedSchema } from '../schemas'

// :deckId param check
export type deckIdParamUtilizedData = z.infer<typeof deckIdParamUtilizedSchema>

export type createDeckData = z.infer<typeof createDeckSchema>
export type createDeckRequest = Request<AnyObject, AnyObject, createDeckData>

export type getAllCardsByDeckIdData = z.infer<typeof getAllCardsByDeckIdSchema>
export type getAllCardsByDeckIdRequest = Request<
  deckIdParamUtilizedData,
  AnyObject,
  AnyObject,
  getAllCardsByDeckIdData
>
