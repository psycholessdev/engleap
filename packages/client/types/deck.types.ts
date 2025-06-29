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
export type GetMyDecksResponse = DeckWithCardInfo[]

export type PublicDeck = Deck & {
  cardCount: string
  usersFollowing: string
}
export type GetPublicDecksResponse = PublicDeck[]

export interface CreateDeckRequest {
  title: string
  description?: string
  emoji?: string
  isPublic: boolean
}
export type EditDeckRequest = Partial<CreateDeckRequest>
