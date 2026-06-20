/**
 * Header/Navigation component
 */

import Link from 'next/link'
import { BrainCircuit } from 'lucide-react'
import { AuthStatus } from './auth/AuthStatus'
import { OpenPredictionToolButton } from './auth/OpenPredictionToolButton'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/40 bg-white/35 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xl font-bold text-slate-950">BrainRoute</span>
              <span className="block text-xs font-medium uppercase text-slate-500">
                BBB Database
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <Link
              href="/getting-started"
              className="text-slate-700 transition hover:text-blue-700"
            >
              Help
            </Link>
            <Link
              href="/about"
              className="text-slate-700 transition hover:text-blue-700"
            >
              About
            </Link>
            <OpenPredictionToolButton />
            <AuthStatus />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
