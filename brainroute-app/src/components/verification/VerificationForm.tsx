/**
 * Verification Form Component
 * Form for submitting molecule verification data
 */

'use client'

import React, { useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'
import type { VerificationSubmission } from '@/lib/types/verification'
import { submitVerification } from '@/lib/queries/verification'
import { uploadVerificationFiles } from '@/lib/supabase/storage'

interface VerificationFormProps {
  onSuccess?: () => void
}

export function VerificationForm({ onSuccess }: VerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const [formData, setFormData] = useState<VerificationSubmission>({
    paper_doi: '',
    lab_name: '',
    institution_name: '',
    experiment_description: '',
    experiment_data: '',
    technique_used: '',
    permeability_result: 'moderate',
    submitted_by: '',
  })

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Only allow PDFs, images, and CSVs
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/csv']
      return validTypes.includes(file.type)
    })

    if (validFiles.length !== files.length) {
      setError('Only PDF, PNG, JPEG, and CSV files are allowed')
      return
    }

    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  // Remove file from upload list
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation - make sure required fields are filled
    if (!formData.lab_name?.trim()) {
      setError('Lab name is required')
      return
    }
    if (!formData.institution_name?.trim()) {
      setError('Institution name is required')
      return
    }
    if (!formData.experiment_description?.trim()) {
      setError('Experiment description is required')
      return
    }
    if (!formData.experiment_data?.trim()) {
      setError('Experiment results/data is required')
      return
    }
    if (!formData.technique_used?.trim()) {
      setError('Technique used is required')
      return
    }
    if (!formData.submitted_by?.trim()) {
      setError('Your name/email is required')
      return
    }

    setIsSubmitting(true)

    try {
      // Generate submission ID for file storage
      const submissionId = `submission_${Date.now()}`

      // Upload files if any
      let fileUrls: string[] = []
      if (uploadedFiles.length > 0) {
        console.log(`[VerificationForm] Starting file upload for ${uploadedFiles.length} files`)
        fileUrls = await uploadVerificationFiles(submissionId, uploadedFiles)
        console.log(`[VerificationForm] File upload complete. URLs:`, fileUrls)
      }

      // Log the data being submitted
      const submissionData = {
        ...formData,
        file_urls: fileUrls,
      }
      console.log('[VerificationForm] Submitting verification data:', {
        ...submissionData,
        file_urls: `[Array of ${fileUrls.length} URLs]`
      })

      // Submit verification
      const result = await submitVerification(submissionData)

      console.log('[VerificationForm] Submit result:', result)

      if (result.error) {
        throw new Error(result.error)
      }

      // Success
      setSuccess(true)
      setFormData({
        paper_doi: '',
        lab_name: '',
        institution_name: '',
        experiment_description: '',
        experiment_data: '',
        technique_used: '',
        permeability_result: 'moderate',
        submitted_by: '',
      })
      setUploadedFiles([])

      // Call callback
      if (onSuccess) onSuccess()

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Molecule Verification</h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-semibold">
            ✓ Verification submitted successfully! Your data will be reviewed by our team.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Researcher Info Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Researcher Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name / Email *
              </label>
              <input
                type="text"
                name="submitted_by"
                value={formData.submitted_by}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john.doe@institution.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Name *
              </label>
              <input
                type="text"
                name="lab_name"
                value={formData.lab_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Molecular Transport Lab"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of Example"
              />
            </div>
          </div>
        </div>

        {/* Experiment Details Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper DOI (optional)
              </label>
              <input
                type="text"
                name="paper_doi"
                value={formData.paper_doi}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10.1234/example.doi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technique Used *
              </label>
              <select
                name="technique_used"
                value={formData.technique_used}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select technique...</option>
                <option value="MDCK cells">MDCK cells</option>
                <option value="Caco-2">Caco-2 cells</option>
                <option value="In vivo">In vivo</option>
                <option value="In vitro">In vitro</option>
                <option value="In silico">In silico</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiment Description *
              </label>
              <textarea
                name="experiment_description"
                value={formData.experiment_description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your experimental setup, conditions, and methodology..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiment Results / Data *
              </label>
              <textarea
                name="experiment_data"
                value={formData.experiment_data}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summary of results, permeability values, or findings..."
              />
            </div>
          </div>
        </div>

        {/* Permeability Result Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permeability Result</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['permeable', 'moderate', 'nonpermeable'] as const).map(result => (
              <label
                key={result}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.permeability_result === result
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="permeability_result"
                  value={result}
                  checked={formData.permeability_result === result}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="font-medium text-gray-900 capitalize">{result}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Files</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload supporting files (PDF, Images, CSV). Max 10 files per submission.
          </p>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.png,.jpg,.jpeg,.csv"
              disabled={uploadedFiles.length >= 10}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-600">PDF, PNG, JPEG, or CSV</p>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Files ({uploadedFiles.length}/10)
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-900 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Verification'}
          </button>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Your submission will be reviewed by our team before being added to the database.
          </p>
        </div>
      </form>
    </div>
  )
}
