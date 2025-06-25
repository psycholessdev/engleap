import { ServiceResponseCache } from '../models'

export const getCachedServiceResponse = async (serviceName: string, query: string) => {
  return await ServiceResponseCache.findOne({
    where: { serviceName, query },
  })
}

export const cacheServiceResponse = async (
  serviceName: string,
  query: string,
  similarWords: string[]
) => {
  const result = await ServiceResponseCache.findOrCreate({
    where: { serviceName, query, similarWords },
  })

  return result[0]
}
