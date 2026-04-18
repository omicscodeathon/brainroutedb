/**
 * VERIFICATION SYSTEM SETUP GUIDE
 * 
 * This document explains how to set up the verification system for the BrainRoute platform.
 * 
 * System Overview:
 * - Users can submit experimental BBB permeability data
 * - Data is stored in a new "verification_submissions" table
 * - Files are stored in Supabase Storage bucket "verification-files"
 * - Molecules are marked with verification status: br_training, br_user_verified, predicted
 */

// ============================================================================
// STEP 1: ADD VERIFICATION COLUMN TO MOLECULES TABLE
// ============================================================================
// 
// Run this SQL in your Supabase SQL Editor:
//
// ALTER TABLE molecules
// ADD COLUMN verification TEXT NOT NULL DEFAULT 'br_training';
//
// This adds a verification column to track the data source:
// - br_training: Original PADEL training data
// - br_user_verified: User-submitted and verified data
// - predicted: Model predictions (for future use)
//
// (Optional) Update all existing rows:
// UPDATE molecules SET verification = 'br_training' WHERE verification IS NULL;
//

// ============================================================================
// STEP 2: CREATE VERIFICATION SUBMISSIONS TABLE
// ============================================================================
//
// Run this SQL in your Supabase SQL Editor:
//
// -- Disable RLS to allow public access (no authentication required)
// CREATE TABLE verification_submissions (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   molecule_id INTEGER REFERENCES molecules(id) ON DELETE SET NULL,
//   molecule_name TEXT,
//   smiles TEXT,
//   paper_doi TEXT,
//   lab_name TEXT NOT NULL,
//   institution_name TEXT NOT NULL,
//   experiment_description TEXT NOT NULL,
//   experiment_data TEXT NOT NULL,
//   technique_used TEXT NOT NULL,
//   permeability_result TEXT NOT NULL,
//   file_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
//   submitted_by TEXT NOT NULL,
//   verified_by_admin BOOLEAN DEFAULT false,
//   verification_notes TEXT,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// CREATE INDEX idx_verification_submissions_created_at 
// ON verification_submissions(created_at DESC);
//
// CREATE INDEX idx_verification_submissions_verified 
// ON verification_submissions(verified_by_admin);
//
// -- !! IMPORTANT: Make sure RLS is disabled on this table !!
// -- (RLS should be OFF by default for new tables)
//

// ============================================================================
// STEP 3: CREATE SUPABASE STORAGE BUCKET
// ============================================================================
//
// 1. Go to Supabase Dashboard > Storage
// 2. Create a new bucket named: "verification-files"
// 3. Set visibility to PUBLIC (files will be downloadable by anyone with the link)
// 4. No RLS policies needed for public bucket
//
// Bucket Structure:
// verification-files/
// ├── submission_1712345600000/
// │   ├── 1712_experiment.pdf
// │   ├── 1712_data.csv
// │   └── 1712_image.png
// └── submission_1712345610000/
//     └── 1712_results.pdf
//

// ============================================================================
// STEP 4: UPDATE ENVIRONMENT VARIABLES
// ============================================================================
//
// Your .env.local already has:
// NEXT_PUBLIC_SUPABASE_URL=...
// NEXT_PUBLIC_SUPABASE_ANON_KEY=...
//
// No additional environment variables needed!
// The app uses the same Supabase client for database and storage.
//

// ============================================================================
// FILE STRUCTURE
// ============================================================================
//
// NEW FILES CREATED:
//
// Types:
// lib/types/verification.ts
//   - VerificationStatus: 'br_training' | 'br_user_verified' | 'predicted'
//   - VerificationSubmission: Full submission data structure
//   - VerificationFilter: Filter options
//
// Database Queries:
// lib/queries/verification.ts
//   - submitVerification(): Submit new verification
//   - getVerifications(): Fetch submissions with pagination
//   - getVerificationStats(): Get counts (total, verified, pending)
//   - updateVerificationStatus(): Admin approval
//   - linkVerificationToMolecule(): Link to molecules table
//   - getVerificationDetails(): Get single submission
//
// Storage:
// lib/supabase/storage.ts
//   - uploadVerificationFiles(): Upload files to bucket
//   - deleteVerificationFile(): Remove files
//   - getSubmissionFiles(): List submission files
//
// Components:
// src/components/verification/VerificationForm.tsx
//   - Form for submitting new data
//   - File upload (PDF, Images, CSV)
//   - Fields: DOI, lab name, institution, technique, results, etc.
//
// src/components/verification/VerificationList.tsx
//   - List all submissions with status badges
//   - Search by molecule name or lab
//   - Pagination
//   - Download file links
//
// Pages:
// src/app/verify-data/page.tsx
//   - Main verification page (similar to Know Your Data)
//   - Two tabs: Submit & Review
//   - Statistics cards
//
// Updated:
// src/app/page.tsx
//   - Added Verify Data navigation card
//

