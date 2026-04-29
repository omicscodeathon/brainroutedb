/**
 * Data Preview Table Component
 * Displays filtered molecules with pagination
 */

'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Molecule, DataPreviewResponse, FilterState } from '@/lib/types'
import { queryMolecules } from '@/lib/queries/brainroute'
import { formatDecimal } from '@/lib/utils'
import { MoleculeDetailCard } from './MoleculeDetailCard'

interface DataPreviewProps {
  filters: FilterState
  pageSize?: number
}

const COLUMNS_TO_DISPLAY = [
  'name',
  'mw',
  'logp',
  'tpsa',
  'cns_mpo',
  'bbb_tag',
]

export function DataPreview({ filters, pageSize = 15 }: DataPreviewProps) {
  const [data, setData] = useState<Molecule[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null)

  // Fetch data when filters or page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response: DataPreviewResponse = await queryMolecules(
          filters,
          'id',
          'desc',
          page,
          pageSize
        )
        setData(response.data)
        setTotal(response.total)
      } catch (err) {
        setError('Failed to load data. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters, page, pageSize])

  const totalPages = Math.ceil(total / pageSize)
  const tagLabels: Record<string, string> = {
    br_training: 'Training',
    br_predicted: 'Predicted',
    br_verified: 'Verified',
  }

  const renderTags = (tags?: string[] | null) => {
    if (!tags || tags.length === 0) return null
    return (
      <span className="mt-1 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            {tagLabels[tag] || tag}
          </span>
        ))}
      </span>
    )
  }

  const formatValue = (value: any, column: string, molecule?: Molecule): React.ReactNode => {
    if (value === null || value === undefined) return '—'
    if (column === 'name' && molecule) {
      return (
        <button
          onClick={() => setSelectedMolecule(molecule)}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition"
        >
          {value}
          {renderTags(molecule.tags)}
        </button>
      )
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'number') {
      if (column.includes('_pass') || column.includes('flag')) {
        return value ? 'Yes' : 'No'
      }
      if (column === 'mw' || column === 'tpsa') {
        return formatDecimal(value, 2)
      }
      if (column === 'logp' || column === 'logd') {
        return formatDecimal(value, 3)
      }
      if (column === 'cns_mpo') {
        return formatDecimal(value, 1)
      }
      return String(value)
    }
    if (typeof value === 'string') {
      return value.length > 50 ? value.substring(0, 47) + '...' : value
    }
    return String(value)
  }

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-gray-500">Loading data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-gray-500">No molecules match your filters.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {COLUMNS_TO_DISPLAY.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left font-semibold text-gray-900 whitespace-nowrap"
                >
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((molecule, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {COLUMNS_TO_DISPLAY.map((column) => (
                  <td key={column} className="px-6 py-4 text-gray-700">
                    {formatValue((molecule as any)[column], column, molecule)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Molecule Detail Card Modal */}
      <MoleculeDetailCard molecule={selectedMolecule} onClose={() => setSelectedMolecule(null)} />

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} out of{' '}
          <span className="font-semibold">{totalPages}</span> pages ({total} total molecules)
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
