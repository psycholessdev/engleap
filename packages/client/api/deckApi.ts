import { $axios } from '@/api/baseApi'

export interface Deck {
  id: string
  title: string
  description: string
  emoji: string
  creatorId: string
  isPublic: string
}

export type DeckWithCardInfo = Deck & {
  cardCount: string
  dueCardCount: string
  usersFollowing: string
  isUserFollowing: boolean
}
type GetMyDecksResponse = DeckWithCardInfo[]

export const getMyDecks = async (offset: number, limit: number): Promise<GetMyDecksResponse> => {
  const res = await $axios.get('/decks/my', {
    params: { offset, limit },
  })
  return res.data
}

export type PublicDeck = Deck & {
  cardCount: string
  usersFollowing: string
}
type GetPublicDecksResponse = PublicDeck[]

export const getPublicDecks = async (
  query: string,
  offset: number,
  limit: number
): Promise<GetPublicDecksResponse> => {
  const res = await $axios.get('/decks/all', {
    params: { query, offset, limit },
  })
  return res.data
}

export interface CreateDeckRequest {
  title: string
  description?: string
  emoji?: string
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

export const copyDeck = async (deckId: string): Promise<Deck> => {
  const res = await $axios.post(`/decks/${deckId}/copy`)
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
