'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { LoginPanel } from '@/src/components/auth/LoginPanel'
import { OpenPredictionToolButton } from '@/src/components/auth/OpenPredictionToolButton'
import { useAuth } from '@/src/components/auth/AuthProvider'
import { VerificationProgressBadge } from '@/src/components/verification/VerificationProgressBadge'
import {
  getMyDownloadEvents,
  getMyPredictionBatches,
  getMyPredictionRuns,
  getMyVerificationSubmissions,
} from '@/lib/queries/user-activity'

function formatDate(value?: string) {
  if (!value) return 'Unknown date'
  return new Date(value).toLocaleString()
}

function ActivityTable({
  title,
  rows,
  columns,
}: {
  title: string
  rows: Record<string, any>[]
  columns: Array<{
    key: string
    label: string
    render?: (row: Record<string, any>) => ReactNode
  }>
}) {
  return (
    <section className="border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">No records yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-700">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-2 font-bold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-3 text-slate-700">
                      {column.render ? column.render(row) : row[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function AccountPage() {
  const { user, isAuthReady, isLoggedIn } = useAuth()
  const [predictionRuns, setPredictionRuns] = useState<Record<string, any>[]>([])
  const [predictionBatches, setPredictionBatches] = useState<Record<string, any>[]>([])
  const [downloadEvents, setDownloadEvents] = useState<Record<string, any>[]>([])
  const [verificationSubmissions, setVerificationSubmissions] = useState<Record<string, any>[]>([])
  const [isLoadingActivity, setIsLoadingActivity] = useState(false)

  const loadActivity = useCallback(async () => {
    if (!user?.id) return

    setIsLoadingActivity(true)
    const [runs, batches, downloads, verifications] = await Promise.all([
      getMyPredictionRuns(user.id),
      getMyPredictionBatches(user.id),
      getMyDownloadEvents(user.id),
      getMyVerificationSubmissions(user.id),
    ])
    setPredictionRuns(runs)
    setPredictionBatches(batches)
    setDownloadEvents(downloads)
    setVerificationSubmissions(verifications)
    setIsLoadingActivity(false)
  }, [user?.id])

  useEffect(() => {
    loadActivity()
  }, [loadActivity])

  useEffect(() => {
    if (!user?.id) return

    const refreshVisibleActivity = () => {
      if (document.visibilityState === 'visible') {
        loadActivity()
      }
    }

    window.addEventListener('focus', loadActivity)
    document.addEventListener('visibilitychange', refreshVisibleActivity)

    return () => {
      window.removeEventListener('focus', loadActivity)
      document.removeEventListener('visibilitychange', refreshVisibleActivity)
    }
  }, [user?.id, loadActivity])

  const metadata = user?.user_metadata || {}
  const displayName = metadata.full_name || metadata.name || user?.email || 'BrainRoute user'
  const avatarUrl = metadata.avatar_url || metadata.picture

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="border-b border-slate-200 bg-white p-6">
          <p className="text-sm font-bold uppercase text-blue-700">Account</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">BrainRoute Account</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700">
            View account-linked prediction runs, downloads, and verification submissions.
          </p>
        </section>

        {!isAuthReady && (
          <section className="mt-6 border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Loading account...</p>
          </section>
        )}

        {isAuthReady && !isLoggedIn && (
          <div className="mt-6 max-w-xl">
            <LoginPanel />
          </div>
        )}

        {isAuthReady && isLoggedIn && user && (
          <div className="mt-6 space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-14 w-14 rounded border border-slate-200 object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">{displayName}</h2>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="mt-1 text-xs text-slate-500">User ID: {user.id}</p>
                  </div>
                </div>
                <OpenPredictionToolButton className="inline-flex items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800" />
              </div>
            </section>

            {isLoadingActivity && (
              <section className="border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-600">Loading account history...</p>
              </section>
            )}

            <ActivityTable
              title="Recent Prediction Runs"
              rows={predictionRuns}
              columns={[
                { key: 'molecule_name', label: 'Molecule' },
                { key: 'prediction_label', label: 'Prediction' },
                { key: 'confidence', label: 'Confidence' },
                { key: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
              ]}
            />

            <ActivityTable
              title="Recent Batch Predictions"
              rows={predictionBatches}
              columns={[
                { key: 'batch_name', label: 'Batch' },
                { key: 'total_molecules', label: 'Total' },
                { key: 'successful_molecules', label: 'Successful' },
                { key: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
              ]}
            />

            <ActivityTable
              title="Recent Downloads"
              rows={downloadEvents}
              columns={[
                { key: 'download_type', label: 'Type' },
                { key: 'record_count', label: 'Records' },
                { key: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
              ]}
            />

            <ActivityTable
              title="Verification Submissions"
              rows={verificationSubmissions}
              columns={[
                { key: 'molecule_name', label: 'Molecule' },
                { key: 'permeability_result', label: 'Result' },
                { key: 'is_public', label: 'Visibility', render: (row) => row.is_public ? 'Public' : 'Private' },
                { key: 'progress_status', label: 'Progress', render: (row) => <VerificationProgressBadge submission={row} /> },
                { key: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
                {
                  key: 'edit',
                  label: '',
                  render: (row) => row.id ? (
                    <Link
                      href={`/verify-data/edit?id=${row.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      aria-label={`Edit verification submission for ${row.molecule_name || 'molecule'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  ) : '-',
                },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  )
}
