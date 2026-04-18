-- DROP and recreate the verification_submissions table with CORRECT schema
DROP TABLE IF EXISTS public.verification_submissions CASCADE;

CREATE TABLE public.verification_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  molecule_id integer,
  molecule_name text,
  smiles text,
  paper_doi text,
  lab_name text NOT NULL,
  institution_name text NOT NULL,
  experiment_description text NOT NULL,
  experiment_data text NOT NULL,
  technique_used text NOT NULL,
  permeability_result text NOT NULL,
  file_urls text[] DEFAULT ARRAY[]::text[],
  submitted_by text NOT NULL,
  verified_by_admin boolean DEFAULT false,
  verification_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT verification_submissions_pkey PRIMARY KEY (id)
);

-- Disable RLS (already disabled, but ensure it)
ALTER TABLE public.verification_submissions DISABLE ROW LEVEL SECURITY;

-- Grant permissions to all roles
GRANT ALL ON public.verification_submissions TO anon;
GRANT ALL ON public.verification_submissions TO authenticated;
GRANT ALL ON public.verification_submissions TO service_role;

-- Create indexes for better query performance
CREATE INDEX idx_verification_submissions_created_at 
ON public.verification_submissions(created_at DESC);

CREATE INDEX idx_verification_submissions_verified 
ON public.verification_submissions(verified_by_admin);

CREATE INDEX idx_verification_submissions_lab_name 
ON public.verification_submissions(lab_name);

-- Verify the schema is correct
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'verification_submissions'
ORDER BY ordinal_position;
