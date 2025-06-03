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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type UserSignUpData } from '@/api'
import { useAuth } from '@/hooks/useAuth'
import FormInputError from '@/components/FormInputError'
import FailureAlert from '@/components/FailureAlert'

const schema = z.strictObject({
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username should be at least 3 characters' })
    .max(18, { message: 'Username should be at much 18 characters' }),
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is invalid' }),
  password: z
    .string({ message: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
  proficiencyLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], {
    message: 'Proficiency Level is required',
  }),
})

type SignUpData = z.infer<typeof schema>

const AuthCard = () => {
  const [failure, setFailure] = useState('')
  const { signUp, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SignUpData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: UserSignUpData) => {
    // requesting after zod validation has passed
    setFailure('')
    const { success, reason } = await signUp(data)

    if (success) reset()
    if (reason) {
      setFailure(reason)
    }
  }

  const handleSelectChange = (value: string) => {
    // it's custom select that not handled by useForm by default
    // instead, I created hidden input passed to useForm
    // and its value changes when the custom select
    setValue('proficiencyLevel', value)
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
        <CardTitle>Create your EngLeap account</CardTitle>
        <CardDescription>Your journey to fluency is about to begin!</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="lynn"
                disabled={loading}
                required
                {...register('username')}
              />
              <FormInputError error={errors.username} />
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="proficiencyLevel">Your Proficiency level</Label>
              <Input id="proficiencyLevel" type="text" hidden {...register('proficiencyLevel')} />

              {/* custom Select is not handled by useForm by default */}
              <Select disabled={loading} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 (Beginner)</SelectItem>
                  <SelectItem value="A2">A2 (Basic)</SelectItem>
                  <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                  <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                  <SelectItem value="C1">C1 (Advanced)</SelectItem>
                  <SelectItem value="C2">C2 (Proficient)</SelectItem>
                </SelectContent>
              </Select>
              <FormInputError error={errors.proficiencyLevel} />
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
                Create Account
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default AuthCard
