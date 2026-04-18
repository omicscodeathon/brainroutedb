/**
 * Verify Data Page
 * Platform for users to submit and verify molecule data
 * Similar structure to "Know Your Data" page
 */

'use client'

import React, { useState } from 'react'
import { Header } from '@/src/components/Header'
import { VerificationForm } from '@/src/components/verification/VerificationForm'
import { VerificationList } from '@/src/components/verification/VerificationList'
import { getVerificationStats } from '@/lib/queries/verification'

export default function VerifyDataPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'review'>('submit')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 })

  // Load stats on mount
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getVerificationStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }
    loadStats()
  }, [refreshTrigger])

  // Handle successful submission
  const handleSubmitSuccess = () => {
    // Refresh the review list and stats
    setRefreshTrigger(prev => prev + 1)
    // Switch to review tab to show the submission
    setActiveTab('review')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Verify BBB Permeability Data</h1>
          <p className="mt-2 text-gray-600">
            Submit your experimental results and verify existing molecules in our database
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Submissions */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-sm text-gray-600 font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-2">All verification submissions</p>
          </div>

          {/* Verified */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-sm text-gray-600 font-medium">Verified</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.verified}</p>
            <p className="text-xs text-gray-500 mt-2">Approved by admin team</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <p className="text-sm text-gray-600 font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting admin verification</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8 border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition border-b-2 ${
                activeTab === 'submit'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Submit New Data
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition border-b-2 ${
                activeTab === 'review'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              View Submissions ({stats.total})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'submit' ? (
            <VerificationForm onSuccess={handleSubmitSuccess} />
          ) : (
            <VerificationList refreshTrigger={refreshTrigger} />
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Why Verify */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Verify Data?</h2>
              <p className="text-gray-600 mb-4">
                Your experimental data helps us build better predictive models for BBB permeability.
                Verified molecules are marked in the database and weighted more heavily in analysis.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  In vitro and in vivo data welcome
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  Different techniques supported (MDCK, Caco-2, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  Verified data improves model accuracy
                </li>
              </ul>
            </div>

            {/* Data Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Categories</h2>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">br_training</p>
                  <p className="text-xs text-gray-600 mt-1">Original training dataset (PADEL)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">br_user_verified</p>
                  <p className="text-xs text-gray-600 mt-1">Verified by research groups</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">predicted</p>
                  <p className="text-xs text-gray-600 mt-1">Model predictions (future)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
