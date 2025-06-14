import { $axios } from '@/api/baseApi'

export interface Deck {
  id: string
  title: string
  description: string
  creatorId: string
  isPublic: string
}

export type DeckWithCardCount = Deck & { cardCount: string }
type GetMyDecksResponse = DeckWithCardCount[]

export const getMyDecks = async (): Promise<GetMyDecksResponse> => {
  const res = await $axios.get('/decks')
  return res.data
}

export interface CreateDeckRequest {
  title: string
  description?: string
  isPublic: boolean
}

type EditDeckRequest = Partial<CreateDeckRequest>

export const createDeck = async (data: CreateDeckRequest): Promise<Deck> => {
  const res = await $axios.post('/decks', data)
  return res.data
}

export const editDeck = async (deckId: string, data: EditDeckRequest): Promise<Deck> => {
  const res = await $axios.put(`/decks/${deckId}`, data)
  return res.data
}

export interface ChangeFollowStatusDeckRequest {
  deckId: string
}

export const followDeck = async (data: ChangeFollowStatusDeckRequest) => {
  await $axios.post('/user/decks', data)
}

export const unfollowDeck = async (data: ChangeFollowStatusDeckRequest) => {
  await $axios.delete('/user/decks', { data })
}
