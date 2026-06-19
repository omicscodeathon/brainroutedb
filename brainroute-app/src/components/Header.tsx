/**
 * Header/Navigation component
 */

import Link from 'next/link'
import { BrainCircuit, ExternalLink } from 'lucide-react'

export function Header() {
  const predictionToolUrl =
    process.env.NEXT_PUBLIC_STREAMLIT_APP_URL || 'https://brainroute.streamlit.app/'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded border border-blue-200 bg-blue-50 text-blue-700">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xl font-bold text-slate-950">BrainRoute</span>
              <span className="block text-xs font-medium uppercase text-slate-500">
                BBB Database
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
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
            <a
              href={predictionToolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
            >
              Prediction Tool
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
