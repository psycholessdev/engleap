import { z } from 'zod'
import { cardIdParamUtilizedSchema } from '../schemas'

// :deckId param check
export type cardIdParamUtilizedData = z.infer<typeof cardIdParamUtilizedSchema>
