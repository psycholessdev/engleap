import { CardTargetWord, Definition, Word, CardDefinition } from '../models'
import { Op, Transaction } from 'sequelize'

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

// safe means from dictionary and userApproved
type Source = 'safe' | 'user' | 'userUnreviewed' | 'userApproved' | 'dictionary'

export const getDefinitionsForCard = async (
  cardId: string,
  source: Source = 'safe',
  offset = 0,
  limit = 15,
  transaction?: Transaction
) => {
  const ctws = await CardTargetWord.findAll({
    where: { cardId },
    attributes: ['id', 'wordId'],
    transaction,
  })
  const ctwIds = ctws.map(ctw => ctw.id)
  const wordIds = ctws.map(ctw => ctw.wordId)

  // CardDefinition record explicitly connects definition to a card
  const cds = await CardDefinition.findAll({
    where: { cardTargetWordId: ctwIds },
    attributes: ['definitionId'],
    transaction,
  })
  const cdDefIds = cds.map(cdw => cdw.definitionId)

  const filters =
    source === 'safe'
      ? // 'safe' means Definition should be from dictionary,
        // or explicitly connected to the card
        // or approved by admin
        [{ source: 'dictionary' }, { id: cdDefIds }, { approved: true }]
      : source === 'user'
      ? [{ source: 'user' }]
      : source === 'userApproved'
      ? [{ source: 'user', approved: true }]
      : source === 'userUnreviewed'
      ? [{ source: 'user', approved: false }]
      : source === 'dictionary'
      ? [{ source: 'dictionary' }]
      : undefined

  return await Definition.findAll({
    where: {
      [Op.and]: [{ wordId: wordIds }, { [Op.or]: filters }],
    },
    limit,
    offset,
    include: [Word],
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
    transaction,
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
