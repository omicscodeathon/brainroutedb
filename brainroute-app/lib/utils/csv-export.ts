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
    'polarity_bin',
    'lipophilicity_bin',
    'size_bin',
    'lipinski_pass',
    'veber_pass',
    'egan_pass',
    'ghose_pass',
    'pains_flag',
  ]

  // Create header row
  const header = columns.join(',')

  // Create data rows
  const rows = molecules.map(molecule => {
    return columns.map(col => {
      const value = (molecule as any)[col]
      
      // Handle CSV escaping for strings with commas or quotes
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        return ''
      }

      return String(value)
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
