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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import FormInputErrorMessage from '@/components/common/FormInputErrorMessage'
import AddButtonGhost from '@/components/common/AddButtonGhost'
import { Loader2Icon } from 'lucide-react'
import { AlertCircleIcon } from 'lucide-react'

import { addCustomDefinitionSchema } from '@/schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCardController } from '@/hooks'
import { useRouter } from 'next/navigation'
import { syllabify } from '@/utils'

import { partOfSpeechDefs, type PartOfSpeechDef } from '@/consts'

const PartOfSpeechSuggestionCard: React.FC<{ value: PartOfSpeechDef }> = ({ value }) => {
  return (
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>{value.name}</AlertTitle>
      <AlertDescription>
        <span className="text-white">{value.text}</span>
        <span>{value.sentenceExample}</span>
        <div className="flex flex-wrap items-center gap-1">
          {value.examples.map((e, i) => (
            <Badge variant="outline" key={i}>
              {e}
            </Badge>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}

const PartOfSpeechSelector: React.FC<{
  disabled: boolean
  onValueChange: (val: string) => void
}> = ({ disabled, onValueChange }) => {
  return (
    <Select disabled={disabled} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Part of speech" />
      </SelectTrigger>
      <SelectContent className="z-[8620]">
        <SelectItem value="noun">noun</SelectItem>
        <SelectItem value="pronoun">pronoun</SelectItem>
        <SelectItem value="verb">verb</SelectItem>
        <SelectItem value="adjective">adjective</SelectItem>
        <SelectItem value="adverb">adverb</SelectItem>
        <SelectItem value="phrasalVerb">phrasal verb</SelectItem>
        <SelectItem value="idiom">idiom</SelectItem>
        <SelectItem value="phrase">phrase</SelectItem>
        <SelectItem value="preposition">preposition</SelectItem>
        <SelectItem value="conjunction">conjunction</SelectItem>
        <SelectItem value="interjection">interjection</SelectItem>
      </SelectContent>
    </Select>
  )
}

const TargetWordSelector: React.FC<{
  disabled: boolean
  onValueChange: (val: string) => void
  selectedTargetWords: string[]
}> = ({ disabled, onValueChange, selectedTargetWords }) => {
  return (
    <Select id="word" disabled={disabled} onValueChange={onValueChange}>
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
  )
}

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
  const [syllableInfo, setSyllableInfo] = useState<PartOfSpeechDef | null>(null)
  const [idAutofilled, setIdAutofilled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { loading, failureMessage, addCustomDefinition } = useCardController()
  const form = useForm<z.infer<typeof addCustomDefinitionSchema>>({
    resolver: zodResolver(addCustomDefinitionSchema),
    defaultValues: {
      offensive: false,
    },
  })
  const wordValue = form.watch('word')
  const sourceEntryIdValue = form.watch('sourceEntryId')

  const onSubmit = async (data: z.infer<typeof addCustomDefinitionSchema>) => {
    // requesting after zod validation has passed

    const editingDetails = await addCustomDefinition(cardId, sentence, selectedTargetWords, data)
    if (editingDetails) {
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
    setSyllableInfo(partOfSpeechDefs[value])
  }

  const handleGenerateSyllabifiedWord = () => {
    const sourceEntryId = form.getValues().sourceEntryId
    if (!sourceEntryId) return

    syllabify(sourceEntryId).then(text => {
      form.setValue('syllabifiedWord', text)
      form.setFocus('syllabifiedWord')
    })
  }

  useEffect(() => {
    form.setValue('word', '')
    if (form.getValues().sourceEntryId) {
      form.setValue('sourceEntryId', '')
    }
  }, [selectedTargetWords, form])

  useEffect(() => {
    if (!modalOpen) {
      form.reset()
      setIdAutofilled(false)
      setSyllableInfo(null)
    }
  }, [modalOpen, form])

  // When user selected the targetWord, autofill the sourceEntryId field
  // and suggests that the user reviews it (by focusing)
  // works only once
  useEffect(() => {
    if (!idAutofilled && wordValue && !sourceEntryIdValue) {
      setIdAutofilled(true)
      form.setValue('sourceEntryId', wordValue)
      form.setFocus('sourceEntryId')
    }
  }, [idAutofilled, wordValue, sourceEntryIdValue])

  return (
    <Dialog open={modalOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" asChild onClick={() => setModalOpen(true)}>
          <AddButtonGhost text="Add custom definition" ref={openBtnRef} hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto overflow-x-hidden">
        <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add custom definition</DialogTitle>
            <DialogDescription>
              Write your own definition to help you remember the word better. Maybe you found a
              simpler explanation or one that makes more sense to you. Either way, it&apos;s a great
              way to strengthen your memory!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="word">Target Word for this Definition</Label>

              {/* custom Select is not handled by useForm by default */}
              <TargetWordSelector
                disabled={loading}
                selectedTargetWords={selectedTargetWords}
                onValueChange={handleSelectTargetWordChange}
              />
              <FormInputErrorMessage message={form.formState.errors.word} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="sourceEntryId">Exact Word for this Definition</Label>
              <Input
                id="sourceEntryId"
                name="sourceEntryId"
                disabled={loading}
                {...form.register('sourceEntryId')}
              />
              <p className="text-muted-foreground text-sm">
                Example: if the Target Word is “Ducks,” the exact word might be “Duck.”
              </p>
              <FormInputErrorMessage message={form.formState.errors.sourceEntryId} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="partOfSpeech">Part of speech</Label>

              <PartOfSpeechSelector
                disabled={loading}
                onValueChange={handleSelectPartOfSpeechChange}
              />

              {syllableInfo && <PartOfSpeechSuggestionCard value={syllableInfo} />}

              <FormInputErrorMessage message={form.formState.errors.partOfSpeech} />
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
              <FormInputErrorMessage message={form.formState.errors.text} />
            </div>

            <div className="grid gap-3 items-start">
              <Label htmlFor="syllabifiedWord">Syllabified word</Label>
              <Input
                id="syllabifiedWord"
                name="syllabifiedWord"
                placeholder="fas*ci*nat*ing"
                disabled={loading}
                {...form.register('syllabifiedWord')}
              />
              <Button disabled={loading} type="button" onClick={handleGenerateSyllabifiedWord}>
                💡 Generate Syllabified Word
              </Button>
              <p className="text-muted-foreground text-sm">
                Automatic syllable generation may be incorrect. Double-check to ensure correct
                pronunciation.
              </p>
              <FormInputErrorMessage message={form.formState.errors.syllabifiedWord} />
            </div>
          </div>

          {/* General failure */}
          {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

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
