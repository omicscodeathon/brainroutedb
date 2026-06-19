import type { Molecule } from '@/lib/types'

export type BbbClass = 'BBB+' | 'BBB-' | 'Unknown'

export interface DatasetSummary {
  total: number
  bbbPositive: number
  bbbNegative: number
  unknown: number
  averageTpsa: number | null
  averageLogp: number | null
  averageLogd: number | null
  averageMw: number | null
  averageCnsMpo: number | null
  averagePredictionConfidence: number | null
  lipinskiPercent: number
  veberPercent: number
  eganPercent: number
  ghosePercent: number
  painsFlaggedPercent: number
  painsClearPercent: number
  mostCommonBbbTag: string
}

export interface PropertyConfig {
  key: keyof Molecule
  label: string
}

export const numericPropertyOptions: PropertyConfig[] = [
  { key: 'mw', label: 'MW' },
  { key: 'tpsa', label: 'TPSA' },
  { key: 'logp', label: 'LogP' },
  { key: 'logd', label: 'LogD' },
  { key: 'hbd', label: 'HBD' },
  { key: 'hba', label: 'HBA' },
  { key: 'rotatable_bonds', label: 'Rotatable bonds' },
  { key: 'ring_count', label: 'Ring count' },
  { key: 'cns_mpo', label: 'CNS MPO' },
  { key: 'prediction_confidence', label: 'Prediction confidence' },
]

export function classifyBbbTag(value: string | null | undefined): BbbClass {
  const normalized = String(value || '').toLowerCase()

  if (normalized.includes('positive') || normalized.includes('bbb+')) return 'BBB+'
  if (normalized.includes('negative') || normalized.includes('bbb-')) return 'BBB-'
  return 'Unknown'
}

export function formatMetric(value: number | null, digits: number = 1): string {
  if (value === null || Number.isNaN(value)) return 'N/A'
  return value.toFixed(digits)
}

export function getNumericValue(molecule: Molecule, key: keyof Molecule): number | null {
  const value = molecule[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function average(values: Array<number | null>): number | null {
  const validValues = values.filter((value): value is number => value !== null)
  if (validValues.length === 0) return null
  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length
}

function percent(count: number, total: number): number {
  if (total === 0) return 0
  return (count / total) * 100
}

export function computeDatasetSummary(molecules: Molecule[]): DatasetSummary {
  const total = molecules.length
  const bbbPositive = molecules.filter((molecule) => classifyBbbTag(molecule.bbb_tag) === 'BBB+').length
  const bbbNegative = molecules.filter((molecule) => classifyBbbTag(molecule.bbb_tag) === 'BBB-').length
  const unknown = total - bbbPositive - bbbNegative
  const tagCounts = molecules.reduce<Record<string, number>>((counts, molecule) => {
    const tag = molecule.bbb_tag || 'Unknown'
    counts[tag] = (counts[tag] || 0) + 1
    return counts
  }, {})
  const mostCommonBbbTag =
    Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  return {
    total,
    bbbPositive,
    bbbNegative,
    unknown,
    averageTpsa: average(molecules.map((molecule) => molecule.tpsa)),
    averageLogp: average(molecules.map((molecule) => molecule.logp)),
    averageLogd: average(molecules.map((molecule) => molecule.logd)),
    averageMw: average(molecules.map((molecule) => molecule.mw)),
    averageCnsMpo: average(molecules.map((molecule) => molecule.cns_mpo)),
    averagePredictionConfidence: average(
      molecules.map((molecule) => molecule.prediction_confidence)
    ),
    lipinskiPercent: percent(molecules.filter((molecule) => molecule.lipinski_pass).length, total),
    veberPercent: percent(molecules.filter((molecule) => molecule.veber_pass).length, total),
    eganPercent: percent(molecules.filter((molecule) => molecule.egan_pass).length, total),
    ghosePercent: percent(molecules.filter((molecule) => molecule.ghose_pass).length, total),
    painsFlaggedPercent: percent(molecules.filter((molecule) => molecule.pains_flag).length, total),
    painsClearPercent: percent(
      molecules.filter((molecule) => molecule.pains_flag === false).length,
      total
    ),
    mostCommonBbbTag,
  }
}

export function createHistogramData(
  molecules: Molecule[],
  key: keyof Molecule,
  bins: number = 12
) {
  const values = molecules
    .map((molecule) => getNumericValue(molecule, key))
    .filter((value): value is number => value !== null)

  if (values.length === 0) return []

  const min = Math.min(...values)
  const max = Math.max(...values)
  const width = max === min ? 1 : (max - min) / bins
  const buckets = Array.from({ length: bins }, (_, index) => ({
    name:
      max === min
        ? min.toFixed(1)
        : `${(min + index * width).toFixed(1)}-${(min + (index + 1) * width).toFixed(1)}`,
    count: 0,
  }))

  values.forEach((value) => {
    const index = Math.min(Math.floor((value - min) / width), bins - 1)
    buckets[index].count += 1
  })

  return buckets
}

export function getMissingKeyValues(molecules: Molecule[]) {
  const requiredFields: Array<keyof Molecule> = [
    'bbb_tag',
    'tpsa',
    'logp',
    'mw',
    'cns_mpo',
    'prediction_confidence',
  ]

  return molecules
    .map((molecule) => ({
      molecule,
      missing: requiredFields.filter((field) => {
        const value = molecule[field]
        return value === null || value === undefined || value === ''
      }),
    }))
    .filter((item) => item.missing.length > 0)
}

export function getRuleViolationCount(molecule: Molecule): number {
  return [
    molecule.lipinski_pass === false,
    molecule.veber_pass === false,
    molecule.egan_pass === false,
    molecule.ghose_pass === false,
    molecule.pains_flag === true,
  ].filter(Boolean).length
}

export function buildMoleculeInterpretation(molecule: Molecule, summary?: DatasetSummary): string[] {
  const notes: string[] = []

  if (molecule.tpsa !== null && molecule.tpsa !== undefined) {
    if (molecule.tpsa <= 90) {
      notes.push('This molecule has BBB-favorable TPSA for passive permeability screening.')
    } else if (molecule.tpsa > 120) {
      notes.push('This molecule has high polarity, which may reduce passive BBB permeability.')
    }
  }

  if (molecule.hbd !== null && molecule.hbd !== undefined && molecule.hbd <= 2) {
    notes.push('The hydrogen-bond donor count is relatively favorable for CNS screening.')
  }

  if (
    molecule.cns_mpo !== null &&
    molecule.cns_mpo !== undefined &&
    molecule.cns_mpo >= 4
  ) {
    notes.push('The CNS MPO score is comparatively favorable, but it should be interpreted as a screening aid.')
  }

  if (
    molecule.prediction_confidence !== null &&
    molecule.prediction_confidence !== undefined &&
    molecule.prediction_confidence < 60
  ) {
    notes.push('Prediction confidence is low, so the BBB label should be interpreted cautiously.')
  }

  if (getRuleViolationCount(molecule) > 0) {
    notes.push('This molecule has one or more drug-likeness or PAINS rule concerns.')
  }

  if (
    summary?.averageCnsMpo !== null &&
    summary?.averageCnsMpo !== undefined &&
    molecule.cns_mpo !== null &&
    molecule.cns_mpo !== undefined &&
    molecule.cns_mpo > summary.averageCnsMpo + 1
  ) {
    notes.push('The CNS MPO score is above the selected dataset average.')
  }

  if (notes.length === 0) {
    notes.push('This record does not show strong rule-based signals from the currently available metrics.')
  }

  return notes
}
