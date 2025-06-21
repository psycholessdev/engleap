import { z } from 'zod'

const paginationQueryUtilizedSchema = z.strictObject({
  offset: z.coerce.number({ message: 'offset should be a number' }).min(0).max(1000000).default(0),

  limit: z.coerce
    .number({ message: 'limit should be a number' })
    .min(0, { message: 'limit should be greater than 0' })
    .max(30, { message: 'limit should be at much 30 characters' })
    .default(15),
})

export default paginationQueryUtilizedSchema
