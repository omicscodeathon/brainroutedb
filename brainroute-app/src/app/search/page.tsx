import { Suspense } from 'react'
import { SearchClient } from './SearchClient'

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 p-8 text-slate-700">
          Loading BrainRoute search...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  )
}
