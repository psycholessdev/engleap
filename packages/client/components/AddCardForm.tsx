'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { IconBulb } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import FormInputError from '@/components/FormInputError'

import { useDebouncedCallback } from 'use-debounce'
import { generateTargetWords, convertRawTargetWords, deepCompare } from '@/utils'
import { useForm } from 'react-hook-form'
import { createCardFormSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCardController } from '@/hooks'
import { type Card, type CreateCardRequest } from '@/api'
import { z } from 'zod'

interface IAddCardForm {
  deckId: string
  cardToEdit?: Card // if specified, editing mode is enabled
}

const AddCardForm: React.FC<IAddCardForm> = ({ deckId, cardToEdit }) => {
  const { loading, failureMessage, createCard } = useCardController()
  const [targetWordsToSelect, setTargetWordsToSelect] = useState<string[]>([])
  const [selectedTargetWords, setSelectedTargetWords] = useState<string[]>(
    convertRawTargetWords(cardToEdit?.targetWords || [])
  )
  const form = useForm({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      sentence: cardToEdit?.sentence || '',
      targetWords: convertRawTargetWords(cardToEdit?.targetWords || []),
    },
  })

  const onSubmit = async (data: z.infer<typeof createCardFormSchema>) => {
    // requesting after zod validation has passed
    const userSpecifiedTargetWords =
      data.userSpecifiedTargetWords && data.userSpecifiedTargetWords.length > 0
        ? data.userSpecifiedTargetWords.split(',')
        : []
    const reqData: CreateCardRequest = {
      ...data,
      targetWords: [...data.targetWords, ...userSpecifiedTargetWords],
    }
    delete reqData.userSpecifiedTargetWords

    if (cardToEdit) {
      // editing mode
    } else {
      // creating mode
      const result = await createCard(deckId, reqData)

      if (result) {
        setSelectedTargetWords([])
        setTargetWordsToSelect([])
        form.reset()
      }
    }
  }

  const updateTargetWords = useDebouncedCallback((newSentence: string) => {
    setTargetWordsToSelect(generateTargetWords(newSentence.trim()))

    // if the selected word was deleted, the selected word should be cleared as well
    let correctedSelectedTargetWords = selectedTargetWords
    for (const stw of selectedTargetWords) {
      if (!targetWordsToSelect.includes(stw)) {
        correctedSelectedTargetWords = correctedSelectedTargetWords.filter(w => w !== stw)
      }
    }
    setSelectedTargetWords(correctedSelectedTargetWords)
    if (deepCompare(form.formState.targetWords, correctedSelectedTargetWords)) {
      form.setValue('targetWords', correctedSelectedTargetWords)
    }
  }, 300)

  const handleTargetWordClick = (word: string) => {
    if (!selectedTargetWords.includes(word)) {
      const stw = [...selectedTargetWords, word]
      setSelectedTargetWords(stw)
      form.setValue('targetWords', stw)
    } else {
      setSelectedTargetWords(stw => {
        const mstw = stw.filter(stw => stw !== word)
        form.setValue('targetWords', mstw)
        return mstw
      })
    }
  }

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
        touchedFields: true,
      },
      callback: ({ values }) => {
        updateTargetWords(values.sentence)
      },
    })

    return () => callback()
  }, [form.subscribe])

  useEffect(() => {
    if (cardToEdit) {
      const targetWordsToSelect = generateTargetWords(cardToEdit.sentence.trim())
      const selectedTargetWords = convertRawTargetWords(cardToEdit.targetWords || [])

      const selectableTargetWords = selectedTargetWords.filter(stw =>
        targetWordsToSelect.includes(stw)
      )
      const userSpecifiedTargetWords = selectedTargetWords.filter(
        stw => !targetWordsToSelect.includes(stw)
      )

      form.setValue('sentence', cardToEdit.sentence.trim())
      setTargetWordsToSelect(targetWordsToSelect)
      setSelectedTargetWords(selectableTargetWords)
      form.setValue('targetWords', selectableTargetWords)
      form.setValue('userSpecifiedTargetWords', userSpecifiedTargetWords.join(', '))
    }
  }, [cardToEdit])

  return (
    <div>
      <h1 className="font-ubuntu text-3xl text-white py-8">
        {cardToEdit ? '🚀 Edit card' : '🚀 Add a new card'}
      </h1>
      <form
        className="flex flex-col gap-6 items-start w-full"
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <FormInputError error={failureMessage} />

          <h2 className="font-ubuntu text-lg text-white">Sentence with the target word(s)</h2>
          <Textarea
            name="sentence"
            placeholder="I was fascinated how quickly she solved the issue"
            className="w-full"
            disabled={loading}
            {...form.register('sentence')}
          />
          <FormInputError error={form.formState.errors.sentence} />
          {!form.getValues().sentence && (
            <Alert>
              <IconBulb />
              <AlertTitle>
                Try to find elaborate sentences. That way your brain will automatically memorize not
                only the meaning, but the use cases as well.
              </AlertTitle>
            </Alert>
          )}
        </div>

        {form.getValues().sentence && (
          <div className="grid gap-2">
            <h2 className="font-ubuntu text-lg text-white">🧩 Select the target word (or a few)</h2>
            <div className="flex flex-wrap gap-1">
              {targetWordsToSelect.map((w, i) => (
                <Toggle
                  pressed={selectedTargetWords.includes(w)}
                  onPressedChange={() => handleTargetWordClick(w)}
                  variant="outline"
                  className="cursor-pointer"
                  key={i}
                  disabled={loading}>
                  {w}
                </Toggle>
              ))}
            </div>
            <h2 className="font-ubuntu text-lg text-white">
              Or type it manually if we failed to infer it properly
            </h2>
            <Input
              type="text"
              name="userSpecifiedTargetWords"
              placeholder="fascinated, quickly"
              className="w-full"
              disabled={loading}
              {...form.register('userSpecifiedTargetWords')}
            />
            <p className="text-muted-foreground text-sm">Comma separated</p>
            <FormInputError error={form.formState.errors.userSpecifiedTargetWords} />
          </div>
        )}

        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-ubuntu text-lg text-white">📓 Definitions block</h2>
            <Badge>{selectedTargetWords.length} words selected</Badge>
          </div>
          {form.getValues().sentence && selectedTargetWords.length === 0 && (
            <Alert variant="destructive">
              <IconBulb />
              <AlertTitle>Choose the target word (or a few) to generate the definitions</AlertTitle>
            </Alert>
          )}
        </div>

        <Button type="submit">{cardToEdit ? 'Save changes' : 'Generate Definitions'}</Button>
      </form>
    </div>
  )
}
export default AddCardForm
