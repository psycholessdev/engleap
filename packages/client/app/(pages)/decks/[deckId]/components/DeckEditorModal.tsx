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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import FormInputError from '@/components/FormInputError'

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
  defaultDescription: string
  defaultIsPublic: boolean
  opened: boolean
  onCloseSignal: () => void
}

const DeckEditorModal: React.FC<IDeckEditorModal> = ({
  deckId,
  defaultTitle,
  defaultDescription,
  defaultIsPublic,
  opened,
  onCloseSignal,
}) => {
  const router = useRouter()
  const { failureMessage, isLoading, editDeck } = useDeckController()
  const form = useForm<z.infer<typeof editDeckSchema>>({
    resolver: zodResolver(editDeckSchema),
  })

  const onSubmit = async (data: z.infer<typeof editDeckSchema>) => {
    // requesting after zod validation has passed
    const editedDeck = await editDeck(deckId, data)
    if (editedDeck) {
      form.setValue('title', editedDeck.title)
      form.setValue('description', editedDeck.description)
      form.setValue('isPublic', editedDeck.isPublic)

      onCloseSignal()
      router.refresh()
    }
  }

  const handleSwitchChange = (value: boolean) => {
    form.setValue('isPublic', value)
  }

  return (
    <Dialog open={opened}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Make changes to your Deck here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={defaultTitle}
                {...form.register('title')}
              />
              <FormInputError error={form.formState.errors.title} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                defaultValue={defaultDescription}
                {...form.register('description')}
              />
              <FormInputError error={form.formState.errors.description} />

              <Input
                type="checkbox"
                hidden
                defaultChecked={defaultIsPublic}
                {...form.register('isPublic')}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublicSwitch"
                  disabled={isLoading}
                  defaultChecked={defaultIsPublic}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isPublicSwitch">Public Deck</Label>
              </div>
            </div>
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
      </DialogContent>
    </Dialog>
  )
}
export default DeckEditorModal
