import { ExtractedDefinition } from '../../types'
import { Transaction } from 'sequelize'
import { Definition, Word } from '../../models'

export const upsertWordsAndDefinitions = async (
  targetWords: string[],
  definitions: ExtractedDefinition[],
  source: 'dictionary' | 'user',
  sourceName: 'Merriam Webster Intermediate dictionary' | undefined,
  createdByUserId: string,
  transaction: Transaction
) => {
  const defsOrWordsNotProvided =
    !targetWords || targetWords.length === 0 || !definitions || definitions.length === 0
  if (defsOrWordsNotProvided) {
    return {
      existingWords: [],
      insertedWords: [],
      allWords: [],
      insertedDefinitions: [],
    }
  }

  // finds existing Word rows
  const existingWords = await Word.findAll({
    where: {
      text: targetWords,
    },
    transaction,
  })
  const existingTexts = existingWords.map(word => word.text)

  // Determines which words to insert
  const textsToInsert = targetWords.filter(word => !existingTexts.includes(word))
  const insertedWords =
    textsToInsert.length > 0
      ? await Word.bulkCreate(
          textsToInsert.map(word => ({ text: word })),
          {
            transaction,
          }
        )
      : []

  // create easy-to-access text=>Word mapping
  const allWords = [...existingWords, ...insertedWords]
  const allWordsByText: Record<string, Word> = {}
  for (const w of allWords) {
    allWordsByText[w.text] = w
  }

  // Builds payload for Definition rows
  const definitionsToInsert: Record<string, unknown>[] = []

  for (const def of definitions) {
    const wordText = def.word
    const wordObj = allWordsByText[wordText]
    if (!wordObj) {
      throw new Error('Failed to get the word associated with a definition')
    }

    // check if this definition is already defined
    const fetchedDefinition = await Definition.findOne({
      where: {
        wordId: wordObj.id,
        text: def.text,
        partOfSpeech: def.partOfSpeech,
        createdByUserId,
      },
      attributes: ['id'],
      transaction,
    })
    if (fetchedDefinition) {
      continue
    }

    definitionsToInsert.push({
      wordId: wordObj.id,
      audio: def.pronunciationAudioUrl,
      text: def.text,
      partOfSpeech: def.partOfSpeech,
      labels: def.labels,
      preciseWord: def.id,
      syllabifiedWord: def.syllabifiedWord,
      offensive: def.offensive,
      source,
      sourceName,
      difficulty: 'B2',
      createdByUserId,
    })
  }

  const insertedDefinitions =
    definitionsToInsert.length > 0
      ? await Definition.bulkCreate(definitionsToInsert, { transaction })
      : []

  return {
    existingWords,
    insertedWords,
    allWords,
    insertedDefinitions,
  }
}