// ============================================================================
// WORKFLOW
// ============================================================================
//
// 1. USER SUBMITS DATA:
//    - Goes to /verify-data
//    - Clicks "Submit New Data" tab
//    - Fills form with experiment details
//    - Uploads supporting files (PDF, CSV, Images)
//    - Submits
//
// 2. FILES ARE UPLOADED:
//    - Files go to: verification-files/submission_id/timestamp_filename
//    - URLs returned and stored in database
//    - Form data saved to verification_submissions table
//    - marked as verified_by_admin = false initially
//
// 3. ADMIN REVIEW (Future):
//    - Admin sees pending submissions in dashboard
//    - Reviews data and files
//    - Approves (verified_by_admin = true)
//    - Can add verification notes
//    - If molecule already in database, updates verification = 'br_user_verified'
//    - If new molecule, admin can add to molecules table manually
//
// 4. USER VIEWS SUBMISSIONS:
//    - Goes to "View Submissions" tab
//    - Sees all submissions (verified and pending)
//    - Can download supporting files
//    - See verification status with badges
//

// ============================================================================
// KEY FEATURES
// ============================================================================
//
// ✅ File Upload:
//    - Supports PDF, PNG, JPEG, CSV
//    - Multiple files per submission (max 10)
//    - Automatic storage in Supabase
//    - Public download links
//
// ✅ Form Fields:
//    - Researcher info (name, lab, institution)
//    - Paper DOI (optional)
//    - Experiment details (description, data, technique)
//    - Permeability result (permeable, moderate, nonpermeable)
//    - File uploads
//
// ✅ Status Tracking:
//    - Pending (yellow badge) - awaiting admin review
//    - Verified (green badge) - approved by admin
//    - Statistics display (total, verified, pending)
//
// ✅ Search & Filter:
//    - Search by molecule name or lab name
//    - Pagination (15 per page)
//    - Sort by date (newest first)
//
// ✅ UI Design:
//    - Matches existing BrainRoute design
//    - Consistent with Know Your Data page
//    - Responsive layout
//    - Color-coded status badges
//

// ============================================================================
// INTEGRATION WITH MOLECULES TABLE
// ============================================================================
//
// When admin verifies a submission:
// 1. verification_submissions.verified_by_admin = true
// 2. If molecule already in database:
//    UPDATE molecules SET verification = 'br_user_verified'
//    WHERE id = verification_submissions.molecule_id
// 3. If new molecule:
//    INSERT INTO molecules (name, smiles, ..., verification)
//    VALUES (..., 'br_user_verified')
//
// In Know Your Data page, users can now filter by verification status:
// - Show only verified molecules (br_user_verified)
// - Show training data only (br_training)
// - Show all data (both)
// (This is optional future feature)
//

// ============================================================================
// EXAMPLE QUERIES
// ============================================================================
//
// Get all pending submissions:
// SELECT * FROM verification_submissions 
// WHERE verified_by_admin = false 
// ORDER BY created_at DESC;
//
// Get verified submissions:
// SELECT * FROM verification_submissions 
// WHERE verified_by_admin = true;
//
// Get submissions by institution:
// SELECT * FROM verification_submissions 
// WHERE institution_name ILIKE '%Harvard%';
//
// Get verified molecules count:
// SELECT COUNT(*) FROM molecules WHERE verification = 'br_user_verified';
//

// ============================================================================
// SECURITY CONSIDERATIONS
// ============================================================================
//
// � PUBLIC ACCESS (No Authentication):
// - Anyone can submit data without logging in
// - RLS is DISABLED on the verification_submissions table
// - Storage bucket is PUBLIC (anyone can download files with direct URL)
// - Data integrity relies on researcher honesty
// - Good for quick submissions, but less accountability
//
// ✅ What's Protected:
// - File type validation (PDF, PNG, JPEG, CSV only)
// - Filenames are sanitized with timestamps
// - Database schema prevents invalid data types
//
// ⚠️ Future Improvement:
// - Add email verification (optional)
// - Add CAPTCHA to prevent spam
// - Monitor for duplicate/spam submissions
// - Admin review before public display (future)
//

// ============================================================================
// FUTURE ENHANCEMENTS
// ============================================================================
//
// 1. Email Notifications:
//    - Send email when submission received
//    - Send email when verified
//    - Send email for admin new submissions
//
// 2. Admin Dashboard:
//    - Admin-only page to review submissions
//    - Approve/reject with notes
//    - Batch operations
//
// 3. User Authentication:
//    - Track submissions by user account
//    - User profile page
//    - View own submissions
//
// 4. Advanced Filtering:
//    - Filter by verification status in Know Your Data
//    - Filter by technique used
//    - Filter by institution
//
// 5. Bulk Upload:
//    - Upload CSV with multiple molecules
//    - Batch verification
//
// 6. Comparison Tools:
//    - Compare experimental vs predicted values
//    - Analyze prediction accuracy
//

export const verificationSetupGuide = `
BrainRoute Verification System - Setup Complete!

The following components are now active:

📍 New Pages:
- /verify-data - Main verification platform

📍 New Components:
- VerificationForm - Submission form with file upload
- VerificationList - View all submissions

📍 Database Tables:
- verification_submissions - Stores all submissions
- molecules (updated) - Add 'verification' column

📍 Storage:
- verification-files - Bucket for uploaded files

📍 Updated Navigations:
- Home page now includes "Verify Data" card

Ready to use! Visit /verify-data to start submitting data.
`
