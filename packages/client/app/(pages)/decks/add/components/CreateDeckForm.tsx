'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FailureAlert from '@/components/FailureAlert'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateDeck } from '@/hooks'

const FormSchema = z.object({
  title: z
    .string({ message: 'title is required' })
    .min(2, { message: 'title should be at least 2 characters' })
    .max(160, { message: 'title should be at much 160 characters' }),

  description: z
    .string()
    .max(4000, { message: 'description should be at much 4000 characters' })
    .optional(),

  isPublic: z.boolean().default(true),
})

const CreateDeckForm = () => {
  const { failureMessage, loading, createDeck } = useCreateDeck()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // requesting after zod validation has passed
    const success = await createDeck(data)
    if (success) form.reset()
  }

  const handleSwitchChange = (value: boolean) => {
    form.setValue('isPublic', value)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Your Deck</FormLabel>
                <FormControl>
                  <Input placeholder="B2 Law Terms" disabled={loading} {...field} />
                </FormControl>
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
                  <Input
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
                <FormLabel>isPublic</FormLabel>
                <FormControl>
                  <Input type="checkbox" {...field} hidden />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublicSwitch"
                disabled={loading}
                defaultChecked={true}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublicSwitch-mode">Public Deck</Label>
            </div>
            <FormDescription>
              Public Decks are searchable via public search. Anyone will be able to find and study
              it. You will be able to copy the share link to this Deck after creation is finished.
            </FormDescription>
          </div>

          {/* General failure */}
          {failureMessage && <FailureAlert title="Failure" message={failureMessage} />}

          {loading ? (
            <Button disabled>
              <Loader2Icon className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Create Deck</Button>
          )}
        </form>
      </Form>
    </>
  )
}
export default CreateDeckForm
