import { sequelize } from '../../db'
import { UserCardProgress, Card, CardTargetWord, Word } from '../models'
import { Op } from 'sequelize'

export const getSrsWithCards = async (userId: string, deckId?: string) => {
  const CardsFilter = deckId ? { deckId } : undefined

  return await UserCardProgress.findAll({
    where: {
      userId,
      [Op.or]: [{ nextReviewAt: null }, { nextReviewAt: { [Op.lte]: new Date() } }],
    },
    include: [
      {
        model: Card,
        where: CardsFilter,
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
      },
    ],
    order: [['nextReviewAt', 'ASC']], // earliest first
    limit: 20,
  })
}

export const updateSrsProgress = async (userId: string, cardId: string, grade?: number) => {
  return await sequelize.transaction(async transaction => {
    const now = new Date()
    const [progress] = await UserCardProgress.findOrCreate({
      where: { cardId, userId },
      transaction,
    })

    if (!grade) {
      return progress
    }

    let { repetitionCount, easinessFactor, intervalDays } = progress

    if (grade >= 3) {
      if (repetitionCount === 0) {
        intervalDays = 1
      } else if (repetitionCount === 1) {
        intervalDays = 6
      } else {
        intervalDays = Math.round(intervalDays * easinessFactor)
      }

      repetitionCount += 1
    } else {
      repetitionCount = 0
      intervalDays = 1
    }

    easinessFactor = Math.max(
      1.3,
      easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    )
    const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000)

    progress.repetitionCount = repetitionCount
    progress.easinessFactor = easinessFactor
    progress.intervalDays = intervalDays
    progress.lastReviewedAt = now
    progress.nextReviewAt = nextReviewAt

    await progress.save({ transaction })

    return progress
  })
}
