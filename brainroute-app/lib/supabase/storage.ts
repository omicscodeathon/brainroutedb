/**
 * Supabase Storage Configuration
 * Handles file uploads and storage operations
 */

import { supabase } from '../supabase/client'

const BUCKET_NAME = 'verification-files'

/**
 * Upload files to Supabase Storage
 * Files are organized by submission ID
 */
export async function uploadVerificationFiles(
  submissionId: string,
  files: File[]
): Promise<string[]> {
  const uploadedUrls: string[] = []

  // Log the start of upload process
  console.log(`Starting upload for ${files.length} files to bucket: ${BUCKET_NAME}`)

  for (const file of files) {
    try {
      // Create unique filename: submissionId/timestamp_filename
      const timestamp = Date.now()
      const fileName = `${submissionId}/${timestamp}_${file.name}`

      console.log(`Uploading file: ${fileName}`)

      // Upload file
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`Storage error for ${file.name}:`, error)
        throw new Error(`Failed to upload ${file.name}: ${error.message}`)
      }

      console.log(`Upload success for: ${fileName}`)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)

      uploadedUrls.push(urlData.publicUrl)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`Failed to upload file ${file.name}:`, errorMessage)
      throw error
    }
  }

  console.log(`Upload complete. URLs: ${uploadedUrls.join(', ')}`)
  return uploadedUrls
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteVerificationFile(fileUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const urlParts = fileUrl.split(`${BUCKET_NAME}/`)[1]
    if (!urlParts) return

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([urlParts])

    if (error) throw error
  } catch (error) {
    console.error('Failed to delete file:', error)
    throw error
  }
}

/**
 * Get file list for a submission
 */
export async function getSubmissionFiles(submissionId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(submissionId)

    if (error) throw error

    return (data || []).map(file => {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${submissionId}/${file.name}`)
      return urlData.publicUrl
    })
  } catch (error) {
    console.error('Failed to get submission files:', error)
    return []
  }
}
