'use client'

import { useEffect, useState } from 'react'
import type { FilterState, Molecule } from '@/lib/types'
import { getFilteredMoleculesForVisualization } from '@/lib/queries/brainroute'

export interface UseFilteredMoleculesResult {
  molecules: Molecule[]
  total: number
  isLoading: boolean
  error: string | null
  isLimited: boolean
  limit: number
}

export function useFilteredMolecules(
  filters: FilterState,
  limit: number = 2000
): UseFilteredMoleculesResult {
  const [molecules, setMolecules] = useState<Molecule[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadMolecules() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getFilteredMoleculesForVisualization(filters, limit)
        if (!isMounted) return

        setMolecules(result.data)
        setTotal(result.total)
      } catch (err) {
        console.error('Failed to load filtered molecules:', err)
        if (isMounted) {
          setMolecules([])
          setTotal(0)
          setError('Failed to load filtered molecules.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMolecules()

    return () => {
      isMounted = false
    }
  }, [filters, limit])

  return {
    molecules,
    total,
    isLoading,
    error,
    isLimited: total > molecules.length,
    limit,
  }
}
