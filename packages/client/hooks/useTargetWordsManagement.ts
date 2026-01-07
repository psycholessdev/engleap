import { useState, useEffect, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { UseFormReturn } from 'react-hook-form'
import { generateTargetWords, deepCompare } from '@/utils'
import { createCardFormSchema } from '@/schema'
import { z } from 'zod'

interface UseTargetWordsManagementProps {
  form: UseFormReturn<z.infer<typeof createCardFormSchema>>
  initialTargetWords?: string[]
}

export const useTargetWordsManagement = ({
  form,
  initialTargetWords = [],
}: UseTargetWordsManagementProps) => {
  const [targetWordsToSelect, setTargetWordsToSelect] = useState<string[]>([])
  const [selectedTargetWords, setSelectedTargetWords] = useState<string[]>(initialTargetWords)

  const updateTargetWords = useCallback(
    (newSentence: string) => {
      const newTargetWordsToSelect = generateTargetWords(newSentence.trim())
      setTargetWordsToSelect(newTargetWordsToSelect)

      // Filter out selected words that are no longer in the available words
      setSelectedTargetWords(currentSelected => {
        const correctedSelectedTargetWords = currentSelected.filter(word =>
          newTargetWordsToSelect.includes(word)
        )

        // Update form only if the selected words actually changed
        if (!deepCompare(form.getValues('targetWords'), correctedSelectedTargetWords)) {
          form.setValue('targetWords', correctedSelectedTargetWords)
        }

        return correctedSelectedTargetWords
      })
    },
    [form]
  )

  const debouncedUpdateTargetWords = useDebouncedCallback(updateTargetWords, 300)

  const handleTargetWordClick = useCallback(
    (word: string) => {
      setSelectedTargetWords(currentSelected => {
        let newSelected: string[]
        if (currentSelected.includes(word)) {
          newSelected = currentSelected.filter(w => w !== word)
        } else {
          newSelected = [...currentSelected, word]
        }
        form.setValue('targetWords', newSelected)
        return newSelected
      })
    },
    [form]
  )

  // Subscribe to form changes to update target words
  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
        touchedFields: true,
      },
      callback: ({ values }) => {
        debouncedUpdateTargetWords(values.sentence)
      },
    })

    return () => callback()
  }, [form, debouncedUpdateTargetWords])

  const initializeForEditing = useCallback(
    (sentence: string, targetWords: string[]) => {
      const wordsToSelect = generateTargetWords(sentence.trim())
      const selectableTargetWords = targetWords.filter(stw => wordsToSelect.includes(stw))
      const userSpecifiedTargetWords = targetWords.filter(stw => !wordsToSelect.includes(stw))

      setTargetWordsToSelect(wordsToSelect)
      setSelectedTargetWords(selectableTargetWords)
      form.setValue('targetWords', selectableTargetWords)
      form.setValue('userSpecifiedTargetWords', userSpecifiedTargetWords.join(', '))
    },
    [form]
  )

  const reset = useCallback(() => {
    setSelectedTargetWords([])
    setTargetWordsToSelect([])
  }, [])

  return {
    targetWordsToSelect,
    selectedTargetWords,
    handleTargetWordClick,
    initializeForEditing,
    reset,
  }
}
