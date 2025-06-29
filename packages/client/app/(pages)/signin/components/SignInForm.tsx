'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormInputErrorMessage from '@/components/common/FormInputErrorMessage'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { signInSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UserSignInData } from '@/api'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

const SignInForm = () => {
  const { signIn, isLoading, failureMessage } = useAuth()
  const form = useForm({ resolver: zodResolver(signInSchema) })

  const onSubmit = async (data: UserSignInData) => {
    // requesting after zod validation has passed
    const { success } = await signIn(data)

    if (success) form.reset()
  }

  return (
    <Card className="w-full max-w-sm">
      <Image
        src="/favicon.png"
        alt="App Logo"
        className="select-none drag-none self-center"
        width={71}
        height={70}
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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

            {/* General failure */}
            {failureMessage && <FormInputErrorMessage title="Failure" message={failureMessage} />}

            {isLoading ? (
              <Button className="w-full" disabled>
                <Loader2Icon className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Log in
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default SignInForm
