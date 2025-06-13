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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormInputError from '@/components/FormInputError'
import FailureAlert from '@/components/FailureAlert'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { signupSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UserSignUpData } from '@/api'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

const ProficiencyLevelPicker: React.FC<{ disabled: boolean; onSelect: (val: string) => void }> = ({
  disabled,
  onSelect,
}) => {
  return (
    <Select disabled={disabled} onValueChange={onSelect}>
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
  )
}

const SignUpForm = () => {
  const { signUp, isLoading, failureMessage } = useAuth()
  const form = useForm({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: UserSignUpData) => {
    // requesting after zod validation has passed
    const { success } = await signUp(data)

    if (success) form.reset()
  }

  const handleSelectChange = (value: string) => {
    // it's custom select that not handled by useForm by default
    // instead, I created hidden input passed to useForm
    // and its value changes when the custom select
    form.setValue('proficiencyLevel', value)
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
        <CardDescription>Your journey to fluency starts now!</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
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
              <FormInputError error={form.formState.errors?.username} />
            </div>
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
              <FormInputError error={form.formState.errors?.email} />
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
              <FormInputError error={form.formState.errors?.password} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proficiencyLevel">Your Proficiency level</Label>
              <Input
                id="proficiencyLevel"
                type="text"
                hidden
                {...form.register('proficiencyLevel')}
              />

              {/* custom Select is not handled by useForm by default */}
              <ProficiencyLevelPicker disabled={isLoading} onSelect={handleSelectChange} />

              <FormInputError error={form.formState.errors?.proficiencyLevel} />
            </div>

            {/* General failure */}
            {failureMessage && <FailureAlert title="Failure" message={failureMessage} />}

            {isLoading ? (
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
export default SignUpForm
