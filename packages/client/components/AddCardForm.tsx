'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { IconBulb } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import DefinitionEditorModal from '@/components/DefinitionEditorModal'
import FormInputError from '@/components/FormInputError'
import DefinitionList from '@/components/DefinitionList'
import AddButtonGhost from '@/components/AddButtonGhost'

import { useDebouncedCallback } from 'use-debounce'
import { generateTargetWords, normalizeCard, deepCompare } from '@/utils'
import { useForm } from 'react-hook-form'
import { createCardFormSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCardController, useAlert } from '@/hooks'
import { type Card, type CreateCardRequest, type EditCardRequest } from '@/api'
import { z } from 'zod'

const TargetWordsPicker: React.FC<{
  disabled: boolean
  targetWordsToSelect: string[]
  selectedTargetWords: string[]
  onTargetWordClick: (word: string) => void
}> = ({ targetWordsToSelect, selectedTargetWords, onTargetWordClick, disabled }) => {
  return (
    <>
      {targetWordsToSelect.map((w, i) => (
        <Toggle
          pressed={selectedTargetWords.includes(w)}
          onPressedChange={() => onTargetWordClick(w)}
          variant="outline"
          className="cursor-pointer"
          key={i}
          disabled={disabled}>
          {w}
        </Toggle>
      ))}
    </>
  )
}

interface IAddCardForm {
  deckId: string
  cardToEdit?: Card // if specified, editing mode is enabled
}

