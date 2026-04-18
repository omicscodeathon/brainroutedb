# File Upload Debug Guide

## Problem
Form submission works WITHOUT files, but fails with "row violates row-level security policy" when files are uploaded.

## Root Cause Analysis

The issue is likely ONE of the following:

### 1. **Storage Bucket RLS Policies (MOST LIKELY)**
**Action**: Go to Supabase Dashboard
1. Navigate to **Storage** → **verification-files** bucket
2. Click **Policies** tab
3. If you see ANY policies listed, **delete them all**
4. Make sure the bucket is set to **PUBLIC** access

**Why this causes RLS errors**: The storage bucket has policies that block uploads, causing silent failures. Then the form tries to insert with empty file_urls array.

### 2. **Check Browser Console for Upload Errors**
**Action**: 
1. Open your form at http://localhost:3000/verify-data
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Try submitting with a PDF/CSV file
5. Look for error messages about:
   - "Failed to upload"
   - "Storage error"
   - "403 Forbidden"
   - "401 Unauthorized"

**Copy-paste** any error messages you see.

### 3. **Check Network Tab**
**Action**:
1. In DevTools, go to **Network** tab
2. Try submitting with a file
3. Look for requests to `supabase.com` that:
   - Have a RED status code (400, 403, 401, 500)
   - End with `/upload` or `/storage`
4. Click on the failed request and check **Response** tab

## Testing Steps (In Order)

### Test 1: Verify Storage Bucket Exists
```
Expected: verification-files bucket appears in Supabase Dashboard Storage
If missing: Create bucket named "verification-files" with PUBLIC access
```

### Test 2: Check Storage Bucket Policies
```
Expected: No policies listed on verification-files bucket
If policies exist: Delete them all
```

### Test 3: Test Direct File Upload
In browser console, run:
```javascript
// Copy-paste this into browser console (F12)
const supabase = window.__supabase;
const file = new File(['test'], 'test.txt');
const { data, error } = await supabase.storage
  .from('verification-files')
  .upload('test/' + Date.now() + '.txt', file);
console.log('Upload result:', { data, error });
```

Expected: `error` is `null` and `data` shows successful upload

### Test 4: Verify Environment Variables
Check that your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## Console Logs Added

I've added detailed console.log statements to the upload function. When you try uploading, you should see:
```
Starting upload for X files to bucket: verification-files
Uploading file: submission_XXXXXXX/XXXXX_filename.pdf
Upload success for: submission_XXXXXXX/XXXXX_filename.pdf
Upload complete. URLs: https://...
```

## What to Report Back

After checking the above, tell me:
1. ✅ or ❌ - Storage bucket `verification-files` exists
2. ✅ or ❌ - Storage bucket is set to PUBLIC
3. ✅ or ❌ - No policies on the bucket
4. Any error messages from browser console
5. Any failed requests in Network tab (copy the error response)
