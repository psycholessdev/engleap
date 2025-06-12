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
import { useDeckController } from '@/hooks'
import { createDeckFormSchema } from '@/schema'

const CreateDeckForm = () => {
  const { failureMessage, isLoading, createDeck } = useDeckController()
  const form = useForm<z.infer<typeof createDeckFormSchema>>({
    resolver: zodResolver(createDeckFormSchema),
  })

  const onSubmit = async (data: z.infer<typeof createDeckFormSchema>) => {
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
                  <Input placeholder="B2 Law Terms" disabled={isLoading} {...field} />
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
                disabled={isLoading}
                defaultChecked={true}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublicSwitch">Make Public</Label>
            </div>
            <FormDescription>
              Public decks can be found via search and shared with others. You’ll get a shareable
              link after creation.
            </FormDescription>
          </div>

          {/* General failure */}
          {failureMessage && <FailureAlert title="Failure" message={failureMessage} />}

          {isLoading ? (
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
