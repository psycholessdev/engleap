import { Definition } from '@/types'

export const canEditDefinition = (def: Definition, userId?: string) => {
  return userId && def.createdByUserId && def.source === 'user' && def.createdByUserId === userId
}
