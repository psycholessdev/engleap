import jwt from 'jsonwebtoken'
import { User } from '../models'

export const signJwt = (userId: string) => {
  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) throw new Error('JWT_SECRET env variable is required')

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '90d' })
}

export const verifyJwt = async (token: string): Promise<User | undefined> => {
  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) throw new Error('JWT_SECRET env variable is required')

  return await new Promise(resolve => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        // resolve({ id: decoded['id'] } as User)
        resolve(decoded as User)
      } else {
        resolve(undefined)
      }
    })
  })
}
