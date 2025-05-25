import { Request, Response } from 'express'
import { getUserByCredentials, getUserByEmail, getUserByUsername, createUser } from '../services'
import { credentialsAuthRequest, createAccountRequest } from '../types'
import md5 from 'md5'
import { getErrorObject, handleError } from '../utils'
import { setAuthCookie, deleteAuthCookie } from './utils'

export const credentialsAuthController = async (req: credentialsAuthRequest, res: Response) => {
  try {
    if (req.authedUser) {
      return res
        .status(409)
        .json(getErrorObject('You already authenticated, please log out first.'))
    }

    const { email, password } = req.body
    const hashedPassword = md5(password)
    const user = await getUserByCredentials(email, hashedPassword)

    if (!user) {
      return res
        .status(403)
        .json(getErrorObject('Authentication failed: The credentials are wrong'))
    }
    setAuthCookie(res, user.id, hashedPassword)
    return res.status(200).json({ authenticated: true, userId: user.id })
  } catch (error) {
    return handleError(error, res, 'Failed to authenticate')
  }
}

export const createAccountController = async (req: createAccountRequest, res: Response) => {
  try {
    if (req.authedUser) {
      return res
        .status(409)
        .json(getErrorObject('You already authenticated, please log out first.'))
    }

    const { username, email, password, proficiencyLevel } = req.body

    // check for conflicts
    const [emailTaken, usernameTaken] = await Promise.all([
      getUserByEmail(email),
      getUserByUsername(username),
    ])
    if (emailTaken) {
      return res
        .status(409)
        .json(getErrorObject('User with such email already exists', { field: 'email' }))
    }
    if (usernameTaken) {
      return res
        .status(409)
        .json(getErrorObject('User with such username already exists', { field: 'username' }))
    }

    // create the user
    const hashedPassword = md5(password)
    const createdUser = await createUser(username, email, hashedPassword, proficiencyLevel)

    setAuthCookie(res, createdUser.id, hashedPassword)
    return res.status(201).json({ success: true, userId: createdUser.id })
  } catch (error) {
    return handleError(error, res, 'Failed to create account')
  }
}

export const logoutController = async (req: Request, res: Response) => {
  try {
    if (!req.authedUser) {
      return res.status(400).json(getErrorObject('Already Unauthorized'))
    }

    deleteAuthCookie(res)
    return res.status(200).json({ success: true })
  } catch (error) {
    return handleError(error, res)
  }
}
