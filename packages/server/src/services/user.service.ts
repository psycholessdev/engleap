import { User } from '../models'

export const getUserByAuth = async (id: string, passwordHash: string, attributes = ['id']) => {
  return await User.findOne({
    where: { id, passwordHash },
    attributes,
  })
}

export const getUserByCredentials = async (
  email: string,
  passwordHash: string,
  attributes = ['id']
) => {
  return await User.findOne({
    where: { email, passwordHash },
    attributes,
  })
}

export const getUserByEmail = async (email: string, attributes = ['id']) => {
  return await User.findOne({
    where: { email },
    attributes,
  })
}

export const getUserByUsername = async (username: string, attributes = ['id']) => {
  return await User.findOne({
    where: { username },
    attributes,
  })
}

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string,
  proficiencyLevel: string
) => {
  return await User.create({ username, email, passwordHash, proficiencyLevel })
}
