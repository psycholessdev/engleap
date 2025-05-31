import { z } from 'zod'

const uuidUtilizedSchema = z
  .string({ message: 'you should provide a valid uuid' })
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
    message: 'deckId should be a valid uuid',
  })

export default uuidUtilizedSchema
