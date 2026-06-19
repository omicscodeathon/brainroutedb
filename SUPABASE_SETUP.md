# Supabase Setup Guide

## Quick Start (5 minutes)

### 1. Create Supabase Project
- Go to https://supabase.com
- Click "New Project"
- Set a project name (e.g., "brain-molecules")
- Save your password securely
- Wait for setup (~2 min)

### 2. Get Your Credentials
- Go to **Settings > API**
- Copy:
  - **Project URL** → `SUPABASE_URL`
  - **anon public** key → `SUPABASE_KEY`

### 3. Create the Database Table
- Go to **SQL Editor** in Supabase
- Create new query and paste this:

```sql
CREATE TABLE molecules (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(500),
    smiles TEXT,
    tpsa FLOAT,
    logp FLOAT,
    mw FLOAT,
    hbd INT,
    hba INT,
    rotatable_bonds INT,
    ring_count INT,
    heterocycle_present BOOLEAN,
    molar_refractivity FLOAT,
    peptide_like BOOLEAN,
    lipid_like BOOLEAN,
    aromatic BOOLEAN,
    polarity_bin VARCHAR(50),
    lipophilicity_bin VARCHAR(50),
    size_bin VARCHAR(50),
    lipinski_pass BOOLEAN,
    veber_pass BOOLEAN,
    egan_pass BOOLEAN,
    ghose_pass BOOLEAN,
    pains_flag BOOLEAN,
    profile_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_lipinski ON molecules(lipinski_pass);
CREATE INDEX idx_veber ON molecules(veber_pass);
CREATE INDEX idx_egan ON molecules(egan_pass);
CREATE INDEX idx_ghose ON molecules(ghose_pass);
CREATE INDEX idx_pains ON molecules(pains_flag);
CREATE INDEX idx_polarity ON molecules(polarity_bin);
CREATE INDEX idx_lipophilicity ON molecules(lipophilicity_bin);
CREATE INDEX idx_size ON molecules(size_bin);
CREATE INDEX idx_aromatic ON molecules(aromatic);
```

- Click **Run**

### 4. Upload Your Data

**Option A: Using Python Script (Recommended)**
```bash
export SUPABASE_URL="your-url-here"
export SUPABASE_KEY="your-key-here"
python supabase_upload.py
```

**Option B: Manual CSV Import in Supabase**
- Go to **Table Editor**
- Click the table dropdown, select "Import data"
- Upload `classified_molecules.csv`

### 5. Enable Row Level Security (RLS) - Optional but Recommended

- Go to **Authentication > Policies**
- For the `molecules` table, enable RLS
- Create policy: "Enable read access for all"
  ```sql
  CREATE POLICY "Enable read access for all" ON molecules
  FOR SELECT USING (true);
  ```

This makes data publicly readable (perfect for your frontend) but not writable.

## Your Data is Now Live! 🚀

Your molecules database is now:
- ✅ Publicly accessible via REST API
- ✅ Ready for your GitHub Pages frontend
- ✅ Indexed for fast queries
- ✅ Automatically backed up

## Using in Your Frontend

### JavaScript (React, Vue, etc.)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Query drug candidates
const { data } = await supabase
  .from('molecules')
  .select('*')
  .eq('lipinski_pass', true)
  .limit(100)
```

Use the provided `supabase_frontend.js` file for ready-to-use query functions.

### cURL (Testing)
```bash
curl "https://your-url.supabase.co/rest/v1/molecules?lipinski_pass=eq.true&limit=10" \
  -H "apikey: your-key"
```

## Common Queries

**Small drug-like molecules:**
```javascript
const { data } = await supabase
  .from('molecules')
  .select('*')
  .lte('mw', 300)
  .eq('lipinski_pass', true)
```

**By polarity:**
```javascript
const { data } = await supabase
  .from('molecules')
  .select('*')
  .eq('polarity_bin', 'moderate')
```

**Exclude PAINS alerts:**
```javascript
const { data } = await supabase
  .from('molecules')
  .select('*')
  .eq('pains_flag', false)
```

**Advanced filter:**
```javascript
const { data } = await supabase
  .from('molecules')
  .select('*')
  .eq('lipinski_pass', true)
  .eq('veber_pass', true)
  .lte('mw', 500)
  .limit(50)
```

## Important Notes

- Your **anon key** is safe to use in frontend code (it's public)
- Data is encrypted in transit (HTTPS)
- Only allows SELECT queries from the anon key by default
- ~1M free queries per month (more than enough for a research app)

## Troubleshooting

**Upload fails:** Check that CSV columns match table schema exactly

**Query returns empty:** Make sure you created the table and it has data

**CORS errors:** Supabase handles this automatically for your domain

**Rate limit:** Supabase has generous free tier limits; shouldn't be an issue

---

Your molecules database is public, indexed, and ready to power your frontend! 🎯
