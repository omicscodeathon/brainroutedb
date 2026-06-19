'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/src/components/Header'
import { DownloadData } from '@/src/components/download/DownloadData'
import { FilterPanel } from '@/src/components/filters/FilterPanel'
import { getFilteredCount } from '@/lib/queries/brainroute'
import type { FilterState } from '@/lib/types'
import { parseSerializedFilters } from '@/lib/utils/filter-url'

const includedFields = [
  'Molecule name and SMILES',
  'BBB tag and prediction confidence',
  'Training, predicted, and verified tags',
  'CNS MPO score and LogD approximation when available',
  'Molecular weight, LogP, TPSA, HBD, HBA, and rotatable bonds',
  'Ring count, aromaticity, heterocycle, peptide-like, and lipid-like flags',
  'Lipinski, Veber, Egan, Ghose, and PAINS rule outputs',
  'Profile JSON metadata when present in the source record',
]

export default function DownloadsPage() {
  const [filters, setFilters] = useState<FilterState>({})
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoadingCount, setIsLoadingCount] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFilters(parseSerializedFilters(params.get('filters')))
  }, [])

  useEffect(() => {
    async function loadCount() {
      setIsLoadingCount(true)
      try {
        const count = await getFilteredCount(filters)
        setTotalRecords(count)
      } finally {
        setIsLoadingCount(false)
      }
    }

    loadCount()
  }, [filters])

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-blue-700">Download</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Downloads</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Export the current BrainRoute molecule dataset for downstream analysis,
              reproducible filtering, model review, and documentation.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:px-8">
          <div>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isLoading={isLoadingCount}
            />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">Dataset Export</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              The export below downloads the currently selected records as CSV. Adjust filters
              here or arrive from Search, Visualize, or Know Your Data with a selected subset.
            </p>
            <div className="mt-6">
              <DownloadData filters={filters} totalRecords={totalRecords} />
            </div>
          </section>

          <aside className="h-fit border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Included Fields</h2>
            <ul className="mt-4 space-y-3">
              {includedFields.map((field) => (
                <li key={field} className="border-l-4 border-blue-600 pl-3 text-sm text-slate-700">
                  {field}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  )
}
