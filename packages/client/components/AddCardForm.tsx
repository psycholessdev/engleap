'use client'
import React, { useEffect, useRef } from 'react'
import { Alert, AlertTitle, Badge, Button } from '@/components/ui'
import { DefinitionEditorModal } from './DefinitionEditorModal'
import { DefinitionList } from './DefinitionList'
import { AddButtonGhost } from './common/AddButtonGhost'
import { CardFormFields } from './CardFormFields'
import { TargetWordsSection } from './TargetWordsSection'
import { IconBulb } from '@tabler/icons-react'

import { useTargetWordsManagement } from '@/hooks'
import { normalizeCard } from '@/utils'
import { useForm } from 'react-hook-form'
import { createCardFormSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCardController, useAlert } from '@/hooks'
import type { Card, CreateCardRequest, EditCardRequest } from '@/types'
import { z } from 'zod'

import { AUTO_DEFS_NOT_FOUND, AUTO_DEFS_NOT_FOUND_SUGGESTION } from '@/consts'

interface AddCardFormProps {
  deckId: string
  cardToEdit?: Card // if specified, editing mode is enabled
}

const AddCardForm: React.FC<AddCardFormProps> = ({ deckId, cardToEdit }) => {
  const alert = useAlert()
  const normalizedCardToEdit = cardToEdit ? normalizeCard(cardToEdit) : null
  const modalOpenBtnRef = useRef<HTMLButtonElement>(null)
  const { isLoading, failureMessage, createCard, editCard, deleteCustomDefinition } =
    useCardController()
  const form = useForm({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      sentence: cardToEdit?.sentence || '',
      targetWords: normalizedCardToEdit?.targetWords || [],
    },
  })

  const {
    targetWordsToSelect,
    selectedTargetWords,
    handleTargetWordClick,
    initializeForEditing,
    reset: resetTargetWords,
  } = useTargetWordsManagement({
    form,
    initialTargetWords: normalizedCardToEdit?.targetWords || [],
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
        const failedDefList = editingDetails.notFoundWords.join(', ')
        alert(AUTO_DEFS_NOT_FOUND, AUTO_DEFS_NOT_FOUND_SUGGESTION.replace('{0}', failedDefList))
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
        resetTargetWords()
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

  useEffect(() => {
    if (cardToEdit) {
      const normalizedCardToEdit = normalizeCard(cardToEdit)
      initializeForEditing(normalizedCardToEdit.sentence, normalizedCardToEdit.targetWords)
      form.setValue('sentence', normalizedCardToEdit.sentence.trim())
    }
  }, [form, cardToEdit, initializeForEditing])

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
        <CardFormFields form={form} isLoading={isLoading} failureMessage={failureMessage} />

        {form.getValues().sentence && (
          <TargetWordsSection
            form={form}
            isLoading={isLoading}
            targetWordsToSelect={targetWordsToSelect}
            selectedTargetWords={selectedTargetWords}
            onTargetWordClick={handleTargetWordClick}
          />
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
export { AddCardForm }
