-- Check the exact column definition for file_urls
SELECT 
  column_name, 
  data_type, 
  udt_name,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'verification_submissions' 
  AND column_name = 'file_urls';

-- Also check the full table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'verification_submissions'
ORDER BY ordinal_position;
