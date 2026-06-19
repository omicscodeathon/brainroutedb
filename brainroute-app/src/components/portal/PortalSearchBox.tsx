'use client'

import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function PortalSearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    const target = trimmedQuery
      ? `/search?query=${encodeURIComponent(trimmedQuery)}`
      : '/search'

    router.push(target)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="portal-search">
        Search BrainRoute
      </label>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="portal-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by molecule name, SMILES, BBB tag, property, or identifier..."
          className="h-12 w-full border border-slate-300 bg-white py-3 pl-12 pr-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  )
}
