import { CardTargetWord, Definition, Word, CardDefinition } from '../models'
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
      'sourceEntryId',
      'audio',
      'text',
      'partOfSpeech',
      'labels',
      'syllabifiedWord',
      'offensive',
      'source',
      'sourceName',
      'createdByUserId',
    ],
  })
}

export const getDefinitionsForCard = async (cardId: string, offset = 0, limit = 15) => {
  const ctws = await CardTargetWord.findAll({
    where: { cardId },
    attributes: ['id', 'wordId'],
  })
  const ctwIds = ctws.map(ctw => ctw.id)
  const wordIds = ctws.map(ctw => ctw.wordId)

  // CardDefinition record explicitly connects definition to a card
  const cds = await CardDefinition.findAll({
    where: { cardTargetWordId: ctwIds },
    attributes: ['definitionId'],
  })
  const cdDefIds = cds.map(cdw => cdw.definitionId)

  return await Definition.findAll({
    where: {
      // Definition should be from dictionary,
      // or explicitly connected to the card
      // or approved by admin
      [Op.or]: [
        { [Op.and]: [{ wordId: wordIds }, { source: 'dictionary' }] },
        { [Op.and]: [{ wordId: wordIds }, { id: cdDefIds }] },
        { [Op.and]: [{ wordId: wordIds }, { approved: true }] },
      ],
    },
    limit,
    offset,
    attributes: [
      'id',
      'wordId',
      'sourceEntryId',
      'audio',
      'text',
      'partOfSpeech',
      'labels',
      'syllabifiedWord',
      'offensive',
      'source',
      'sourceName',
      'createdByUserId',
    ],
  })
}

export const getDefinitionById = async (id: string, attributes = ['id']) => {
  return await Definition.findByPk(id, { attributes })
}

export const unlinkDefinitionFromCard = async (definitionId: string) => {
  return await CardDefinition.destroy({
    where: { definitionId },
  })
}
