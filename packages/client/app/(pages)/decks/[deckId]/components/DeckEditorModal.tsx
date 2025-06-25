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
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import EmojiPicker from '@/components/EmojiPicker'

import { editDeckSchema } from '@/schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDeckController } from '@/hooks'
import FailureAlert from '@/components/FailureAlert'
import { Loader2Icon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'

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
  const form = useForm<z.infer<typeof editDeckSchema>>({
    resolver: zodResolver(editDeckSchema),
    defaultValues: {
      title: defaultTitle,
      emoji: defaultEmoji,
      description: defaultDescription,
      isPublic: defaultIsPublic,
    },
  })

  const onSubmit = async (data: z.infer<typeof editDeckSchema>) => {
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

  const handleSwitchChange = (value: boolean) => {
    form.setValue('isPublic', value)
  }
  const handleEmojiChange = (emoji: string) => {
    form.setValue('emoji', emoji)
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
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
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
                      onPick={handleEmojiChange}
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
                name="checkbox"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="checkbox" hidden {...field} />
                    </FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublicSwitch"
                        disabled={field.disabled}
                        checked={field.value}
                        defaultChecked={defaultIsPublic}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="isPublicSwitch">Public Deck</Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* General failure */}
            {failureMessage && <FailureAlert title="Failure" message={failureMessage} />}

            <DialogFooter>
              <DialogClose disabled={isLoading} asChild>
                <Button disabled={isLoading} variant="outline" onClick={onCloseSignal}>
                  Cancel
                </Button>
              </DialogClose>

              {isLoading ? (
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button type="submit">Save changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default DeckEditorModal
