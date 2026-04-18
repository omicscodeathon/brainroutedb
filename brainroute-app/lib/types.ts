/**
 * Type definitions for BrainRoute
 * 
 * SCHEMA ADAPTATION NOTES:
 * - Replace 'molecules' with your actual table name if different
 * - Update column names to match your Supabase schema
 * - Adjust types based on your actual data types in Supabase
 */

/**
 * Main molecule record from the database
 * Maps to the 'molecules' table in Supabase
 */
export interface Molecule {
  id: number
  name: string
  smiles: string
  
  // Physicochemical properties
  tpsa: number | null
  logp: number | null
  mw: number | null
  hbd: number | null
  hba: number | null
  rotatable_bonds: number | null
  ring_count: number | null
  heterocycle_present: boolean | null
  molar_refractivity: number | null
  
  // Structural properties
  peptide_like: boolean | null
  lipid_like: boolean | null
  aromatic: boolean | null
  
  // Classification bins
  polarity_bin: string | null
  lipophilicity_bin: string | null
  size_bin: string | null
  
  // Drug candidacy flags
  lipinski_pass: boolean | null
  veber_pass: boolean | null
  egan_pass: boolean | null
  ghose_pass: boolean | null
  pains_flag: boolean | null
  
  // JSON profile
  profile_json: Record<string, any> | null
  
  // Metadata
  created_at: string
}

/**
 * Filter definitions for the left panel
 */
export interface FilterConfig {
  id: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'range' | 'checkbox'
  column: string // The database column this filters
  options?: Array<{ label: string; value: string | number | boolean }>
  min?: number
  max?: number
  step?: number
}

/**
 * Current filter state
 */
export interface FilterState {
  [key: string]: any // Maps filter ID to selected value(s)
}

/**
 * Query parameters for Supabase
 */
export interface QueryParams {
  filters: FilterState
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

/**
 * Data preview response
 */
export interface DataPreviewResponse {
  data: Molecule[]
  total: number
  page: number
  pageSize: number
}

/**
 * Insights/analytics data
 */
export interface InsightsData {
  totalRecords: number
  categoryCounts?: Record<string, number>
  numericStats?: Record<string, { min: number; max: number; avg: number }>
}

/**
 * AI Chat message
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  current: number
  pageSize: number
  total: number
  hasMore: boolean
}
