import { CardTargetWord, Definition, Word } from '../models'
import { Op } from 'sequelize'

export const getDefinitionsByWord = async (word: string) => {
  const foundWords = await Word.findAll({
    where: {
      text: { [Op.substring]: word },
    },
    limit: 20,
    attributes: ['id'],
  })
  if (foundWords.length === 0) {
    return []
  }

  const wordIdTexts = foundWords.map(w => w.id)
  return await Definition.findAll({
    where: { wordId: wordIdTexts },
    limit: 20,
    attributes: [
      'id',
      'wordId',
      'audio',
      'text',
      'partOfSpeech',
      'labels',
      'syllabifiedWord',
      'offensive',
      'source',
      'sourceName',
    ],
  })
}

export const getDefinitionsForCard = async (cardId: string) => {
  const ctws = await CardTargetWord.findAll({
    where: { cardId },
    attributes: ['wordId'],
  })
  const wordIds = ctws.map(ctw => ctw.wordId)

  return await Definition.findAll({
    where: { wordId: wordIds },
    limit: 20,
    attributes: [
      'id',
      'wordId',
      'audio',
      'text',
      'partOfSpeech',
      'labels',
      'syllabifiedWord',
      'offensive',
      'source',
      'sourceName',
    ],
  })
}
