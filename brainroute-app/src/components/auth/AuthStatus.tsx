'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from './AuthProvider'

export function AuthStatus() {
  const { user, isAuthReady, isLoggedIn, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!isAuthReady) {
    return <span className="text-xs font-semibold text-slate-500">Loading account...</span>
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/account"
        className="inline-flex items-center border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        Sign in/up
      </Link>
    )
  }

  const label = user?.user_metadata?.full_name || user?.email || 'Account'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="max-w-44 truncate text-xs font-semibold text-slate-600">{label}</span>
      <Link
        href="/account"
        className="inline-flex items-center border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
      >
        My Profile
      </Link>
      <button
        type="button"
        disabled={isSigningOut}
        onClick={async () => {
          setIsSigningOut(true)
          await signOut()
          setIsSigningOut(false)
        }}
        className="inline-flex items-center border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign out
      </button>
    </div>
  )
}
