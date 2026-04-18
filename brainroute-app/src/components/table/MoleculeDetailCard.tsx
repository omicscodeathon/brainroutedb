/**
 * Molecule Detail Card Component
 * Modal card displaying molecule information
 */

'use client'

import React from 'react'
import { X, Expand } from 'lucide-react'
import type { Molecule } from '@/lib/types'
import Link from 'next/link'

interface MoleculeDetailCardProps {
  molecule: Molecule | null
  onClose: () => void
}

export function MoleculeDetailCard({ molecule, onClose }: MoleculeDetailCardProps) {
  if (!molecule) return null

  const profile = molecule.profile_json as Record<string, any> || {}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{molecule.name}</h2>
          <div className="flex gap-2">
            <Link
              href={`/molecule/${molecule.id}`}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Expand className="h-4 w-4" />
              Expand
            </Link>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* SMILES */}
          <div>
            <label className="text-sm font-semibold text-gray-700">SMILES</label>
            <p className="mt-1 text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded border border-gray-200 break-all">
              {molecule.smiles}
            </p>
          </div>

          {/* Physicochemical Properties */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Physicochemical Properties</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Molecular Weight (MW)', value: molecule.mw, unit: 'g/mol' },
                { label: 'LogP', value: molecule.logp, unit: '' },
                { label: 'TPSA', value: molecule.tpsa, unit: 'Ų' },
                { label: 'H-Bond Donors (HBD)', value: molecule.hbd, unit: '' },
                { label: 'H-Bond Acceptors (HBA)', value: molecule.hba, unit: '' },
                { label: 'Rotatable Bonds', value: molecule.rotatable_bonds, unit: '' },
                { label: 'Ring Count', value: molecule.ring_count, unit: '' },
                { label: 'Molar Refractivity', value: molecule.molar_refractivity, unit: '' },
              ].map(({ label, value, unit }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {value !== null && value !== undefined ? `${Number(value).toFixed(2)} ${unit}` : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Structural Properties */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Structural Properties</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Aromatic', value: molecule.aromatic },
                { label: 'Peptide-like', value: molecule.peptide_like },
                { label: 'Lipid-like', value: molecule.lipid_like },
                { label: 'Contains Heterocycles', value: molecule.heterocycle_present },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {value === null || value === undefined ? '—' : value ? 'Yes' : 'No'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Classification Bins */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Classification</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Polarity', value: molecule.polarity_bin },
                { label: 'Lipophilicity', value: molecule.lipophilicity_bin },
                { label: 'Size', value: molecule.size_bin },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Drug Rule Compliance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Drug Rule Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Lipinski's Rule of Five", value: molecule.lipinski_pass },
                { label: "Veber's Rule", value: molecule.veber_pass },
                { label: "Egan's Rule", value: molecule.egan_pass },
                { label: "Ghose's Rule", value: molecule.ghose_pass },
                { label: 'PAINS Alert', value: molecule.pains_flag, invert: true },
              ].map(({ label, value, invert }) => {
                const status = invert 
                  ? value ? 'Flagged' : 'Pass'
                  : value ? 'Pass' : 'Fail'
                const color = status === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                return (
                  <div key={label}>
                    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                    <p className={`mt-1 text-sm font-semibold px-3 py-2 rounded border ${color}`}>
                      {status}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Download Profile JSON */}
          {Object.keys(profile).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Data</h3>
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
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Download Profile JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
