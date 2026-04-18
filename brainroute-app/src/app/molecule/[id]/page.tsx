/**
 * Individual Molecule Detail Page
 * Shows comprehensive information about a specific molecule
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { supabase } from '@/lib/supabase/client'
import type { Molecule } from '@/lib/types'

export default function MoleculeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const moleculeId = params.id as string
  
  const [molecule, setMolecule] = useState<Molecule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMolecule = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('molecules')
          .select('*')
          .eq('id', parseInt(moleculeId))
          .single()

        if (fetchError) throw fetchError
        setMolecule(data as Molecule)
      } catch (err) {
        console.error('Failed to fetch molecule:', err)
        setError('Failed to load molecule details')
      } finally {
        setLoading(false)
      }
    }

    if (moleculeId) {
      fetchMolecule()
    }
  }, [moleculeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <p className="text-gray-600">Loading molecule details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !molecule) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error || 'Molecule not found'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const profile = molecule.profile_json as Record<string, any> || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{molecule.name}</h1>
          <p className="mt-2 text-gray-600">Comprehensive molecule details and analysis</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* SMILES */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SMILES Notation</h2>
              <p className="text-sm text-gray-600 font-mono bg-gray-50 p-4 rounded border border-gray-200 break-all">
                {molecule.smiles}
              </p>
            </div>

            {/* Physicochemical Properties */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Physicochemical Properties</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'Molecular Weight', value: molecule.mw, unit: 'g/mol' },
                  { label: 'LogP', value: molecule.logp, unit: '' },
                  { label: 'TPSA', value: molecule.tpsa, unit: 'Ų' },
                  { label: 'H-Bond Donors', value: molecule.hbd, unit: '' },
                  { label: 'H-Bond Acceptors', value: molecule.hba, unit: '' },
                  { label: 'Rotatable Bonds', value: molecule.rotatable_bonds, unit: '' },
                  { label: 'Ring Count', value: molecule.ring_count, unit: '' },
                  { label: 'Molar Refractivity', value: molecule.molar_refractivity, unit: '' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {value !== null && value !== undefined ? Number(value).toFixed(2) : '—'}
                    </p>
                    {unit && <p className="text-xs text-gray-600">{unit}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Drug Rule Compliance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Drug Rule Compliance</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Lipinski's Rule of Five", value: molecule.lipinski_pass },
                  { label: "Veber's Rule", value: molecule.veber_pass },
                  { label: "Egan's Rule", value: molecule.egan_pass },
                  { label: "Ghose's Rule", value: molecule.ghose_pass },
                  { label: 'PAINS Alert', value: molecule.pains_flag, invert: true },
                ].map(({ label, value, invert }) => {
                  const status = invert 
                    ? value ? 'FLAGGED' : 'PASS'
                    : value ? 'PASS' : 'FAIL'
                  const bgColor = status === 'PASS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  const textColor = status === 'PASS' ? 'text-green-700' : 'text-red-700'
                  
                  return (
                    <div key={label} className={`${bgColor} border rounded-lg p-4`}>
                      <p className="text-xs font-medium text-gray-600 uppercase">{label}</p>
                      <p className={`mt-2 text-lg font-bold ${textColor}`}>{status}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Classification & AI Chat */}
          <div className="space-y-6">
            {/* Structural Classification */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Structural Properties</h2>
              <div className="space-y-3">
                {[
                  { label: 'Aromatic', value: molecule.aromatic },
                  { label: 'Peptide-like', value: molecule.peptide_like },
                  { label: 'Lipid-like', value: molecule.lipid_like },
                  { label: 'Contains Heterocycles', value: molecule.heterocycle_present },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      value === null || value === undefined ? 'bg-gray-100 text-gray-600' : 
                      value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {value === null || value === undefined ? '—' : value ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Classification Bins */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification Bins</h2>
              <div className="space-y-3">
                {[
                  { label: 'Polarity', value: molecule.polarity_bin },
                  { label: 'Lipophilicity', value: molecule.lipophilicity_bin },
                  { label: 'Size', value: molecule.size_bin },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                      {value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Out More About This Molecule</h2>
              <p className="text-sm text-gray-600 mb-4">
                Ask our AI assistant detailed questions about this molecule's properties, drug-likeness, and potential applications.
              </p>
              <button
                disabled
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Coming Soon
              </button>
              <p className="mt-2 text-xs text-gray-600">AI chat functionality coming in the next update</p>
            </div>
          </div>
        </div>

        {/* Download Profile JSON */}
        {Object.keys(profile).length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Data</h2>
            <p className="text-sm text-gray-600 mb-4">
              Download the complete profile data for this molecule in JSON format.
            </p>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(profile, null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `${molecule.name}_profile.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
              }}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Download Profile JSON
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
