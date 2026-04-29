/**
 * Simple JavaScript client for querying your Supabase molecules database
 * Use this in your GitHub Pages frontend or any web app
 * 
 * Install: npm install @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials (get from dashboard)
const SUPABASE_URL = 'https://jmhbbewaganrynxoaybh.supabase.co'
const SUPABASE_KEY = 'sb_publishable_kCqIWFbvQ87W02HrNcRbWA_IqSYZ7HO'

// Initialize client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get all molecules that pass Lipinski's rule
 */
export async function getLipinskiCompliant(limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, mw, logp, profile_json')
    .eq('lipinski_pass', true)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get drug candidates (pass all major rules)
 */
export async function getDrugCandidates(limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, mw, profile_json')
    .eq('lipinski_pass', true)
    .eq('veber_pass', true)
    .eq('egan_pass', true)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get small molecules
 */
export async function getSmallMolecules(maxMW = 300, limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, mw, size_bin')
    .lte('mw', maxMW)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get aromatic molecules
 */
export async function getAromaticMolecules(limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, ring_count, aromatic')
    .eq('aromatic', true)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get molecules flagged by PAINS filters
 */
export async function getPAINSFlaggedMolecules(limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, pains_flag, profile_json')
    .eq('pains_flag', true)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get molecules by polarity
 */
export async function getMoleculesByPolarity(polarityBin, limit = 100) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles, tpsa, polarity_bin')
    .eq('polarity_bin', polarityBin)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Advanced query with multiple filters
 */
export async function advancedQuery(filters = {}, limit = 100) {
  let query = supabase.from('molecules').select('*')
  
  // Apply filters
  if (filters.lipinski_pass !== undefined)
    query = query.eq('lipinski_pass', filters.lipinski_pass)
  
  if (filters.size_bin)
    query = query.eq('size_bin', filters.size_bin)
  
  if (filters.polarity_bin)
    query = query.eq('polarity_bin', filters.polarity_bin)
  
  if (filters.pains_flag !== undefined)
    query = query.eq('pains_flag', filters.pains_flag)
  
  if (filters.aromatic !== undefined)
    query = query.eq('aromatic', filters.aromatic)
  
  if (filters.max_mw)
    query = query.lte('mw', filters.max_mw)
  
  if (filters.min_mw)
    query = query.gte('mw', filters.min_mw)
  
  const { data, error } = await query.limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

/**
 * Get a single molecule by ID
 */
export async function getMoleculeById(id) {
  const { data, error } = await supabase
    .from('molecules')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) console.error('Query error:', error)
  return data
}

/**
 * Search molecules by name
 */
export async function searchMoleculesByName(name, limit = 50) {
  const { data, error } = await supabase
    .from('molecules')
    .select('id, name, smiles')
    .ilike('name', `%${name}%`)
    .limit(limit)
  
  if (error) console.error('Query error:', error)
  return data || []
}

// ============================================
// EXAMPLE USAGE
// ============================================

async function exampleUsage() {
  console.log('Querying Supabase molecules database...\n')
  
  // Get drug candidates
  const candidates = await getDrugCandidates(10)
  console.log('Drug candidates:', candidates)
  
  // Get small molecules
  const small = await getSmallMolecules(300, 10)
  console.log('Small molecules:', small)
  
  // Advanced query
  const filtered = await advancedQuery({
    size_bin: 'medium',
    lipinski_pass: true,
    pains_flag: false
  }, 20)
  console.log('Medium-sized drug candidates:', filtered)
}

// Uncomment to test:
// exampleUsage()
