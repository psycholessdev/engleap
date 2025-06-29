import { $axios } from '@/api/baseApi'
import { GetDefinitionsForCardResponse } from '@/types'

export const getDefinitionsForCard = async (
  cardId: string,
  offset: number,
  limit: number
): Promise<GetDefinitionsForCardResponse> => {
  const res = await $axios.get(`/definitions/card/${cardId}`, {
    params: { offset, limit },
  })
  return res.data
}

export const deleteDefinition = async (defId: string) => {
  await $axios.delete(`/definitions/${defId}`)
}