const AddCardForm: React.FC<IAddCardForm> = ({ deckId, cardToEdit }) => {
  const alert = useAlert()
  const normalizedCardToEdit = cardToEdit ? normalizeCard(cardToEdit) : null
  const modalOpenBtnRef = useRef<HTMLButtonElement>(null)
  const { isLoading, failureMessage, createCard, editCard, deleteCustomDefinition } =
    useCardController()
  const [targetWordsToSelect, setTargetWordsToSelect] = useState<string[]>([])
  const [selectedTargetWords, setSelectedTargetWords] = useState<string[]>(
    normalizedCardToEdit?.targetWords || []
  )
  const form = useForm({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      sentence: cardToEdit?.sentence || '',
      targetWords: normalizedCardToEdit?.targetWords || [],
    },
  })

  const onSubmit = async (data: z.infer<typeof createCardFormSchema>) => {
    // requesting after zod validation has passed
    const userSpecifiedTargetWords =
      data.userSpecifiedTargetWords && data.userSpecifiedTargetWords.length > 0
        ? data.userSpecifiedTargetWords.split(',')
        : []

    if (cardToEdit) {
      // editing mode
      const targetWords =
        data.targetWords.length > 0 || userSpecifiedTargetWords.length > 0
          ? [...data.targetWords, ...userSpecifiedTargetWords]
          : undefined
      const requestData: EditCardRequest = {
        ...data,
        targetWords,
      }
      delete requestData.userSpecifiedTargetWords

      const editingDetails = await editCard(cardToEdit.id, requestData)

      if (editingDetails && editingDetails.notFoundWords.length > 0) {
        alert(
          'Could not find Definitions',
          `Your changes were saved. However, we could not find definitions for ${editingDetails.notFoundWords.join(
            ', '
          )}. Consider adding your own definitions.`
        )
      }
    } else {
      // creating mode
      const requestData: CreateCardRequest = {
        ...data,
        targetWords: [...data.targetWords, ...userSpecifiedTargetWords],
      }
      delete requestData.userSpecifiedTargetWords

      const result = await createCard(deckId, requestData)

      if (result) {
        setSelectedTargetWords([])
        setTargetWordsToSelect([])
        form.reset()

        if (result.notFoundWords.length > 0) {
          alert(
            'Could not find Definitions',
            `Your changes were saved. However, we could not find definitions for ${result.notFoundWords.join(
              ', '
            )}. Consider adding your own definitions.`
          )
        }
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
  }, [form, form.subscribe, updateTargetWords])

  useEffect(() => {
    if (cardToEdit) {
      const normalizedCardToEdit = normalizeCard(cardToEdit)
      const targetWordsToSelect = generateTargetWords(normalizedCardToEdit.sentence.trim())
      const selectedTargetWords = normalizedCardToEdit.targetWords

      const selectableTargetWords = selectedTargetWords.filter(stw =>
        targetWordsToSelect.includes(stw)
      )
      const userSpecifiedTargetWords = selectedTargetWords.filter(
        stw => !targetWordsToSelect.includes(stw)
      )

      form.setValue('sentence', normalizedCardToEdit.sentence.trim())
      setTargetWordsToSelect(targetWordsToSelect)
      setSelectedTargetWords(selectableTargetWords)
      form.setValue('targetWords', selectableTargetWords)
      form.setValue('userSpecifiedTargetWords', userSpecifiedTargetWords.join(', '))
    }
  }, [form, cardToEdit])

  const allTargetWords: string[] = [
    ...selectedTargetWords,
    ...(form.getValues().userSpecifiedTargetWords
      ? form.getValues().userSpecifiedTargetWords.split(',')
      : []),
  ]

  return (
    <div className="pb-20">
      <h1 className="font-ubuntu text-3xl text-white py-8">
        {cardToEdit ? '🚀 Edit card' : '🚀 Add a new card'}
      </h1>
      <form
        className="flex flex-col gap-6 items-start w-full"
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <FormInputError error={failureMessage} />

          <h2 className="font-ubuntu text-lg text-white">Sentence containing the target word(s)</h2>
          <Textarea
            name="sentence"
            placeholder="I was fascinated how quickly she solved the issue"
            className="w-full"
            disabled={isLoading}
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
            <h2 className="font-ubuntu text-lg text-white">🧩 Select the target word(s)</h2>
            <div className="flex flex-wrap gap-1">
              <TargetWordsPicker
                disabled={isLoading}
                selectedTargetWords={selectedTargetWords}
                targetWordsToSelect={targetWordsToSelect}
                onTargetWordClick={handleTargetWordClick}
              />
            </div>
            <h2 className="font-ubuntu text-lg text-white">
              Or type them manually if we didn’t detect them correctly
            </h2>
            <Input
              type="text"
              name="userSpecifiedTargetWords"
              placeholder="fascinated, quickly"
              className="w-full"
              disabled={isLoading}
              {...form.register('userSpecifiedTargetWords')}
            />
            <p className="text-muted-foreground text-sm">
              Separate multiple words with commas. This field is very useful for Phrasal verbs or
              Idioms, like &apos;Spill the beans&apos;, &apos;Look after&apos; or &apos;Plot
              armor&apos;.
            </p>
            <FormInputError error={form.formState.errors.userSpecifiedTargetWords} />
          </div>
        )}

        <div className="flex flex-col items-start gap-2 w-full">
          <div className="mb-4 flex flex-col items-start gap-2">
            <Button disabled={isLoading || allTargetWords.length === 0} type="submit">
              {cardToEdit ? '💾 Save changes' : '💡 Generate Definitions'}
            </Button>
            {!cardToEdit && (
              <p className="text-muted-foreground text-sm">
                You can create your own definitions if you want. Just click &apos;Generate
                Definitions&apos; and you will be able to add your own in the Edit mode!
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <h2 className="font-ubuntu text-lg text-white">📓 Definitions block</h2>
            <Badge>{allTargetWords.length} words selected</Badge>
          </div>
          {form.getValues().sentence && allTargetWords.length === 0 && (
            <Alert variant="destructive">
              <IconBulb />
              <AlertTitle>
                Choose the target word (or a few) to generate the definitions or create you own
              </AlertTitle>
            </Alert>
          )}

          {cardToEdit && (
            <AddButtonGhost
              text="Add custom definition"
              disabled={allTargetWords.length === 0}
              onClick={() => modalOpenBtnRef?.current?.click()}
            />
          )}
          {cardToEdit && (
            <DefinitionList
              cardId={cardToEdit.id}
              disabled={isLoading}
              showButtons
              onDelete={deleteCustomDefinition}
            />
          )}
        </div>
      </form>

      {cardToEdit && (
        <DefinitionEditorModal
          openBtnRef={modalOpenBtnRef}
          cardId={cardToEdit.id}
          sentence={cardToEdit.sentence}
          selectedTargetWords={allTargetWords}
        />
      )}
    </div>
  )
}
export default AddCardForm
