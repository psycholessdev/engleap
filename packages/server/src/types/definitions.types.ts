import type { Request } from 'express'
import { z } from 'zod'
import { wordParamSchema, cardIdParamUtilizedSchema } from '../schemas'

export type GetDefinitionsByWordData = z.infer<typeof wordParamSchema>
export type GetDefinitionsByWordRequest = Request<GetDefinitionsByWordData>

export type GetDefinitionsForCardData = z.infer<typeof cardIdParamUtilizedSchema>
export type GetDefinitionsForCardRequest = Request<GetDefinitionsForCardData>
