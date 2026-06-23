# BrainRoute Database

BrainRoute Database is a web portal for exploring blood-brain barrier molecule records, filtering molecule properties, viewing summary charts, submitting verification information, and downloading selected data.

The current application lives in `brainroute-app`.

Live site: https://omicscodeathon.github.io/brainroutedb

## Requirements

- Node.js 18 or newer
- npm
- A Supabase project with the BrainRoute `molecules` table and required read permissions

## Local Setup

Clone the repository:

```bash
git clone https://github.com/omicscodeathon/brainroutedb.git
cd brainroutedb/brainroute-app
```

Install dependencies:

```bash
npm install
```

Create `brainroute-app/.env.local`:

Set the public Supabase values for your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_STREAMLIT_APP_URL=https://your-prediction-tool.example.com
```

Do not commit `.env.local`. Use placeholders in documentation and keep project-specific credentials outside the repository.

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Production Build

From `brainroute-app`:

```bash
npm run build
```

The app is configured for static export and GitHub Pages under the `/brainroutedb` base path in production.

## Useful Paths

- `brainroute-app/src/app/page.tsx`: home page
- `brainroute-app/src/app/search`: search page
- `brainroute-app/src/app/know-your-data`: data explorer
- `brainroute-app/src/app/downloads`: download page
- `brainroute-app/src/app/verify-data`: verification workflow
- `brainroute-app/lib/queries/brainroute.ts`: Supabase query helpers
- `brainroute-app/lib/types.ts`: molecule data types

## Notes

- The active database connection is Supabase.
- The project expects public Supabase browser credentials only. Do not add service role keys or private credentials to frontend environment files.
- Built and maintained by the BrainRoute team, with an associated manuscript currently in preparation for publication.
