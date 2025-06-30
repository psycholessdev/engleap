'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FormInputErrorMessage from '@/components/common/FormInputErrorMessage'
import FormSubmitButton from '@/components/common/FormSubmitButton'
import EmojiPicker from '@/components/common/EmojiPicker'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDeckController } from '@/hooks'
import { createDeckFormSchema } from '@/schema'
import type { CreateDeckFormData } from '@/types'

const DeckFormFields: React.FC<{
  form: UseFormReturn<CreateDeckFormData>
  isLoading: boolean
}> = ({ form, isLoading }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name Your Deck</FormLabel>
            <FormControl>
              <Input placeholder="B2 Law Terms" disabled={isLoading} {...field} />
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
                disabled={isLoading}
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
            <div className="form-field flex-col">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublicSwitch"
                  disabled={field.disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isPublicSwitch">Make Public</Label>
              </div>
              <FormDescription>
                Public decks can be found via search and shared with others. You’ll get a shareable
                link after creation.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

const CreateDeckForm = () => {
  const { failureMessage, isLoading, createDeck } = useDeckController()
  const form = useForm<CreateDeckFormData>({
    resolver: zodResolver(createDeckFormSchema),
    defaultValues: {
      emoji: '📗',
      isPublic: true,
    },
  })

  const onSubmit = async (data: CreateDeckFormData) => {
    // requesting after zod validation has passed
    const success = await createDeck(data)
    if (success) form.reset()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="lg:w-2/3 w-full space-y-6">
          <DeckFormFields form={form} isLoading={isLoading} />

          {/* General failure UI */}
          {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

          <FormSubmitButton text="Create Deck" loading={isLoading} />
        </form>
      </Form>
    </>
  )
}
export default CreateDeckForm
