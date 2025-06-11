'use client'
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import {
  userLogOut,
  userSignIn,
  userSignUp,
  getUser,
  type UserSignInData,
  type UserSignUpData,
} from '@/api'
import { useRouter } from 'next/navigation'
import { useAxiosErrorHandler } from '@/hooks'

type AuthenticateResult = { success: boolean; reason?: string }

type AuthContextType = {
  isLogged: boolean
  userId: null | string
  isLoading: boolean
  signIn: (data: UserSignInData) => Promise<AuthenticateResult>
  signUp: (data: UserSignUpData) => Promise<AuthenticateResult>
  failureMessage: string
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  userId: null,
  isLoading: true,
  failureMessage: '',
  signIn: async () => Promise.resolve({ success: false }),
  signUp: async () => Promise.resolve({ success: false }),
  logout: async () => Promise.resolve(),
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)
  const [userId, setUserId] = useState<null | string>(null)
  const { handleAxios, isLoading, failureMessage } = useAxiosErrorHandler()
  const router = useRouter()
  const { alert } = useNotifications()

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = await handleAxios(
        async () => {
          return await getUser()
        },
        { errorMessage: 'Authentication failed' }
      )

      if (user) {
        setIsLogged(true)
        setUserId(user.id)
      } else {
        setIsLogged(false)
        setUserId(null)
        router.refresh()
      }
    }

    checkAuthStatus()
  }, [])

  const signIn = async (data: UserSignInData) => {
    const user = await handleAxios(
      async () => {
        return await userSignIn(data)
      },
      { errorMessage: 'Failed to sign in' }
    )

    if (user) {
      setUserId(user.id)
      router.refresh()
      alert('Successfully logged in', `Welcome, ${user.username}`, 'success')
    }

    return { success: !!user }
  }

  const signUp = async (data: UserSignUpData) => {
    const user = await handleAxios(
      async () => {
        await userSignUp(data)
        return await getUser()
      },
      { errorMessage: 'Failed to sign up' }
    )

    if (user) {
      setIsLogged(true)
      setUserId(user.id)
      router.refresh()
      alert('Successfully signed up', `Welcome back, ${user.username}`, 'success')
    }
    return { success: !!user }
  }

  const logout = async () => {
    const success = await handleAxios(
      async () => {
        await userLogOut()
        return true
      },
      { errorMessage: 'logout error' }
    )

    if (success) {
      setIsLogged(false)
      setUserId(null)
      router.refresh()
      alert('Successfully logged out', 'Hope we see you again!', 'success')
    }
  }

  const value = useMemo(
    () => ({
      isLoading,
      isLogged,
      userId,
      signUp,
      signIn,
      failureMessage,
      logout,
    }),
    [isLogged, failureMessage]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
