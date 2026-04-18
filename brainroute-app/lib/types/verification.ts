/**
 * Verification Types and Interfaces
 * Handles all types for the verification system
 */

export type VerificationStatus = 'br_training' | 'br_user_verified' | 'predicted'

export interface VerificationSubmission {
  id?: string
  molecule_id?: number // If verifying existing molecule
  molecule_name?: string // If submitting new molecule
  smiles?: string // If submitting new molecule
  paper_doi?: string // Optional - link to paper
  lab_name: string
  institution_name: string
  experiment_description: string
  experiment_data: string // JSON or description of results
  technique_used: string // e.g., "MDCK cells", "Caco-2", "In silico"
  permeability_result: 'permeable' | 'nonpermeable' | 'moderate' // User's finding
  file_urls?: string[] // URLs to uploaded files in Supabase Storage
  submitted_by: string // Email or name
  submitted_at?: string
  verified_by_admin?: boolean
  verification_notes?: string
  created_at?: string
}

export interface VerificationFilter {
  status: VerificationStatus | 'all'
  technique?: string
  institution?: string
  search?: string
}
