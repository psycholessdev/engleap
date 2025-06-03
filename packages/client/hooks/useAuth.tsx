'use client'
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { userLogOut, userSignIn, userSignUp, type UserSignInData, type UserSignUpData } from '@/api'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  isLogged: boolean
  loading: boolean
  login: (data: UserSignInData, origin: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (data: UserSignUpData) => Promise<void | unknown>
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  loading: true,
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  signUp: async () => Promise.resolve(),
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getUser = async () => {
    // const user = await checkIfAuthed()
    // dispatch(setUser(user))
  }

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

  const login = async (data: UserSignInData) => {
    try {
      await userSignIn(data)
      await getUser()
      setIsLogged(true)
      router.push('/decks')
    } catch (error) {
      console.log(`login error: ${error}`)
    }
  }

  const signUp = async (data: UserSignUpData) => {
    try {
      await userSignUp(data)
      await getUser()
      setIsLogged(true)
      router.push('/decks')
    } catch (error) {
      console.log(`sign up error: ${error}`)
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
      login,
      logout,
    }),
    [isLogged, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
