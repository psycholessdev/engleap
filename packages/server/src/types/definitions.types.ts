import type { Request } from 'express'
import { z } from 'zod'
import { wordParamSchema } from '../schemas'

export type GetDefinitionsByWordData = z.infer<typeof wordParamSchema>
export type GetDefinitionsByWordRequest = Request<GetDefinitionsByWordData>
