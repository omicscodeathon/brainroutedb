/**
 * Know Your Data Page
 * Core data exploration interface with filtering, preview, insights, download, and AI chat
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { FilterPanel } from '@/src/components/filters/FilterPanel'
import { DataPreview } from '@/src/components/table/DataPreview'
import { DataInsights } from '@/src/components/charts/DataInsights'
import { DownloadData } from '@/src/components/download/DownloadData'
import { getFilteredCount } from '@/lib/queries/brainroute'
import type { FilterState } from '@/lib/types'
import { createFilteredHref } from '@/lib/utils/filter-url'

export default function KnowYourDataPage() {
  const [filters, setFilters] = useState<FilterState>({})
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoadingCount, setIsLoadingCount] = useState(false)

  // Update total count when filters change
  React.useEffect(() => {
    const updateCount = async () => {
      setIsLoadingCount(true)
      try {
        const count = await getFilteredCount(filters)
        setTotalRecords(count)
      } catch (error) {
        console.error('Failed to update count:', error)
        setTotalRecords(0)
      } finally {
        setIsLoadingCount(false)
      }
    }

    updateCount()
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Know Your Data</h1>
          <p className="mt-2 text-gray-600">
            Explore and filter the BBB permeability dataset
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Filters */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isLoading={isLoadingCount}
            />
          </div>

          {/* Right Panel - Data & Insights */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
              <p className="text-sm text-gray-600">Total Results</p>
              <div className="mt-1 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingCount ? '...' : totalRecords.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={createFilteredHref('/visualize', filters)}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Visualize selected data
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Data Preview Table */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Preview</h2>
              <DataPreview filters={filters} pageSize={15} />
            </div>

            {/* Insights Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Insights</h2>
              <DataInsights filters={filters} />
            </div>

            {/* Download Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Export</h2>
              <DownloadData filters={filters} totalRecords={totalRecords} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
