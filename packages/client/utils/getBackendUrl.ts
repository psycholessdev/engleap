const serverPort = Number(process.env.SERVER_PORT || 3001)
const prodUrl = process.env.ORIGIN_PROD_URL || 'https://engleap.psycholess.com'

export const getBackendUrl = (forClient = false): string => {
  // dev -> http://localhost:${serverPort}/api
  // prod (backend) -> docker http://engleap-server:${serverPort}/api
  // prod (client) -> ${prodUrl}/api
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:${serverPort}/api`
    : forClient
    ? `${prodUrl}/api`
    : `http://engleap-server:${serverPort}/api`
}
