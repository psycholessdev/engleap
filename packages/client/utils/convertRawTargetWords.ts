import { TargetWord } from '@/api'

export const convertRawTargetWords = (rawTargetWords: TargetWord[]): string[] => {
  return rawTargetWords.map(rtw => rtw.word.text)
}
