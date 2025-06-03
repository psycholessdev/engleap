const serverPort = Number(process.env.SERVER_PORT || 3001)
const prodUrl = process.env.ORIGIN_PROD_URL || 'https://engleap.psycholess.com'

const apiBackendUrl =
  process.env.NODE_ENV === 'development' ? `http://localhost:${serverPort}/api` : `${prodUrl}/api`

export const getBackendUrl = (): string => {
  return apiBackendUrl
}
