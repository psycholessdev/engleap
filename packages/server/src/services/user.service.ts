import { User } from '../models'

export const getUserByAuth = async (id: string, passwordHash: string) => {
  return await User.findOne({
    where: { id, passwordHash },
    attributes: ['id'],
  })
}

export const getUserByCredentials = async (email: string, passwordHash: string) => {
  return await User.findOne({
    where: { email, passwordHash },
    attributes: ['id'],
  })
}
