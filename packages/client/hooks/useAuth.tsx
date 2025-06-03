'use client'
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react'
import {
  userLogOut,
  userSignIn,
  userSignUp,
  getUser,
  type UserSignInData,
  type UserSignUpData,
} from '@/api'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  isLogged: boolean
  loading: boolean
  signIn: (data: UserSignInData) => Promise<boolean>
  signUp: (data: UserSignUpData) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  loading: true,
  signIn: async () => Promise.resolve(false),
  signUp: async () => Promise.resolve(false),
  logout: async () => Promise.resolve(),
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getUser()
        setIsLogged(true)
      } catch (error) {
        console.log(`auth error: ${error}`)
        setIsLogged(false)
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
      await getUser()
      setIsLogged(true)
      router.push('/decks')
      return true
    } catch (error) {
      console.log(`login error: ${error}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: UserSignUpData) => {
    try {
      setLoading(true)
      await userSignUp(data)
      await getUser()
      setIsLogged(true)
      router.push('/decks')
      return true
    } catch (error) {
      console.log(`sign up error: ${error}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await userLogOut()
      setIsLogged(false)
      router.push('/signin')
    } catch (error) {
      console.log(`logout error: ${error}`)
    }
  }

  const value = useMemo(
    () => ({
      loading,
      isLogged,
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
