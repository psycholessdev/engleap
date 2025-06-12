import { z } from 'zod'

// :defId param check
export const defIdParamUtilizedSchema = z.strictObject({
  defId: z
    .string({ message: 'you should provide a valid uuid' })
    .uuid({ message: 'defId should be a valid uuid' }),
})
