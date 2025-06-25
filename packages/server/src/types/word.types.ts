import type { Request } from 'express'
import { z } from 'zod'
import { wordParamSchema } from '../schemas'

export type GetWordsData = z.infer<typeof wordParamSchema>
export type GetWordsRequest = Request<GetWordsData>
