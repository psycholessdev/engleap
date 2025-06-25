import type { Request } from 'express'
import { z } from 'zod'
import {
  wordParamSchema,
  cardIdParamUtilizedSchema,
  defIdParamUtilizedSchema,
  paginationQueryUtilizedSchema,
} from '../schemas'
import type { AnyObject } from './utils.types'

export type GetDefinitionsByWordData = z.infer<typeof wordParamSchema>
export type GetDefinitionsByWordRequest = Request<GetDefinitionsByWordData>

export type GetDefinitionsForCardData = z.infer<typeof cardIdParamUtilizedSchema>
type PaginationQueryUtilized = z.infer<typeof paginationQueryUtilizedSchema>
export type GetDefinitionsForCardRequest = Request<
  GetDefinitionsForCardData,
  AnyObject,
  AnyObject,
  PaginationQueryUtilized
>

export type DeleteUserDefinitionData = z.infer<typeof defIdParamUtilizedSchema>
export type DeleteUserDefinitionRequest = Request<DeleteUserDefinitionData>
