'use client'
import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Label,
  Button,
  Switch,
} from '@/components/ui'
import { FormSubmitButton, EmojiPicker, FormInputErrorMessage } from '@/components/common'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDeckController } from '@/hooks'
import { useRouter } from 'next/navigation'
import { editDeckFormSchema } from '@/schema'
import type { EditDeckFormData } from '@/types'

const DeckEditorFormFields: React.FC<{
  form: UseFormReturn<EditDeckFormData>
  loading: boolean
}> = ({ form, loading }) => {
  return (
    <div className="grid gap-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="emoji"
        render={({ field }) => (
          <FormItem className="flex flex-col items-start">
            <FormLabel>Deck Icon</FormLabel>
            <EmojiPicker
              pickedEmoji={field.value}
              onPick={field.onChange}
              disabled={field.disabled}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Most used terms regarding casual US Law"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublicSwitch"
                disabled={field.disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isPublicSwitch">Public Deck</Label>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

interface IDeckEditorModal {
  deckId: string
  defaultTitle: string
  defaultEmoji: string
  defaultDescription: string
  defaultIsPublic: boolean
  opened: boolean
  onCloseSignal: () => void
}

const DeckEditorModal: React.FC<IDeckEditorModal> = ({
  deckId,
  defaultTitle,
  defaultEmoji,
  defaultDescription,
  defaultIsPublic,
  opened,
  onCloseSignal,
}) => {
  const router = useRouter()
  const { failureMessage, isLoading, editDeck } = useDeckController()
  const form = useForm<EditDeckFormData>({
    resolver: zodResolver(editDeckFormSchema),
    defaultValues: {
      title: defaultTitle,
      emoji: defaultEmoji,
      description: defaultDescription,
      isPublic: defaultIsPublic,
    },
  })

  const onSubmit = async (data: EditDeckFormData) => {
    // requesting after zod validation has passed
    const editedDeck = await editDeck(deckId, data)
    if (editedDeck) {
      form.setValue('title', editedDeck.title)
      form.setValue('emoji', editedDeck.emoji)
      form.setValue('description', editedDeck.description)
      form.setValue('isPublic', editedDeck.isPublic)

      onCloseSignal()
      router.refresh()
    }
  }

  return (
    <Dialog open={opened}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Deck</DialogTitle>
              <DialogDescription>
                Make changes to your Deck here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <DeckEditorFormFields form={form} loading={isLoading} />

            {/* General failure */}
            {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

            <DialogFooter>
              <DialogClose disabled={isLoading} asChild>
                <Button disabled={isLoading} variant="outline" onClick={onCloseSignal}>
                  Cancel
                </Button>
              </DialogClose>

              <FormSubmitButton text="Save changes" loadingText="Saving" loading={isLoading} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default DeckEditorModal
