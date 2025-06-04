import { $axios } from '@/api/baseApi'

export interface Deck {
  id: string
  title: string
  description: string
  creatorId: string
  isPublic: string
}

export const getMyDecks = async (): Promise<Deck[]> => {
  const res = await $axios.get('/decks')
  return res.data
}

export interface CreateDeckRequest {
  title: string
  description?: string
  isPublic: boolean
}

export const CreateDeck = async (data: CreateDeckRequest): Promise<Deck> => {
  const res = await $axios.post('/decks', data)
  return res.data
}
