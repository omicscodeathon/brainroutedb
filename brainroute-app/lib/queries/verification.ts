/**
 * Verification Database Queries
 * Handles all verification-related database operations
 */

import { supabase } from '../supabase/client'
import type {
  VerificationSubmission,
  VerificationFilter,
  VerificationProgress,
} from '../types/verification'

const SUBMISSIONS_TABLE = 'verification_submissions'

function buildEditableSubmissionPayload(submission: Partial<VerificationSubmission>) {
  return {
    molecule_id: submission.molecule_id,
    molecule_name: submission.molecule_name,
    smiles: submission.smiles,
    molecule_information: submission.molecule_information,
    paper_doi: submission.paper_doi,
    lab_name: submission.lab_name,
    institution_name: submission.institution_name,
    experiment_description: submission.experiment_description,
    experiment_data: submission.experiment_data,
    technique_used: submission.technique_used,
    permeability_result: submission.permeability_result,
    file_urls: submission.file_urls,
    submitted_by: submission.submitted_by,
    is_public: submission.is_public,
  }
}

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
          ...buildEditableSubmissionPayload(submission),
          user_id: submission.user_id,
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
 * Update an existing verification submission owned by the signed-in user.
 * Progress status is intentionally not updated here; it is managed during review.
 */
export async function updateVerificationSubmission(
  submissionId: string,
  userId: string,
  submission: Partial<VerificationSubmission>
): Promise<{ error: null } | { error: string }> {
  try {
    const {
      error,
    } = await supabase
      .from(SUBMISSIONS_TABLE)
      .update({
        ...buildEditableSubmissionPayload(submission),
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .eq('user_id', userId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[updateVerificationSubmission] Failed to update verification:', {
      message: errorMsg,
      fullError: error,
    })
    return { error: errorMsg }
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
      query = query.or(
        `molecule_name.ilike.%${filters.search}%,smiles.ilike.%${filters.search}%,molecule_information.ilike.%${filters.search}%,lab_name.ilike.%${filters.search}%`
      )
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
      .eq('progress_status', 'accepted')

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
        progress_status: verified ? 'accepted' : 'submitted',
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

export async function updateVerificationProgress(
  submissionId: string,
  progressStatus: VerificationProgress,
  notes?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .update({
        progress_status: progressStatus,
        verified_by_admin: progressStatus === 'accepted',
        verification_notes: notes || null,
      })
      .eq('id', submissionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Failed to update verification progress:', error)
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

    const { data: molecule } = await supabase
      .from('molecules')
      .select('tags')
      .eq('id', moleculeId)
      .single()

    const currentTags = Array.isArray(molecule?.tags) ? molecule.tags : []
    const tags = Array.from(new Set([...currentTags, 'br_verified']))

    // Update molecules table verification tag
    const { error: moleculeError } = await supabase
      .from('molecules')
      .update({ tags })
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
