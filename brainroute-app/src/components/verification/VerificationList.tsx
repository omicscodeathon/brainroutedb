/**
 * Verification List Component
 * Displays verification submissions with filters and review status
 */

'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Download } from 'lucide-react'
import type { VerificationSubmission } from '@/lib/types/verification'
import { getVerifications } from '@/lib/queries/verification'

interface VerificationListProps {
  refreshTrigger?: number
}

export function VerificationList({ refreshTrigger }: VerificationListProps) {
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch verifications on mount and when filters change
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true)
      try {
        const { data, total: totalCount } = await getVerifications(
          { status: 'all', search: searchTerm },
          page,
          15
        )
        setSubmissions(data)
        setTotal(totalCount)
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [page, searchTerm, refreshTrigger])

  const totalPages = Math.ceil(total / 15)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search Bar */}
      <div className="border-b border-gray-200 p-6">
        <input
          type="text"
          placeholder="Search by molecule name or lab..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setPage(1) // Reset to page 1 when searching
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Empty State */}
      {submissions.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>No verification submissions yet.</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>Loading submissions...</p>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length > 0 && (
        <div className="divide-y divide-gray-200">
          {submissions.map(submission => (
            <div
              key={submission.id}
              className="p-6 hover:bg-gray-50 transition border-l-4 border-blue-500"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {submission.molecule_name || `Molecule ID: ${submission.molecule_id}`}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted by {submission.submitted_by} from {submission.institution_name}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {submission.verified_by_admin ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">Pending</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Technique</p>
                  <p className="text-gray-900">{submission.technique_used}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Lab</p>
                  <p className="text-gray-900">{submission.lab_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Result</p>
                  <p className="text-gray-900 capitalize">{submission.permeability_result}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Date</p>
                  <p className="text-gray-900">
                    {submission.created_at
                      ? new Date(submission.created_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {submission.experiment_description}
                </p>
              </div>

              {/* Files */}
              {submission.file_urls && submission.file_urls.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Supporting Files ({submission.file_urls.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.file_urls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                      >
                        <Download className="h-3 w-3" />
                        File {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Paper DOI */}
              {submission.paper_doi && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">DOI:</span>{' '}
                  <a
                    href={`https://doi.org/${submission.paper_doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {submission.paper_doi}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * 15 + 1}-{Math.min(page * 15, total)} of {total} submissions
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
      )}
    </div>
  )
}
