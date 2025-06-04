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

type AuthenticateResult = { success: boolean; reason?: string }

type AuthContextType = {
  isLogged: boolean
  userId: null | string
  loading: boolean
  signIn: (data: UserSignInData) => Promise<AuthenticateResult>
  signUp: (data: UserSignUpData) => Promise<AuthenticateResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  userId: null,
  loading: true,
  signIn: async () => Promise.resolve({ success: false }),
  signUp: async () => Promise.resolve({ success: false }),
  logout: async () => Promise.resolve(),
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)
  const [userId, setUserId] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { alert } = useNotifications()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getUser()
        setIsLogged(true)
        setUserId(user.id)
      } catch (error: AxiosError) {
        if (!error.response) {
          alert('Authentication failed', 'Check your internet connection', 'failure')
        }
        setIsLogged(false)
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const signIn = async (data: UserSignInData) => {
    try {
      setLoading(true)
      await userSignIn(data)
      const user = await getUser()
      setIsLogged(true)
      setUserId(user.id)
      router.push('/decks')
      alert('Successfully logged in', `Welcome, ${user.username}`, 'success')
      return { success: true }
    } catch (error: AxiosError) {
      let reason = 'Check your credentials'
      if (error.response) {
        if (error.response.data?.reason) {
          reason = error.response.data.reason
        }
      } else {
        reason = 'Check your internet connection'
        console.log(`sign in error: ${error}`)
      }

      alert('Failed to sign in', reason, 'failure')
      return { success: false, reason }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: UserSignUpData) => {
    try {
      setLoading(true)
      await userSignUp(data)
      const user = await getUser()
      setIsLogged(true)
      setUserId(user.id)
      router.push('/decks')
      alert('Successfully signed up', `Welcome back, ${user.username}`, 'success')
      return { success: true }
    } catch (error: AxiosError) {
      let reason = 'Check your credentials'
      if (error.response) {
        if (error.response.data?.reason) {
          reason = error.response.data.reason
        }
      } else {
        reason = 'Check your internet connection'
        console.log(`sign up error: ${error}`)
      }

      alert('Failed to sign up', reason, 'failure')
      return { success: false, reason }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await userLogOut()
      setIsLogged(false)
      setUserId(null)
      router.push('/signin')
      alert('Successfully logged out', 'Hope we see you again!', 'success')
    } catch (error) {
      console.log(`logout error: ${error}`)
    }
  }

  const value = useMemo(
    () => ({
      loading,
      isLogged,
      userId,
      signUp,
      signIn,
      logout,
    }),
    [isLogged, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
