/**
 * Data Insights Component
 * Shows summary statistics and visualizations
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { FilterState } from '@/lib/types'
import { getFilteredCount, getCategoricalStats } from '@/lib/queries/brainroute'
import { formatNumber } from '@/lib/utils'

interface DataInsightsProps {
  filters: FilterState
}

interface StatCard {
  label: string
  value: number | string
  color?: string
}

const COLORS = ['#0066cc', '#6366f1', '#10b981', '#f59e0b', '#ef4444']

export function DataInsights({ filters }: DataInsightsProps) {
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true)
      try {
        const [count, categoryStats] = await Promise.all([
          getFilteredCount(filters),
          getCategoricalStats(filters),
        ])

        setTotalCount(count)
        setStats(categoryStats)
      } catch (error) {
        console.error('Failed to load insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [filters])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500">Loading insights...</div>
        </div>
      </div>
    )
  }

  // Prepare drug rule compliance chart data
  const complianceData = [
    { name: 'Lipinski', value: stats.lipinski_compliant || 0 },
    { name: 'Veber', value: stats.veber_compliant || 0 },
    { name: 'Egan', value: stats.egan_compliant || 0 },
    { name: 'Ghose', value: stats.ghose_compliant || 0 },
  ]

  // Summary stats
  const statCards: StatCard[] = [
    {
      label: 'Total Molecules',
      value: formatNumber(totalCount),
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Lipinski Compliant',
      value: formatNumber(stats.lipinski_compliant || 0),
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'PAINS Flagged',
      value: formatNumber(stats.pains_flagged || 0),
      color: 'bg-red-50 text-red-700',
    },
    {
      label: 'Multi-Rule Pass',
      value: formatNumber(Math.min(stats.veber_compliant, stats.egan_compliant) || 0),
      color: 'bg-purple-50 text-purple-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600"
          >
            <p className="text-sm text-gray-600 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Drug Rule Compliance Chart */}
      {complianceData.some((d) => d.value > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Drug Rule Compliance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0066cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Compliance Summary */}
      {totalCount > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Compliance Summary
          </h3>
          <div className="space-y-3">
            {[
              {
                label: 'Lipinski Pass Rate',
                passed: stats.lipinski_compliant || 0,
              },
              {
                label: 'Veber Pass Rate',
                passed: stats.veber_compliant || 0,
              },
              {
                label: 'Egan Pass Rate',
                passed: stats.egan_compliant || 0,
              },
              {
                label: 'Ghose Pass Rate',
                passed: stats.ghose_compliant || 0,
              },
            ].map((item) => {
              const percentage =
                totalCount > 0 ? ((item.passed / totalCount) * 100).toFixed(1) : '0'
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="text-gray-700">{item.label}</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
