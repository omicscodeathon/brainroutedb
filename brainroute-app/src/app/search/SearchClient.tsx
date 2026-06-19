'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { DataPreview } from '@/src/components/table/DataPreview'
import { FilterPanel } from '@/src/components/filters/FilterPanel'
import { getFilteredCount } from '@/lib/queries/brainroute'
import type { FilterState } from '@/lib/types'
import { createFilteredHref, parseSerializedFilters } from '@/lib/utils/filter-url'

function filtersFromParams(searchParams: ReturnType<typeof useSearchParams>): FilterState {
  const filters: FilterState = parseSerializedFilters(searchParams.get('filters'))
  const query = searchParams.get('query')
  const filter = searchParams.get('filter')

  if (query) {
    filters.search = query
  }

  switch (filter) {
    case 'bbb_positive':
      filters.bbb_tag = 'positive'
      break
    case 'bbb_negative':
      filters.bbb_tag = 'negative'
      break
    case 'training':
      filters.tag = 'br_training'
      break
    case 'predicted':
      filters.tag = 'br_predicted'
      break
    case 'verified':
      filters.tag = 'br_verified'
      break
    case 'drug_like':
      filters.drug_like = true
      break
    case 'lipinski':
      filters.lipinski_pass = true
      break
    case 'veber':
      filters.veber_pass = true
      break
    case 'egan':
      filters.egan_pass = true
      break
    case 'ghose':
      filters.ghose_pass = true
      break
    default:
      break
  }

  return filters
}

export function SearchClient() {
  const searchParams = useSearchParams()
  const initialFilters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams]
  )
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoadingCount, setIsLoadingCount] = useState(false)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  useEffect(() => {
    async function updateCount() {
      setIsLoadingCount(true)
      try {
        const count = await getFilteredCount(filters)
        setTotalRecords(count)
      } finally {
        setIsLoadingCount(false)
      }
    }

    updateCount()
  }, [filters])

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-blue-700">Search</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Search BrainRoute</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Query molecule names, SMILES strings, BBB labels, source tags, and drug rule
              filters using the same data preview system as Know Your Data.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isLoading={isLoadingCount}
            />
          </div>

          <div className="space-y-6 lg:col-span-3">
            <section className="border-l-4 border-blue-700 bg-white p-4 shadow">
              <p className="text-sm text-slate-600">Total Results</p>
              <div className="mt-1 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <p className="text-3xl font-bold text-slate-950">
                  {isLoadingCount ? '...' : totalRecords.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={createFilteredHref('/visualize', filters)}
                    className="inline-flex items-center gap-2 border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    Visualize selected data
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            <DataPreview filters={filters} pageSize={20} />
          </div>
        </div>
      </main>
    </div>
  )
}
