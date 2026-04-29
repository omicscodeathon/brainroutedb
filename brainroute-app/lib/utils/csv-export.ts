/**
 * CSV export utilities
 * Converts molecule data to CSV format for download
 */

import type { Molecule } from '../types'

/**
 * Convert molecules array to CSV string
 */
export function moleculesToCSV(molecules: Molecule[]): string {
  if (molecules.length === 0) {
    return 'No data to export'
  }

  // Define which columns to include in export
  const columns = [
    'id',
    'name',
    'smiles',
    'tpsa',
    'logp',
    'mw',
    'hbd',
    'hba',
    'rotatable_bonds',
    'ring_count',
    'heterocycle_present',
    'molar_refractivity',
    'peptide_like',
    'lipid_like',
    'aromatic',
    'tpsa_bin',
    'logp_bin',
    'mw_bin',
    'lipinski_pass',
    'veber_pass',
    'egan_pass',
    'ghose_pass',
    'pains_flag',
    'logd',
    'cns_mpo',
    'bbb_tag',
    'prediction_confidence',
    'tags',
    'profile_json',
    'created_at',
  ]

  // Create header row
  const header = columns.join(',')

  // Create data rows
  const rows = molecules.map(molecule => {
    return columns.map(col => {
      const value = (molecule as any)[col]
      
      const csvValue = Array.isArray(value)
        ? value.join('|')
        : typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value

      // Handle CSV escaping for strings with commas or quotes
      if (typeof csvValue === 'string') {
        if (csvValue.includes(',') || csvValue.includes('"') || csvValue.includes('\n')) {
          return `"${csvValue.replace(/"/g, '""')}"`
        }
        return csvValue
      }

      // Handle null/undefined
      if (csvValue === null || csvValue === undefined) {
        return ''
      }

      return String(csvValue)
    }).join(',')
  })

  return [header, ...rows].join('\n')
}

/**
 * Download CSV data
 */
export function downloadCSV(csvContent: string, filename: string = 'molecules.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export molecules as CSV file
 */
export function exportMoleculesAsCSV(
  molecules: Molecule[],
  filename: string = `molecules-${new Date().toISOString().split('T')[0]}.csv`
): void {
  const csv = moleculesToCSV(molecules)
  downloadCSV(csv, filename)
}
