'use client'
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { IconBulb } from '@tabler/icons-react'
import { UseFormReturn } from 'react-hook-form'
import { createCardFormSchema } from '@/schema'
import { z } from 'zod'
import FormInputErrorMessage from '@/components/common/FormInputErrorMessage'

interface CardFormFieldsProps {
  form: UseFormReturn<z.infer<typeof createCardFormSchema>>
  isLoading: boolean
  failureMessage: string | null
}

const CardFormFields: React.FC<CardFormFieldsProps> = ({ form, isLoading, failureMessage }) => {
  return (
    <div className="form-field">
      <FormInputErrorMessage message={failureMessage} />

      <h2 className="font-ubuntu text-lg text-white">Sentence containing the target word(s)</h2>
      <Textarea
        name="sentence"
        placeholder="It's fascinating how she always manages to break the ice with strangers so easily"
        className="w-full"
        disabled={isLoading}
        {...form.register('sentence')}
      />
      <FormInputErrorMessage message={form.formState.errors.sentence} />
      {!form.getValues().sentence && (
        <Alert>
          <IconBulb />
          <AlertTitle>
            Try to find elaborate sentences. That way your brain will automatically memorize not
            only the meaning, but the use cases as well.
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}

export default CardFormFields
