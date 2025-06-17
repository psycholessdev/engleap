import { Card, Deck, UserDeck, UserCardProgress } from '../models'
import { Op, fn, col, literal } from 'sequelize'

export const getDecksByUserId = async (userId: string, offset = 0, limit = 20) => {
  const userDecks = await UserDeck.findAll({
    where: { userId },
  })
  const deckIds = userDecks.map(ud => ud.deckId)

  return await Deck.findAll({
    where: {
      [Op.or]: [{ id: deckIds }, { creatorId: userId }],
    },
    include: [
      {
        model: Card,
        as: 'cards',
        attributes: [],
        required: false,
        include: [
          {
            model: UserCardProgress,
            as: 'userCardProgresses',
            required: false,
            attributes: [],
            where: {
              userId,
              [Op.or]: [{ nextReviewAt: null }, { nextReviewAt: { [Op.lte]: new Date() } }],
            },
          },
        ],
      },
    ],
    attributes: {
      include: [
        // Number of due cards for this user
        [fn('COUNT', literal(`"cards->userCardProgresses"."id"`)), 'dueCardCount'],
        // Total number of cards in the deck
        [fn('COUNT', col('cards.id')), 'cardCount'],
        // Total users following the deck
        [
          literal(`(
            SELECT COUNT(*) FROM "UserDecks"
            WHERE "UserDecks"."deckId" = "Deck"."id"
          )`),
          'usersFollowing',
        ],
        // Whether this user follows the deck
        [
          literal(`EXISTS (
            SELECT 1 FROM "UserDecks"
            WHERE "UserDecks"."deckId" = "Deck"."id"
              AND "UserDecks"."userId" = '${userId}'
          )`),
          'isUserFollowing',
        ],
      ],
    },
    group: ['Deck.id'],
    subQuery: false,
    offset,
    limit,
  })
}

export const getDeckWithInfo = async (id: string, userId: string) => {
  return await Deck.findOne({
    where: { id },
    include: [
      {
        model: Card,
        as: 'cards',
        attributes: [],
        required: false,
        include: [
          {
            model: UserCardProgress,
            as: 'userCardProgresses',
            required: false,
            attributes: [],
            where: {
              userId,
              [Op.or]: [{ nextReviewAt: null }, { nextReviewAt: { [Op.lte]: new Date() } }],
            },
          },
        ],
      },
    ],
    attributes: {
      include: [
        // Count of due cards for the user
        [fn('COUNT', literal(`"cards->userCardProgresses"."id"`)), 'dueCardCount'],
        // Total cards in the deck
        [fn('COUNT', col('cards.id')), 'cardCount'],
        // Total users following the deck
        [
          literal(`(
            SELECT COUNT(*) FROM "UserDecks"
            WHERE "UserDecks"."deckId" = "Deck"."id"
          )`),
          'usersFollowing',
        ],
        // Whether the current user follows the deck
        [
          literal(`EXISTS (
            SELECT 1 FROM "UserDecks"
            WHERE "UserDecks"."deckId" = "Deck"."id"
              AND "UserDecks"."userId" = '${userId}'
          )`),
          'isUserFollowing',
        ],
      ],
    },
    group: ['Deck.id'],
    subQuery: false,
  })
}

export const getDeckPlainById = async (id: string, attributes = ['id']) => {
  return await Deck.findByPk(id, { attributes })
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
