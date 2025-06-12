import type { Request } from 'express'
import { z } from 'zod'
import { wordParamSchema, cardIdParamUtilizedSchema, defIdParamUtilizedSchema } from '../schemas'

export type GetDefinitionsByWordData = z.infer<typeof wordParamSchema>
export type GetDefinitionsByWordRequest = Request<GetDefinitionsByWordData>

export type GetDefinitionsForCardData = z.infer<typeof cardIdParamUtilizedSchema>
export type GetDefinitionsForCardRequest = Request<GetDefinitionsForCardData>

export type DeleteUserDefinitionData = z.infer<typeof defIdParamUtilizedSchema>
export type DeleteUserDefinitionRequest = Request<DeleteUserDefinitionData>
