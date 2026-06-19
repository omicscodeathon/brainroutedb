export interface PortalStatItem {
  id: string
  label: string
  value: number
  description: string
  href: string
  color: string
}

export interface BrainRoutePortalStats {
  totalMolecules: number
  bbbPositive: number
  bbbNegative: number
  trainingMolecules: number
  predictedMolecules: number
  verifiedMolecules: number
}

export const fallbackPortalStats: BrainRoutePortalStats = {
  totalMolecules: 3800,
  bbbPositive: 1660,
  bbbNegative: 2140,
  trainingMolecules: 3200,
  predictedMolecules: 520,
  verifiedMolecules: 80,
}

export function createPortalStatItems(stats: BrainRoutePortalStats): PortalStatItem[] {
  return [
    {
      id: 'total',
      label: 'Total molecules',
      value: stats.totalMolecules,
      description: 'All molecule records currently available in BrainRoute.',
      href: '/search',
      color: '#1d4ed8',
    },
    {
      id: 'bbb-positive',
      label: 'BBB positive',
      value: stats.bbbPositive,
      description: 'Molecules labeled or predicted as BBB permeable.',
      href: '/search?filter=bbb_positive',
      color: '#0891b2',
    },
    {
      id: 'bbb-negative',
      label: 'BBB negative',
      value: stats.bbbNegative,
      description: 'Molecules labeled or predicted as non-permeable across the BBB.',
      href: '/search?filter=bbb_negative',
      color: '#475569',
    },
    {
      id: 'training',
      label: 'Training molecules',
      value: stats.trainingMolecules,
      description: 'Records tagged as part of BrainRoute model training data.',
      href: '/search?filter=training',
      color: '#4f46e5',
    },
    {
      id: 'predicted',
      label: 'Predicted molecules',
      value: stats.predictedMolecules,
      description: 'Molecules added from the external prediction workflow.',
      href: '/search?filter=predicted',
      color: '#0f766e',
    },
    {
      id: 'verified',
      label: 'Verified molecules',
      value: stats.verifiedMolecules,
      description: 'Records reviewed through the verification workflow.',
      href: '/search?filter=verified',
      color: '#0284c7',
    },
  ]
}
