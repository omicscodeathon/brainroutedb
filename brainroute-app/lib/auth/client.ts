'use client'

import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

const PRODUCTION_BASE_PATH = '/brainroutedb'

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

  if (configuredUrl) {
    return configuredUrl
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:3000'
  }

  const origin = window.location.origin
  const needsBasePath = window.location.hostname.endsWith('github.io')

  return `${origin}${needsBasePath ? PRODUCTION_BASE_PATH : ''}`
}

export function getAuthCallbackUrl() {
  return `${getSiteUrl()}/auth/callback`
}

function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured for this environment.')
  }
}

export async function signInWithGoogle() {
  requireSupabaseConfig()

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthCallbackUrl(),
      queryParams: {
        prompt: 'select_account',
      },
    },
  })
}

export async function signInWithEmail(email: string) {
  requireSupabaseConfig()

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl(),
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function ensureProfile(user: User) {
  if (!user?.id) return

  const metadata = user.user_metadata || {}
  const fullName =
    metadata.full_name ||
    metadata.name ||
    [metadata.given_name, metadata.family_name].filter(Boolean).join(' ') ||
    null

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
      avatar_url: metadata.avatar_url || metadata.picture || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('Failed to ensure profile:', error)
  }
}

function createHandoffCode() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createPredictionHandoff(userId: string) {
  requireSupabaseConfig()

  const code = createHandoffCode()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  const { error } = await supabase.from('auth_handoffs').insert({
    user_id: userId,
    code,
    expires_at: expiresAt,
  })

  if (error) throw error

  return code
}
