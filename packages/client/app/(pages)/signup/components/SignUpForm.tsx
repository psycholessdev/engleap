'use client'

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  FormItem,
  Input,
  Label,
} from '@/components/ui'
import {
  FormSubmitButton,
  ProficiencyLevelPicker,
  FormInputErrorMessage,
} from '@/components/common'
import Image from 'next/image'
import Link from 'next/link'

import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

import { zodResolver } from '@hookform/resolvers/zod'
import { userSignupFormSchema } from '@/schema'
import type { UserSignUpFormData } from '@/types'

const SignUpFormFields: React.FC<{
  form: UseFormReturn<UserSignUpFormData>
  isLoading: boolean
}> = ({ form, isLoading }) => {
  return (
    <>
      <div className="form-field">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="lynn"
          disabled={isLoading}
          required
          {...form.register('username')}
        />
        <p className="text-muted-foreground text-sm">This is your public display name.</p>
        <FormInputErrorMessage message={form.formState.errors?.username} />
      </div>
      <div className="form-field">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="lynn@gmail.com"
          disabled={isLoading}
          required
          {...form.register('email')}
        />
        <FormInputErrorMessage message={form.formState.errors?.email} />
      </div>
      <div className="form-field">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          required
          {...form.register('password')}
        />
        <FormInputErrorMessage message={form.formState.errors?.password} />
      </div>
      <div className="form-field">
        <Label htmlFor="proficiencyLevel">Your Proficiency level</Label>

        <FormField
          control={form.control}
          name="proficiencyLevel"
          render={({ field }) => (
            <FormItem>
              <ProficiencyLevelPicker
                disabled={isLoading}
                onChange={field.onChange}
                value={field.value}
              />
            </FormItem>
          )}
        />

        <FormInputErrorMessage message={form.formState.errors?.proficiencyLevel} />
      </div>
    </>
  )
}

const SignUpForm = () => {
  const { signUp, isLoading, failureMessage } = useAuth()
  const form = useForm({ resolver: zodResolver(userSignupFormSchema) })

  const onSubmit = async (data: UserSignUpFormData) => {
    // requesting after zod validation has passed
    const { success } = await signUp(data)

    if (success) form.reset()
  }

  return (
    <Card className="auth-card">
      <Image
        src="/favicon.png"
        alt="App Logo"
        className="select-none drag-none self-center"
        width={71}
        height={70}
        priority
      />
      <CardHeader>
        <CardTitle>Create your EngLeap account</CardTitle>
        <CardDescription>Your journey to fluency starts now!</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Sign up for EngLeap">
          <div className="flex flex-col gap-6">
            <SignUpFormFields form={form} isLoading={isLoading} />

            {/* General failure */}
            {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

            <FormSubmitButton text="Create Account" fullWidth loading={isLoading} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default SignUpForm
