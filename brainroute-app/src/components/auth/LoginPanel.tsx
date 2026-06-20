'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthProvider'

export function LoginPanel() {
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogle = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to start Google sign in.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const cleanEmail = email.trim()
      if (!cleanEmail) throw new Error('Enter an email address.')

      const { error } = await signInWithEmail(cleanEmail)
      if (error) throw error

      setSuccess('Check your email for a magic sign in link.')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to send sign in link.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-950">Sign in/up to BrainRoute</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Sign in or create an account to connect prediction runs, downloads, and verification
        submissions to your BrainRoute profile.
      </p>

      <div className="mt-5 space-y-4">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-3 border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-5 w-5 items-center justify-center bg-white" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
              />
            </svg>
          </span>
          Sign in/up with Google
        </button>

        <form onSubmit={handleEmail} className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="auth-email">
            Email magic link
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send sign in link
          </button>
          <p className="text-xs text-slate-500">Email login sends a one-time magic link.</p>
        </form>
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      {success && <p className="mt-4 text-sm font-semibold text-emerald-700">{success}</p>}
    </div>
  )
}
