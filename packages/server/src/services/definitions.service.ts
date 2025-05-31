import { Definition, Word } from '../models'
import { Op } from 'sequelize'

export const getDefinitionsByWord = async (word: string) => {
  const foundWords = await Word.findAll({
    where: {
      text: { [Op.substring]: word },
    },
    attributes: ['id'],
  })
  if (foundWords.length === 0) {
    return []
  }

  const wordIdTexts = foundWords.map(w => w.id)
  return await Definition.findAll({
    where: { wordId: wordIdTexts },
  })
}
