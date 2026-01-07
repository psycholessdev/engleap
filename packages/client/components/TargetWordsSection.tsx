'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { createCardFormSchema } from '@/schema'
import { z } from 'zod'
import TargetWordsPicker from '@/components/TargetWordsPicker'
import FormInputErrorMessage from '@/components/common/FormInputErrorMessage'

interface TargetWordsSectionProps {
  form: UseFormReturn<z.infer<typeof createCardFormSchema>>
  isLoading: boolean
  targetWordsToSelect: string[]
  selectedTargetWords: string[]
  onTargetWordClick: (word: string) => void
}

const TargetWordsSection: React.FC<TargetWordsSectionProps> = ({
  form,
  isLoading,
  targetWordsToSelect,
  selectedTargetWords,
  onTargetWordClick,
}) => {
  return (
    <div className="form-field">
      <h2 className="font-ubuntu text-lg text-white">🧩 Select the target word(s)</h2>
      <div className="flex flex-wrap gap-1">
        <TargetWordsPicker
          disabled={isLoading}
          selectedTargetWords={selectedTargetWords}
          targetWordsToSelect={targetWordsToSelect}
          onTargetWordClick={onTargetWordClick}
        />
      </div>
      <h2 className="font-ubuntu text-lg text-white">
        Or type them manually if we didn&apos;t detect them correctly
      </h2>
      <Input
        type="text"
        name="userSpecifiedTargetWords"
        placeholder="fascinated, break the ice"
        className="w-full"
        disabled={isLoading}
        {...form.register('userSpecifiedTargetWords')}
      />
      <p className="text-muted-foreground text-sm">
        Separate multiple words with commas. This field is very useful for Phrasal verbs or Idioms,
        like &apos;Spill the beans&apos;, &apos;Look after&apos; or &apos;Plot armor&apos;.
      </p>
      <FormInputErrorMessage message={form.formState.errors.userSpecifiedTargetWords} />
    </div>
  )
}

export default TargetWordsSection
