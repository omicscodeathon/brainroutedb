'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import {
  createPredictionHandoff as createPredictionHandoffCode,
  ensureProfile as ensureUserProfile,
  getCurrentSession,
  signInWithEmail as signInWithEmailAddress,
  signInWithGoogle as signInWithGoogleProvider,
  signOut as signOutUser,
} from '@/lib/auth/client'

interface AuthContextValue {
  session: Session | null
  user: User | null
  isAuthReady: boolean
  isLoggedIn: boolean
  signInWithGoogle: () => Promise<any>
  signInWithEmail: (email: string) => Promise<any>
  signOut: () => Promise<any>
  ensureProfile: (user: User) => Promise<void>
  createPredictionHandoff: (userId: string) => Promise<string>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      try {
        const currentSession = await getCurrentSession()
        if (isMounted) {
          setSession(currentSession)
        }
      } catch (error) {
        console.error('Failed to load auth session:', error)
      } finally {
        if (isMounted) {
          setIsAuthReady(true)
        }
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsAuthReady(true)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const user = session?.user || null

  useEffect(() => {
    if (!user) return
    ensureUserProfile(user)
  }, [user?.id])

  const signInWithGoogle = useCallback(() => signInWithGoogleProvider(), [])
  const signInWithEmail = useCallback((email: string) => signInWithEmailAddress(email), [])
  const signOut = useCallback(() => signOutUser(), [])
  const ensureProfile = useCallback((targetUser: User) => ensureUserProfile(targetUser), [])
  const createPredictionHandoff = useCallback(
    (userId: string) => createPredictionHandoffCode(userId),
    []
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isAuthReady,
      isLoggedIn: Boolean(user),
      signInWithGoogle,
      signInWithEmail,
      signOut,
      ensureProfile,
      createPredictionHandoff,
    }),
    [
      session,
      user,
      isAuthReady,
      signInWithGoogle,
      signInWithEmail,
      signOut,
      ensureProfile,
      createPredictionHandoff,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
