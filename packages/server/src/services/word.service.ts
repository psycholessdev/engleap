import { Word } from '../models'
import { Op } from 'sequelize'

export const getMatchedWords = async (word: string) => {
  return await Word.findAll({
    where: {
      text: { [Op.substring]: word },
    },
    limit: 40,
    attributes: ['id', 'text'],
  })
}
