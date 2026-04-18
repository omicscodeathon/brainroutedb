/**
 * Download Data Component
 * Allows users to export filtered data as CSV
 */

'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import type { FilterState } from '@/lib/types'
import { getFilteredDataForExport } from '@/lib/queries/brainroute'
import { exportMoleculesAsCSV } from '@/lib/utils/csv-export'

interface DownloadDataProps {
  filters: FilterState
  totalRecords: number
}

export function DownloadData({ filters, totalRecords }: DownloadDataProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch all filtered data
      const data = await getFilteredDataForExport(filters)

      if (data.length === 0) {
        setError('No data to download. Try adjusting your filters.')
        return
      }

      // Generate CSV and trigger download
      exportMoleculesAsCSV(data)
    } catch (err) {
      setError('Failed to download data. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Download the currently filtered dataset ({totalRecords} molecules) as CSV.
        </p>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>
        )}

        <button
          onClick={handleDownload}
          disabled={isLoading || totalRecords === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Download className="h-5 w-5" />
          {isLoading ? 'Downloading...' : 'Download CSV'}
        </button>

        <p className="text-xs text-gray-500">
          The download includes all filtered results, not just the current page view.
        </p>
      </div>
    </div>
  )
}
