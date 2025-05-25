import { Deck } from '../models'

export const createDeck = async (
  title: string,
  description: string,
  creatorId: string,
  isPublic: boolean
) => {
  return await Deck.create({ title, description, creatorId, isPublic })
}

export const getDeckById = async (id: string, attributes = ['id']) => {
  return await Deck.findOne({
    where: { id },
    attributes,
  })
}
