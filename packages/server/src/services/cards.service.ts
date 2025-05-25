import { Card } from '../models'

export const getCardsByDeckId = async (deckId: string, offset = 0, limit = 10) => {
  // offset tells the database to skip the first N records
  return await Card.findAll({
    where: { deckId },
    offset,
    limit,
  })
}
