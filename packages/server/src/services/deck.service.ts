import { Card, Deck, UserDeck } from '../models'
import { Op, fn, col } from 'sequelize'

export const getDecksByUserId = async (userId: string, offset = 0, limit = 20) => {
  const userDecks = await UserDeck.findAll({
    where: { userId },
  })
  const deckIds = userDecks.map(ud => ud.deckId)

  return await Deck.findAll({
    where: {
      [Op.or]: [{ id: deckIds }, { creatorId: userId }],
    },

    // counts all cards in Deck in "cardCount" field
    include: [
      {
        model: Card,
        as: 'cards',
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [[fn('COUNT', col('cards.id')), 'cardCount']],
    },
    group: ['Deck.id'],
    subQuery: false,
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

export const updateDeck = async (
  id: string,
  title?: string,
  description?: string,
  isPublic?: boolean
) => {
  await Deck.update(
    { title, description, isPublic },
    {
      where: { id },
    }
  )
  return await Deck.findByPk(id)
}

export const deleteDeck = async (id: string) => {
  await Deck.destroy({
    where: { id },
  })
}

export const getDeckById = async (id: string, attributes = ['id']) => {
  return await Deck.findByPk(id, { attributes })
}

export const getDeckStats = async (deckId: string, userId?: string) => {
  const cardsTotal = await Card.count({ where: { deckId } })
  const usersFollowing = await UserDeck.count({ where: { deckId } })
  let isUserFollowing = false
  if (userId) {
    const found = await UserDeck.findOne({
      where: { deckId, userId },
      attributes: ['id'],
    })
    isUserFollowing = !!found
  }

  return { cardsTotal, usersFollowing, isUserFollowing }
}
