'use client'

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'
import { FormSubmitButton, FormInputErrorMessage } from '@/components/common'
import Image from 'next/image'
import Link from 'next/link'

import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

import { zodResolver } from '@hookform/resolvers/zod'
import { userSignInFormSchema } from '@/schema'
import type { UserSignInFormData } from '@/types'

const SignInFormFields: React.FC<{
  form: UseFormReturn<UserSignInFormData>
  isLoading: boolean
}> = ({ form, isLoading }) => {
  return (
    <>
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
    </>
  )
}

const SignInForm = () => {
  const { signIn, isLoading, failureMessage } = useAuth()
  const form = useForm({ resolver: zodResolver(userSignInFormSchema) })

  const onSubmit = async (data: UserSignInFormData) => {
    // requesting after zod validation has passed
    const { success } = await signIn(data)

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
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email and password to log in.</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Sign in to EngLeap">
          <div className="flex flex-col gap-6">
            <SignInFormFields form={form} isLoading={isLoading} />

            {/* General failure */}
            {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

            <FormSubmitButton text="Log in" fullWidth loading={isLoading} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default SignInForm
