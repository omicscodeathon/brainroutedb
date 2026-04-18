/**
 * Verification Database Queries
 * Handles all verification-related database operations
 */

import { supabase } from '../supabase/client'
import type { VerificationSubmission, VerificationFilter } from '../types/verification'

const SUBMISSIONS_TABLE = 'verification_submissions'

/**
 * Submit a new verification entry
 */
export async function submitVerification(
  submission: VerificationSubmission
): Promise<{ id: string; error: null } | { id: null; error: string }> {
  try {
    console.log('[submitVerification] Inserting submission:', {
      ...submission,
      file_urls: `[Array of ${Array.isArray(submission.file_urls) ? submission.file_urls.length : 0} items]`
    })

    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .insert([
        {
          ...submission,
          created_at: new Date().toISOString(),
          verified_by_admin: false,
        },
      ])
      .select('id')
      .single()

    if (error) {
      console.error('[submitVerification] Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      })
      throw error
    }

    console.log('[submitVerification] Insert successful, ID:', data.id)
    return { id: data.id, error: null }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[submitVerification] Failed to submit verification:', {
      message: errorMsg,
      fullError: error
    })
    return { id: null, error: errorMsg }
  }
}

/**
 * Get all verification submissions with filters
 */
export async function getVerifications(
  filters?: VerificationFilter,
  page: number = 1,
  pageSize: number = 15
): Promise<{ data: VerificationSubmission[]; total: number }> {
  try {
    let query = supabase.from(SUBMISSIONS_TABLE).select('*', { count: 'exact' })

    // Apply filters
    if (filters?.search) {
      query = query.or(`molecule_name.ilike.%${filters.search}%,lab_name.ilike.%${filters.search}%`)
    }

    if (filters?.technique) {
      query = query.eq('technique_used', filters.technique)
    }

    if (filters?.institution) {
      query = query.eq('institution_name', filters.institution)
    }

    // Apply pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    query = query.order('created_at', { ascending: false }).range(start, end)

    const { data, count, error } = await query

    if (error) throw error

    return { data: (data as VerificationSubmission[]) || [], total: count || 0 }
  } catch (error) {
    console.error('Failed to get verifications:', error)
    return { data: [], total: 0 }
  }
}

/**
 * Get verification count by status
 */
export async function getVerificationStats(): Promise<{
  total: number
  verified: number
  pending: number
}> {
  try {
    const { count: totalCount } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select('id', { count: 'exact', head: true })

    const { count: verifiedCount } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('verified_by_admin', true)

    return {
      total: totalCount || 0,
      verified: verifiedCount || 0,
      pending: (totalCount || 0) - (verifiedCount || 0),
    }
  } catch (error) {
    console.error('Failed to get verification stats:', error)
    return { total: 0, verified: 0, pending: 0 }
  }
}

/**
 * Update verification status (admin only)
 */
export async function updateVerificationStatus(
  submissionId: string,
  verified: boolean,
  notes?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .update({
        verified_by_admin: verified,
        verification_notes: notes || null,
      })
      .eq('id', submissionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Failed to update verification status:', error)
    return false
  }
}

/**
 * Link verified molecule to molecules table
 * This updates the molecules table to mark it as user_verified
 */
export async function linkVerificationToMolecule(
  submissionId: string,
  moleculeId: number
): Promise<boolean> {
  try {
    // Update verification submission with molecule_id
    const { error: updateError } = await supabase
      .from(SUBMISSIONS_TABLE)
      .update({ molecule_id: moleculeId })
      .eq('id', submissionId)

    if (updateError) throw updateError

    // Update molecules table verification status
    const { error: moleculeError } = await supabase
      .from('molecules')
      .update({ verification: 'br_user_verified' })
      .eq('id', moleculeId)

    if (moleculeError) throw moleculeError

    return true
  } catch (error) {
    console.error('Failed to link verification to molecule:', error)
    return false
  }
}

/**
 * Get verification details for a specific submission
 */
export async function getVerificationDetails(
  submissionId: string
): Promise<VerificationSubmission | null> {
  try {
    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select('*')
      .eq('id', submissionId)
      .single()

    if (error) throw error
    return (data as VerificationSubmission) || null
  } catch (error) {
    console.error('Failed to get verification details:', error)
    return null
  }
}
