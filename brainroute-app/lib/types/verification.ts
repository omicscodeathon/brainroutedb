/**
 * Verification Types and Interfaces
 * Handles all types for the verification system
 */

export type VerificationStatus = 'br_training' | 'br_user_verified' | 'predicted'

export type VerificationProgress =
  | 'submitted'
  | 'in_review'
  | 'accepted'
  | 'denied'
  | 'more_information_requested'

export const VERIFICATION_PROGRESS_LABELS: Record<VerificationProgress, string> = {
  submitted: 'Submitted',
  in_review: 'In Review',
  accepted: 'Accepted',
  denied: 'Denied',
  more_information_requested: 'More Information Requested',
}

export function getVerificationProgress(
  submission: Pick<VerificationSubmission, 'progress_status' | 'verified_by_admin'>
): VerificationProgress {
  if (submission.progress_status) return submission.progress_status
  return submission.verified_by_admin ? 'accepted' : 'submitted'
}

export interface VerificationSubmission {
  id?: string
  molecule_id?: number // If verifying existing molecule
  molecule_name: string // SMILES or compound name
  smiles?: string // If submitting new molecule
  molecule_information?: string
  paper_doi: string // Required - link to paper
  lab_name?: string
  institution_name: string
  experiment_description: string
  experiment_data: string // JSON or description of results
  technique_used: string // e.g., "MDCK cells", "Caco-2", "In silico"
  permeability_result: 'permeable' | 'nonpermeable' | 'moderate' // User's finding
  file_urls?: string[] // URLs to uploaded files in Supabase Storage
  user_id?: string | null
  is_public?: boolean | null
  progress_status?: VerificationProgress
  submitted_by: string // Email or name
  submitted_at?: string
  verified_by_admin?: boolean
  verification_notes?: string
  created_at?: string
  updated_at?: string
}

export interface VerificationFilter {
  status: VerificationStatus | 'all'
  technique?: string
  institution?: string
  search?: string
}
