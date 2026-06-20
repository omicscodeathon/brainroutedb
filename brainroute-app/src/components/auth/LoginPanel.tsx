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
      <h2 className="text-xl font-bold text-slate-950">Sign in to BrainRoute</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Sign in to connect prediction runs, downloads, and verification submissions to your
        BrainRoute account.
      </p>

      <div className="mt-5 space-y-4">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Google
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
