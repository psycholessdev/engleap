import { Request } from 'express'

// extracts userId from request and returns it
// if it's missing, throws an error handled in the request
export const getRequestUserId = <
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
>(
  req: Request<P, ResBody, ReqBody, ReqQuery>
) => {
  const userId = req.authedUser?.id

  if (!userId) {
    throw new Error('Internal error: Failed to get userId')
  }

  return userId
}
