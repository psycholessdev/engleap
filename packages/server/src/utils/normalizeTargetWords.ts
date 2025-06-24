interface TargetWord {
  id: string
  word: {
    id: string
    text: string
  }
}

export const normalizeTargetWords = (rawTargetWords: TargetWord[]) => {
  return rawTargetWords.map(rtw => rtw.word.text)
}
