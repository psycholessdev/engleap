import { addCard } from './cards.service'
import { Card, Deck, UserDeck, UserCardProgress, CardTargetWord, Word } from '../models'
import { Op, fn, col, literal, Transaction } from 'sequelize'
import { sequelize } from '../../db'
import { normalizeTargetWords } from '../utils'
import { getDefinitionsForCard } from './definitions.service'

export const getDecksWithInfoByUserId = async (userId: string, offset = 0, limit = 20) => {
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

export const getPublicDecksWithInfo = async (query: string, offset = 0, limit = 20) => {
  return await Deck.findAll({
    where: {
      [Op.and]: [{ isPublic: true }, { title: { [Op.iLike]: `%${query}%` } }],
    },
    include: [
      {
        model: Card,
        as: 'cards',
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [
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
  emoji: string,
  creatorId: string,
  isPublic: boolean
) => {
  return sequelize.transaction(async transaction => {
    const [deck, created] = await Deck.findOrCreate({
      where: { title, description, emoji, creatorId, isPublic },
      transaction,
    })

    if (created) {
      await followDeck(creatorId, deck.id, transaction)
    }

    return deck
  })
}

export const updateDeck = async (
  id: string,
  title?: string,
  emoji?: string,
  description?: string,
  isPublic?: boolean
) => {
  await Deck.update(
    { title, emoji, description, isPublic },
    {
      where: { id },
    }
  )
  return await Deck.findByPk(id)
}

export const copyDeck = async (id: string, userId: string) => {
  return sequelize.transaction(async transaction => {
    const targetDeck = await Deck.findByPk(id, { transaction })
    if (!targetDeck) {
      throw new Error('Deck not found')
    }

    const { title, description, isPublic, emoji, copiedFrom } = targetDeck
    const createdDeck = await Deck.create(
      {
        title: `${title} - copy`,
        description,
        isPublic,
        emoji,
        copiedFrom: copiedFrom ?? targetDeck.id,
        creatorId: userId,
      },
      { transaction }
    )

    const targetDeckCards = await Card.findAll({
      where: { deckId: targetDeck.id },
      include: [
        {
          model: CardTargetWord,
          attributes: ['id'],
          include: [
            {
              model: Word,
              attributes: ['id', 'text'],
            },
          ],
        },
      ],
      transaction,
    })

    for (const card of targetDeckCards) {
      // Create custom definitions for a Card
      // only custom non-approved defs will be copied
      // as approved ones will be shown publicly anyway
      const customDefs = await getDefinitionsForCard(card.id, 'userUnreviewed')
      const normalizedDefs = customDefs.map(def => ({
        word: def.word.text,
        sourceEntryId: def.sourceEntryId,
        sourceName: def.sourceName,
        text: def.text,
        partOfSpeech: def.partOfSpeech,
        syllabifiedWord: def.syllabifiedWord,
        pronunciationAudioUrl: def.audio,
        offensive: def.offensive,
        labels: def.labels,
        stems: [],
      }))

      const { createdCard } = await addCard(
        createdDeck.id,
        card.sentence,
        userId,
        normalizeTargetWords(card.targetWords),
        normalizedDefs,
        transaction
      )

      // Transfer UserCardProgress
      const cardProgress = await UserCardProgress.findOne({
        where: { userId, cardId: card.id },
        transaction,
      })
      if (cardProgress) {
        // if progress was recorded, transfer it to the card copy
        const { repetitionCount, easinessFactor, intervalDays, nextReviewAt, lastReviewedAt } =
          cardProgress
        await UserCardProgress.update(
          {
            repetitionCount,
            easinessFactor,
            intervalDays,
            nextReviewAt,
            lastReviewedAt,
          },
          {
            where: { userId, cardId: createdCard.id },
            transaction,
          }
        )
      }
    }

    await followDeck(userId, createdDeck.id, transaction)

    return createdDeck
  })
}

export const deleteDeck = async (id: string) => {
  await Deck.destroy({
    where: { id },
  })
}

export const followDeck = async (userId: string, deckId: string, transaction?: Transaction) => {
  const callback = async (transaction: Transaction) => {
    await UserDeck.findOrCreate({
      where: { userId, deckId },
      transaction,
    })

    // create zero progress for each card (if was not any)
    const cards = await Card.findAll({
      where: { deckId },
      attributes: ['id'],
      transaction,
    })
    await Promise.all(
      cards.map(card =>
        UserCardProgress.findOrCreate({
          where: {
            userId,
            cardId: card.id,
          },
          attributes: ['id'],
          transaction,
        })
      )
    )
  }

  if (transaction) {
    return await callback(transaction)
  }
  return await sequelize.transaction(callback)
}

export const unfollowDeck = async (userId: string, deckId: string) => {
  return await sequelize.transaction(async transaction => {
    await UserDeck.destroy({
      where: { userId, deckId },
      transaction,
    })

    // destroy all user progress
    const cards = await Card.findAll({
      where: { deckId },
      attributes: ['id'],
      transaction,
    })
    await Promise.all(
      cards.map(card =>
        UserCardProgress.destroy({
          where: { userId, cardId: card.id },
          transaction,
        })
      )
    )
  })
}

export const getIsFollowingDeck = async (userId: string, deckId: string) => {
  const userDeck = await UserDeck.findOne({
    where: { userId, deckId },
    attributes: ['id'],
  })

  return !!userDeck
}
