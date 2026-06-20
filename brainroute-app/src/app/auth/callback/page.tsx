'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

function getBasePath() {
  if (typeof window === 'undefined') return ''
  return window.location.pathname.startsWith('/brainroutedb') ? '/brainroutedb' : ''
}

function getSafeNext(searchParams: URLSearchParams) {
  const next = searchParams.get('next') || '/account'

  if (!next.startsWith('/') || next.startsWith('//')) {
    return '/account'
  }

  return next
}

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function completeSignIn() {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else {
          const { data, error } = await supabase.auth.getSession()
          if (error) throw error
          if (!data.session) throw new Error('No sign in session was found.')
        }

        const next = getSafeNext(url.searchParams)
        window.location.assign(`${getBasePath()}${next}`)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unable to complete sign in.')
      }
    }

    completeSignIn()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <div className="mx-auto max-w-xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Completing sign in...</h1>
        {error ? (
          <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>
        ) : (
          <p className="mt-4 text-sm text-slate-600">You will be redirected shortly.</p>
        )}
      </div>
    </main>
  )
}
