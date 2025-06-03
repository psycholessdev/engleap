'use client'
import React, { useState } from 'react'
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
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type UserSignInData } from '@/api'
import { useAuth } from '@/hooks/useAuth'
import { Loader2Icon } from 'lucide-react'
import FormInputError from '@/components/FormInputError'
import FailureAlert from '@/components/FailureAlert'

const schema = z.strictObject({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is invalid' }),
  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
})

const AuthCard = () => {
  const [failure, setFailure] = useState('')
  const { signIn, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data: UserSignInData) => {
    // requesting after zod validation has passed
    setFailure('')
    const { success, reason } = await signIn(data)

    if (success) {
      reset()
    }
    if (reason) {
      setFailure(reason)
    }
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
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="lynn@gmail.com"
                disabled={loading}
                required
                {...register('email')}
              />
              <FormInputError error={errors.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={loading}
                required
                {...register('password')}
              />
              <FormInputError error={errors.password} />
            </div>

            {/* General failure */}
            {failure && <FailureAlert title="Failure" message={failure} />}

            {loading ? (
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
export default AuthCard
