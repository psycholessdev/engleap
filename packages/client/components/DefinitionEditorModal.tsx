'use client'
import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import FormInputError from '@/components/FormInputError'
import AddButtonGhost from '@/components/AddButtonGhost'
import { Loader2Icon } from 'lucide-react'

import { addCustomDefinitionSchema } from '@/schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCardController } from '@/hooks'
import FailureAlert from '@/components/FailureAlert'
import { useRouter } from 'next/navigation'

interface IDefinitionEditorModal {
  cardId: string
  sentence: string
  selectedTargetWords: string[]
  openBtnRef: React.Ref<HTMLButtonElement>
}

const DefinitionEditorModal: React.FC<IDefinitionEditorModal> = ({
  cardId,
  sentence,
  selectedTargetWords,
  openBtnRef,
}) => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { loading, failureMessage, addCustomDefinition } = useCardController()
  const form = useForm<z.infer<typeof addCustomDefinitionSchema>>({
    resolver: zodResolver(addCustomDefinitionSchema),
    defaultValues: {
      offensive: false,
    },
  })
  console.log(form.formState.errors)

  const onSubmit = async (data: z.infer<typeof addCustomDefinitionSchema>) => {
    // requesting after zod validation has passed

    const editedCard = await addCustomDefinition(cardId, sentence, selectedTargetWords, data)
    if (editedCard) {
      setModalOpen(false)
      router.refresh()
      location.reload()
    }
  }

  const handleSelectTargetWordChange = (value: string) => {
    // it's custom select that not handled by useForm by default
    // instead, I created hidden input passed to useForm
    // and its value changes when the custom select
    form.setValue('word', value)
  }

  const handleSelectPartOfSpeechChange = (value: string) => {
    form.setValue('partOfSpeech', value)
  }

  useEffect(() => {
    form.setValue('word', '')
    if (form.getValues().id) {
      form.setValue('id', '')
    }
  }, [selectedTargetWords, form])

  useEffect(() => {
    if (!modalOpen) {
      form.reset()
    }
  }, [modalOpen, form])

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
        touchedFields: true,
      },
      callback: ({ values }) => {
        if (values.word && !values.id) {
          form.setValue('id', values.word)
        }
      },
    })

    return () => callback()
  }, [form, form.subscribe])

  return (
    <Dialog open={modalOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" asChild onClick={() => setModalOpen(true)}>
          <AddButtonGhost text="Add custom definition" ref={openBtnRef} hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add custom definition</DialogTitle>
            <DialogDescription>
              Add your custom definitions so you can better remember them. Maybe you found a better
              explanation than in the dictionary, or just want to simplify the existing ones.
              Whatever the case, it a great way to strengthen you memory!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="word">Target Word this definition for</Label>

              {/* custom Select is not handled by useForm by default */}
              <Select id="word" disabled={loading} onValueChange={handleSelectTargetWordChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Target Word" />
                </SelectTrigger>
                <SelectContent className="z-[8620]">
                  {selectedTargetWords.map(stw => (
                    <SelectItem value={stw} key={stw}>
                      {stw}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormInputError error={form.formState.errors.word} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="id">The word this definition for</Label>
              <Input id="id" name="id" disabled={loading} {...form.register('id')} />
              <FormInputError error={form.formState.errors.id} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="partOfSpeech">Part of speech</Label>

              <Select disabled={loading} onValueChange={handleSelectPartOfSpeechChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Part of speech" />
                </SelectTrigger>
                <SelectContent className="z-[8620]">
                  <SelectItem value="noun">noun</SelectItem>
                  <SelectItem value="pronoun">pronoun</SelectItem>
                  <SelectItem value="verb">verb</SelectItem>
                  <SelectItem value="adjective">adjective</SelectItem>
                  <SelectItem value="adverb">adverb</SelectItem>
                  <SelectItem value="phrasal-verb">phrasal-verb</SelectItem>
                  <SelectItem value="idiom">idiom</SelectItem>
                  <SelectItem value="preposition">preposition</SelectItem>
                  <SelectItem value="conjunction">conjunction</SelectItem>
                  <SelectItem value="interjection">interjection</SelectItem>
                </SelectContent>
              </Select>
              <FormInputError error={form.formState.errors.partOfSpeech} />
            </div>

            <div className="flex items-center gap-1">
              <Checkbox
                id="offensive"
                name="offensive"
                disabled={loading}
                onCheckedChange={val => form.setValue('offensive', val)}
              />
              <Label htmlFor="offensive">Offensive</Label>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="text">Definition text</Label>
              <Textarea id="text" name="text" disabled={loading} {...form.register('text')} />
              <FormInputError error={form.formState.errors.text} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="syllabifiedWord">Syllabified word</Label>
              <Input
                id="syllabifiedWord"
                name="syllabifiedWord"
                placeholder="fas*ci*nat*ing"
                disabled={loading}
                {...form.register('syllabifiedWord')}
              />
              <FormInputError error={form.formState.errors.syllabifiedWord} />
            </div>
          </div>

          {/* General failure */}
          {failureMessage && <FailureAlert title="Failure" message={failureMessage} />}

          <DialogFooter>
            <DialogClose disabled={loading} asChild>
              <Button disabled={loading} variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </DialogClose>

            {loading ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" />
                Creating
              </Button>
            ) : (
              <Button type="submit">Create Definition</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default DefinitionEditorModal
