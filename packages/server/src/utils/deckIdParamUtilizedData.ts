import { z } from 'zod'
import { deckIdParamUtilizedSchema } from '../schemas'

// :deckId param check
export type DeckIdParamUtilizedData = z.infer<typeof deckIdParamUtilizedSchema>
