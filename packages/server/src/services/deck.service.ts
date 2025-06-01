import { Deck, UserDeck } from '../models'
import { Op } from 'sequelize'

export const getDecksByUserId = async (userId: string, offset = 0, limit = 20) => {
  const userDecks = await UserDeck.findAll({
    where: { userId },
  })
  const deckIds = userDecks.map(ud => ud.deckId)

  return await Deck.findAll({
    where: {
      [Op.or]: [{ id: deckIds }, { creatorId: userId }],
    },
    offset,
    limit,
  })
}

export const createDeck = async (
  title: string,
  description: string,
  creatorId: string,
  isPublic: boolean
) => {
  const [deck, created] = await Deck.findOrCreate({
    where: { title, description, creatorId, isPublic },
  })

  if (created) {
    await UserDeck.create({ userId: creatorId, deckId: deck.id })
  }

  return deck
}

export const deleteDeck = async (id: string) => {
  await Deck.destroy({
    where: { id },
  })
}

export const getDeckById = async (id: string, attributes = ['id']) => {
  return await Deck.findByPk(id, { attributes })
}
