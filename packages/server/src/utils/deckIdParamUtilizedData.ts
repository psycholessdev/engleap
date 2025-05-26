import { z } from 'zod'
import { deckIdParamUtilizedSchema } from '../schemas'

// :deckId param check
export type deckIdParamUtilizedData = z.infer<typeof deckIdParamUtilizedSchema>
