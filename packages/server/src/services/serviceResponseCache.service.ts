import { ServiceResponseCacheModel } from '../models'

export const getCachedServiceResponse = async (serviceName: string, query: string) => {
  return await ServiceResponseCacheModel.findOne({
    where: { serviceName, query },
  })
}

export const cacheServiceResponse = async (
  serviceName: string,
  query: string,
  similarWords: string[]
) => {
  const result = await ServiceResponseCacheModel.findOrCreate({
    where: { serviceName, query, similarWords },
  })

  return result[0]
}
