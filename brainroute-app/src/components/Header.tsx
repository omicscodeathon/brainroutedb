/**
 * Header/Navigation component
 */

import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 border-b border-white/10 dark:border-gray-700/10 shadow-lg shadow-white/5">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">BrainRoute</div>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/know-your-data"
              className="text-black font-bold hover:text-blue-600 transition"
            >
              Know Your Data
            </Link>
            <Link
              href="/verify-data"
              className="text-black font-bold hover:text-blue-600 transition"
            >
              Verify Data
            </Link>
            <Link
              href="/about"
              className="text-black font-bold hover:text-blue-600 transition"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
