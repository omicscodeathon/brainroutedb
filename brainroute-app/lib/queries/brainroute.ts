/**
 * Supabase query utilities for BrainRoute
 * 
 * SCHEMA ADAPTATION NOTES:
 * - Table name: 'molecules' (change if different in your Supabase project)
 * - Update column names in filters to match your actual schema
 * - Update aggregation columns based on your numeric fields
 * - Add/remove queries as needed for your specific use cases
 */

import { supabase } from '../supabase/client'
import type { Molecule, FilterState, DataPreviewResponse, InsightsData } from '../types'

const TABLE_NAME = 'molecules'

/**
 * Build and execute a filtered query to Supabase
 * Translates filter state into Supabase query clauses
 */
export async function queryMolecules(
  filters: FilterState,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 25
): Promise<DataPreviewResponse> {
  try {
    let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' })

    // Apply text search
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    // Apply categorical filters
    if (filters.polarity_bin && filters.polarity_bin !== 'all') {
      query = query.eq('polarity_bin', filters.polarity_bin)
    }

    if (filters.lipophilicity_bin && filters.lipophilicity_bin !== 'all') {
      query = query.eq('lipophilicity_bin', filters.lipophilicity_bin)
    }

    if (filters.size_bin && filters.size_bin !== 'all') {
      query = query.eq('size_bin', filters.size_bin)
    }

    // Apply drug rule filters
    if (filters.lipinski_pass !== undefined && filters.lipinski_pass !== null) {
      query = query.eq('lipinski_pass', filters.lipinski_pass)
    }

    if (filters.veber_pass !== undefined && filters.veber_pass !== null) {
      query = query.eq('veber_pass', filters.veber_pass)
    }

    if (filters.egan_pass !== undefined && filters.egan_pass !== null) {
      query = query.eq('egan_pass', filters.egan_pass)
    }

    if (filters.ghose_pass !== undefined && filters.ghose_pass !== null) {
      query = query.eq('ghose_pass', filters.ghose_pass)
    }

    if (filters.pains_flag !== undefined && filters.pains_flag !== null) {
      query = query.eq('pains_flag', filters.pains_flag)
    }

    if (filters.aromatic !== undefined && filters.aromatic !== null) {
      query = query.eq('aromatic', filters.aromatic)
    }

    if (filters.heterocycle_present !== undefined && filters.heterocycle_present !== null) {
      query = query.eq('heterocycle_present', filters.heterocycle_present)
    }

    // Apply numeric range filters
    if (filters.mw_min !== undefined) {
      query = query.gte('mw', filters.mw_min)
    }
    if (filters.mw_max !== undefined) {
      query = query.lte('mw', filters.mw_max)
    }

    if (filters.logp_min !== undefined) {
      query = query.gte('logp', filters.logp_min)
    }
    if (filters.logp_max !== undefined) {
      query = query.lte('logp', filters.logp_max)
    }

    if (filters.tpsa_min !== undefined) {
      query = query.gte('tpsa', filters.tpsa_min)
    }
    if (filters.tpsa_max !== undefined) {
      query = query.lte('tpsa', filters.tpsa_max)
    }

    // Apply sorting
    const orderBy = sortBy || 'id'
    const order = sortOrder === 'desc'
    query = query.order(orderBy, { ascending: !order })

    // Apply pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    query = query.range(start, end)

    const { data, count, error } = await query

    if (error) {
      console.error('Query error:', error)
      throw error
    }

    return {
      data: (data as Molecule[]) || [],
      total: count || 0,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('Failed to query molecules:', error)
    throw error
  }
}

/**
 * Get count of molecules matching filters
 * Useful for showing result summary without fetching all data
 */
export async function getFilteredCount(filters: FilterState): Promise<number> {
  try {
    let query = supabase.from(TABLE_NAME).select('id', { count: 'exact', head: true })

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters.polarity_bin && filters.polarity_bin !== 'all') {
      query = query.eq('polarity_bin', filters.polarity_bin)
    }

    if (filters.lipophilicity_bin && filters.lipophilicity_bin !== 'all') {
      query = query.eq('lipophilicity_bin', filters.lipophilicity_bin)
    }

    if (filters.size_bin && filters.size_bin !== 'all') {
      query = query.eq('size_bin', filters.size_bin)
    }

    // Apply drug rule filters
    if (filters.lipinski_pass !== undefined && filters.lipinski_pass !== null) {
      query = query.eq('lipinski_pass', filters.lipinski_pass)
    }

    if (filters.veber_pass !== undefined && filters.veber_pass !== null) {
      query = query.eq('veber_pass', filters.veber_pass)
    }

    if (filters.egan_pass !== undefined && filters.egan_pass !== null) {
      query = query.eq('egan_pass', filters.egan_pass)
    }

    if (filters.ghose_pass !== undefined && filters.ghose_pass !== null) {
      query = query.eq('ghose_pass', filters.ghose_pass)
    }

    if (filters.pains_flag !== undefined && filters.pains_flag !== null) {
      query = query.eq('pains_flag', filters.pains_flag)
    }

    // Range filters
    if (filters.mw_min !== undefined) {
      query = query.gte('mw', filters.mw_min)
    }
    if (filters.mw_max !== undefined) {
      query = query.lte('mw', filters.mw_max)
    }

    const { count, error } = await query

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to get filtered count:', error)
    return 0
  }
}

