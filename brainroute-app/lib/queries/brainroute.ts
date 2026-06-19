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
import type { BrainRoutePortalStats } from '@/src/data/portalStats'

const TABLE_NAME = 'molecules'

function normalizeSearchTerm(value: any): string {
  return String(value || '')
    .replace(/[,%]/g, ' ')
    .trim()
}

function applyPortalFilters(query: any, filters: FilterState) {
  if (filters.bbb_tag) {
    query = query.ilike('bbb_tag', `%${normalizeSearchTerm(filters.bbb_tag)}%`)
  }

  if (filters.tag) {
    query = query.contains('tags', [filters.tag])
  }

  if (Array.isArray(filters.tags)) {
    filters.tags.forEach((tag: string) => {
      query = query.contains('tags', [tag])
    })
  }

  if (filters.drug_like) {
    query = query
      .eq('lipinski_pass', true)
      .eq('veber_pass', true)
      .eq('egan_pass', true)
      .eq('ghose_pass', true)
      .eq('pains_flag', false)
  }

  return query
}

function applyNumericRangeFilters(query: any, filters: FilterState) {
  const ranges = [
    ['mw', 'mw_min', 'mw_max'],
    ['logp', 'logp_min', 'logp_max'],
    ['logd', 'logd_min', 'logd_max'],
    ['tpsa', 'tpsa_min', 'tpsa_max'],
    ['cns_mpo', 'cns_mpo_min', 'cns_mpo_max'],
    ['prediction_confidence', 'prediction_confidence_min', 'prediction_confidence_max'],
    ['hbd', 'hbd_min', 'hbd_max'],
    ['hba', 'hba_min', 'hba_max'],
    ['rotatable_bonds', 'rotatable_bonds_min', 'rotatable_bonds_max'],
    ['ring_count', 'ring_count_min', 'ring_count_max'],
  ]

  ranges.forEach(([column, minKey, maxKey]) => {
    const minValue = filters[minKey]
    const maxValue = filters[maxKey]

    if (minValue !== undefined && minValue !== '') {
      query = query.gte(column, minValue)
    }

    if (maxValue !== undefined && maxValue !== '') {
      query = query.lte(column, maxValue)
    }
  })

  return query
}

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
      const searchTerm = normalizeSearchTerm(filters.search)
      query = query.or(
        `name.ilike.%${searchTerm}%,smiles.ilike.%${searchTerm}%,bbb_tag.ilike.%${searchTerm}%`
      )
    }
    if (filters.search_smiles) {
      query = query.ilike('smiles', `%${filters.search_smiles}%`)
    }

    // Apply categorical filters
    if (filters.tpsa_bin && filters.tpsa_bin !== 'all') {
      query = query.eq('tpsa_bin', filters.tpsa_bin)
    }

    if (filters.logp_bin && filters.logp_bin !== 'all') {
      query = query.eq('logp_bin', filters.logp_bin)
    }

    if (filters.mw_bin && filters.mw_bin !== 'all') {
      query = query.eq('mw_bin', filters.mw_bin)
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

    query = applyPortalFilters(query, filters)

    query = applyNumericRangeFilters(query, filters)

    // Apply sorting
    const orderBy = sortBy || 'id'
    const order = sortOrder !== 'asc'
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
      const searchTerm = normalizeSearchTerm(filters.search)
      query = query.or(
        `name.ilike.%${searchTerm}%,smiles.ilike.%${searchTerm}%,bbb_tag.ilike.%${searchTerm}%`
      )
    }
    if (filters.search_smiles) {
      query = query.ilike('smiles', `%${filters.search_smiles}%`)
    }

    if (filters.tpsa_bin && filters.tpsa_bin !== 'all') {
      query = query.eq('tpsa_bin', filters.tpsa_bin)
    }

    if (filters.logp_bin && filters.logp_bin !== 'all') {
      query = query.eq('logp_bin', filters.logp_bin)
    }

    if (filters.mw_bin && filters.mw_bin !== 'all') {
      query = query.eq('mw_bin', filters.mw_bin)
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

    query = applyPortalFilters(query, filters)

    query = applyNumericRangeFilters(query, filters)

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
      const searchTerm = normalizeSearchTerm(filters.search)
      query = query.or(
        `name.ilike.%${searchTerm}%,smiles.ilike.%${searchTerm}%,bbb_tag.ilike.%${searchTerm}%`
      )
    }
    if (filters.search_smiles) {
      query = query.ilike('smiles', `%${filters.search_smiles}%`)
    }

    if (filters.tpsa_bin && filters.tpsa_bin !== 'all') {
      query = query.eq('tpsa_bin', filters.tpsa_bin)
    }

    if (filters.logp_bin && filters.logp_bin !== 'all') {
      query = query.eq('logp_bin', filters.logp_bin)
    }

    if (filters.mw_bin && filters.mw_bin !== 'all') {
      query = query.eq('mw_bin', filters.mw_bin)
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

    if (filters.aromatic !== undefined && filters.aromatic !== null) {
      query = query.eq('aromatic', filters.aromatic)
    }

    if (filters.heterocycle_present !== undefined && filters.heterocycle_present !== null) {
      query = query.eq('heterocycle_present', filters.heterocycle_present)
    }

    query = applyPortalFilters(query, filters)

    query = applyNumericRangeFilters(query, filters)

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
 * Get filtered molecule rows for visualization and analysis pages.
 * Supabase commonly caps each request at 1,000 rows, so fetch in pages.
 */
export async function getFilteredMoleculesForVisualization(
  filters: FilterState,
  limit: number = 50000
): Promise<DataPreviewResponse> {
  const pageSize = 1000
  let page = 1
  let total = 0
  let rows: Molecule[] = []

  while (rows.length < limit) {
    const response = await queryMolecules(filters, 'id', 'desc', page, pageSize)

    if (page === 1) {
      total = response.total
    }

    rows = rows.concat(response.data)

    if (response.data.length === 0 || rows.length >= total) {
      break
    }

    page += 1
  }

  const data = rows.slice(0, limit)

  return {
    data,
    total,
    page: 1,
    pageSize: data.length,
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
      .select('tpsa_bin, logp_bin, mw_bin')

    if (error) throw error

    // Extract unique values
    const dataArray = (data as unknown as any[]) || []
    const tpsa = Array.from(new Set(dataArray.map(d => d.tpsa_bin).filter(Boolean)))
    const logp = Array.from(new Set(dataArray.map(d => d.logp_bin).filter(Boolean)))
    const mw = Array.from(new Set(dataArray.map(d => d.mw_bin).filter(Boolean)))

    return {
      tpsa_bin: tpsa.sort(),
      logp_bin: logp.sort(),
      mw_bin: mw.sort(),
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
      .select('mw, logp, logd, tpsa, cns_mpo, prediction_confidence, hbd, hba, rotatable_bonds, ring_count')

    if (error) throw error

    const molecules = (data as Molecule[]) || []

    const ranges: Record<string, { min: number; max: number }> = {}

    // Calculate ranges for numeric fields
    ;[
      'mw',
      'logp',
      'logd',
      'tpsa',
      'cns_mpo',
      'prediction_confidence',
      'hbd',
      'hba',
      'rotatable_bonds',
      'ring_count',
    ].forEach(field => {
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

/**
 * Get all molecule IDs for static generation
 * Used by generateStaticParams() in the molecule detail page
 */
export async function getAllMoleculeIds(): Promise<number[]> {
  try {
    const pageSize = 1000
    let start = 0
    let ids: number[] = []

    while (true) {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('id')
        .order('id', { ascending: true })
        .range(start, start + pageSize - 1)

      if (error) throw error

      const pageIds = (data || []).map((row: { id: number }) => row.id)
      ids = ids.concat(pageIds)

      if (pageIds.length < pageSize) {
        break
      }

      start += pageSize
    }

    return ids
  } catch (error) {
    console.error('Failed to get all molecule IDs:', error)
    return []
  }
}

async function getCountWithModifier(
  modifier?: (query: any) => any
): Promise<number> {
  let query: any = supabase.from(TABLE_NAME).select('id', { count: 'exact', head: true })

  if (modifier) {
    query = modifier(query)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count || 0
}

async function getTagCount(tag: string): Promise<number> {
  return getCountWithModifier((query) => query.contains('tags', [tag]))
}

/**
 * Get the count summary used by the portal home page.
 * Falls back in the component layer if a deployment lacks one of these columns.
 */
export async function getBrainRoutePortalStats(): Promise<BrainRoutePortalStats> {
  const [
    totalMolecules,
    bbbPositive,
    bbbNegative,
    trainingMolecules,
    predictedMolecules,
    verifiedMolecules,
  ] = await Promise.all([
    getCountWithModifier(),
    getCountWithModifier((query) => query.or('bbb_tag.ilike.%positive%,bbb_tag.eq.BBB+')),
    getCountWithModifier((query) => query.or('bbb_tag.ilike.%negative%,bbb_tag.eq.BBB-')),
    getTagCount('br_training'),
    getTagCount('br_predicted'),
    getTagCount('br_verified'),
  ])

  return {
    totalMolecules,
    bbbPositive,
    bbbNegative,
    trainingMolecules,
    predictedMolecules,
    verifiedMolecules,
  }
}

/**
 * Get the newest molecule for the home page. If created_at cannot be queried,
 * use the highest ID as a stable representative record.
 */
export async function getRecentlyAddedMolecule(): Promise<Molecule | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    return (data as Molecule) || null
  } catch (error) {
    console.error('Failed to fetch newest molecule by created_at:', error)
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    return (data as Molecule) || null
  } catch (error) {
    console.error('Failed to fetch representative molecule:', error)
    return null
  }
}
