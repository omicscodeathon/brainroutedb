'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Header } from '@/src/components/Header'
import { LoginPanel } from '@/src/components/auth/LoginPanel'
import { useAuth } from '@/src/components/auth/AuthProvider'
import { VerificationForm } from '@/src/components/verification/VerificationForm'
import { getVerificationDetails } from '@/lib/queries/verification'
import type { VerificationSubmission } from '@/lib/types/verification'

export default function EditVerificationSubmissionPage() {
  const { user, isAuthReady, isLoggedIn } = useAuth()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [submission, setSubmission] = useState<VerificationSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSubmissionId(params.get('id'))
  }, [])

  useEffect(() => {
    const loadSubmission = async () => {
      if (!isAuthReady) return

      if (!isLoggedIn || !user?.id) {
        setIsLoading(false)
        return
      }

      if (!submissionId) {
        setError('No verification submission was selected for editing.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const data = await getVerificationDetails(submissionId)

      if (!data || data.user_id !== user.id) {
        setSubmission(null)
        setError('This verification submission was not found for your account.')
        setIsLoading(false)
        return
      }

      setSubmission(data)
      setIsLoading(false)
    }

    loadSubmission()
  }, [isAuthReady, isLoggedIn, submissionId, user?.id])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/account" className="text-sm font-bold text-blue-700 hover:text-blue-900">
            Back to My Profile
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Edit Verification Submission
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Update your submission details, attachments, and public/private visibility.
          </p>
        </div>

        {!isAuthReady && (
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Loading account...</p>
          </section>
        )}

        {isAuthReady && !isLoggedIn && (
          <div className="max-w-xl">
            <LoginPanel />
          </div>
        )}

        {isAuthReady && isLoggedIn && isLoading && (
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Loading submission...</p>
          </section>
        )}

        {isAuthReady && isLoggedIn && !isLoading && error && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </section>
        )}

        {isAuthReady && isLoggedIn && !isLoading && submission && (
          <VerificationForm mode="edit" initialSubmission={submission} />
        )}
      </main>
    </div>
  )
}