/**
 * Get all filtered data for download
 * Returns all matching records (be careful with large datasets)
 */
export async function getFilteredDataForExport(filters: FilterState): Promise<Molecule[]> {
  try {
    let query = supabase.from(TABLE_NAME).select('*')

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters.polarity_bin && filters.polarity_bin !== 'all') {
      query = query.eq('polarity_bin', filters.polarity_bin)
    }

    if (filters.lipophilicity_bin && filters.lipophilicity_bin !== 'all') {
      query = query.eq('lipophilicity_bin', filters.lipophilicity_bin)
    }

    if (filters.size_bin && filters.size_bin !== 'all') {
      query = query.eq('size_bin', filters.size_bin)
    }

    if (filters.lipinski_pass !== undefined && filters.lipinski_pass !== null) {
      query = query.eq('lipinski_pass', filters.lipinski_pass)
    }

    if (filters.veber_pass !== undefined && filters.veber_pass !== null) {
      query = query.eq('veber_pass', filters.veber_pass)
    }

    if (filters.egan_pass !== undefined && filters.egan_pass !== null) {
      query = query.eq('egan_pass', filters.egan_pass)
    }

    if (filters.ghose_pass !== undefined && filters.ghose_pass !== null) {
      query = query.eq('ghose_pass', filters.ghose_pass)
    }

    if (filters.pains_flag !== undefined && filters.pains_flag !== null) {
      query = query.eq('pains_flag', filters.pains_flag)
    }

    if (filters.mw_min !== undefined) {
      query = query.gte('mw', filters.mw_min)
    }
    if (filters.mw_max !== undefined) {
      query = query.lte('mw', filters.mw_max)
    }

    const { data, error } = await query

    if (error) throw error

    return (data as Molecule[]) || []
  } catch (error) {
    console.error('Failed to export data:', error)
    return []
  }
}

/**
 * Get categorical aggregations for insights
 */
export async function getCategoricalStats(filters: FilterState): Promise<Record<string, any>> {
  try {
    // Get counts for drug rules
    const [lipinski, veber, egan, ghose, pains] = await Promise.all([
      getFilteredCount({ ...filters, lipinski_pass: true }),
      getFilteredCount({ ...filters, veber_pass: true }),
      getFilteredCount({ ...filters, egan_pass: true }),
      getFilteredCount({ ...filters, ghose_pass: true }),
      getFilteredCount({ ...filters, pains_flag: true }),
    ])

    return {
      lipinski_compliant: lipinski,
      veber_compliant: veber,
      egan_compliant: egan,
      ghose_compliant: ghose,
      pains_flagged: pains,
    }
  } catch (error) {
    console.error('Failed to get categorical stats:', error)
    return {}
  }
}

/**
 * Get available filter options
 * Useful for populating dropdowns
 */
export async function getFilterOptions(): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('polarity_bin, lipophilicity_bin, size_bin')

    if (error) throw error

    // Extract unique values
    const dataArray = (data as unknown as any[]) || []
    const polarity = Array.from(new Set(dataArray.map(d => d.polarity_bin).filter(Boolean)))
    const lipophilicity = Array.from(new Set(dataArray.map(d => d.lipophilicity_bin).filter(Boolean)))
    const size = Array.from(new Set(dataArray.map(d => d.size_bin).filter(Boolean)))

    return {
      polarity_bin: polarity.sort(),
      lipophilicity_bin: lipophilicity.sort(),
      size_bin: size.sort(),
    }
  } catch (error) {
    console.error('Failed to get filter options:', error)
    return {}
  }
}

/**
 * Get numeric range information
 */
export async function getNumericRanges(): Promise<Record<string, { min: number; max: number }>> {
  try {
    // This is a simplified approach; for better performance, use Supabase functions or aggregation
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('mw, logp, tpsa, hbd, hba, rotatable_bonds')

    if (error) throw error

    const molecules = (data as Molecule[]) || []

    const ranges: Record<string, { min: number; max: number }> = {}

    // Calculate ranges for numeric fields
    ;['mw', 'logp', 'tpsa', 'hbd', 'hba', 'rotatable_bonds'].forEach(field => {
      const values = molecules
        .map((m: any) => m[field])
        .filter((v: any) => v !== null && v !== undefined) as number[]

      if (values.length > 0) {
        ranges[field] = {
          min: Math.min(...values),
          max: Math.max(...values),
        }
      }
    })

    return ranges
  } catch (error) {
    console.error('Failed to get numeric ranges:', error)
    return {}
  }
}
