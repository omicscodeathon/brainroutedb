# BrainRoute Frontend - File Directory Overview

## Complete Directory Structure

```
/Users/soham/Desktop/afr_project/database/brainroutedb/
│
├── brainroute-app/                          ← NEW: Next.js Application (Production Ready)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                   # Root layout wrapper
│   │   │   ├── page.tsx                     # Home landing page
│   │   │   ├── globals.css                  # Global Tailwind styles
│   │   │   └── know-your-data/
│   │   │       └── page.tsx                 # Data explorer page (main feature)
│   │   │
│   │   └── components/
│   │       ├── Header.tsx                   # Navigation header
│   │       │
│   │       ├── filters/
│   │       │   ├── FilterComponents.tsx     # Reusable filter inputs
│   │       │   │   └── TextFilter, SelectFilter, CheckboxFilter, RangeFilter, MultiSelectFilter
│   │       │   └── FilterPanel.tsx          # Main filter panel container
│   │       │
│   │       ├── table/
│   │       │   └── DataPreview.tsx          # Molecule data table with pagination
│   │       │
│   │       ├── charts/
│   │       │   └── DataInsights.tsx         # Analytics, charts, and summary cards
│   │       │
│   │       ├── download/
│   │       │   └── DownloadData.tsx         # CSV export component
│   │       │
│   │       └── ai/
│   │           └── AIInsights.tsx           # AI chat interface (placeholder)
│   │
│   ├── lib/
│   │   ├── types.ts                         # TypeScript interfaces (⭐ UPDATE THIS)
│   │   │   └── Molecule, FilterState, ChatMessage, etc.
│   │   │
│   │   ├── supabase/
│   │   │   └── client.ts                    # Supabase client initialization
│   │   │
│   │   ├── queries/
│   │   │   └── brainroute.ts                # Database queries (⭐ UPDATE THIS)
│   │   │       ├── queryMolecules()         # Main query with filters
│   │   │       ├── getFilteredCount()       # Get total count
│   │   │       ├── getFilteredDataForExport() # Export all filtered data
│   │   │       ├── getCategoricalStats()    # Get compliance stats
│   │   │       ├── getFilterOptions()       # Load filter options
│   │   │       └── getNumericRanges()       # Get numeric field ranges
│   │   │
│   │   └── utils/
│   │       ├── csv-export.ts                # CSV generation and download utilities
│   │       └── index.ts                     # Helper functions
│   │
│   ├── public/                              # Static assets (images, fonts, etc.)
│   │
│   ├── Configuration Files
│   ├── .env.example                         # Environment template (copy to .env.local)
│   ├── .env.local                           # (Not tracked) Your Supabase credentials
│   ├── .gitignore                           # Git ignore rules
│   ├── package.json                         # Dependencies & scripts
│   ├── tsconfig.json                        # TypeScript configuration
│   ├── tailwind.config.ts                   # Tailwind CSS theme
│   ├── postcss.config.js                    # PostCSS configuration
│   ├── next.config.js                       # Next.js configuration
│   │
│   └── Documentation
│       ├── README.md                        # Full documentation (start here!)
│       └── QUICKSTART.md                    # Quick start guide & checklists
│
├── _legacy/                                 # Old code (archived for reference)
│   ├── src/                                 # Original React components
│   ├── public/                              # Original static files
│   ├── server/                              # Original Node.js backend
│   └── *.md                                 # Original docs
│
├── (Other existing files)
├── classification.ipynb                     # Molecule classification notebook
├── classified_molecules.csv                 # Your dataset (9,584 molecules)
├── classified_molecules.json                # JSON export of dataset
├── supabase_upload.py                       # Script to upload to Supabase
├── supabase_frontend.js                     # Legacy frontend client
├── clean_csv_for_upload.py                  # CSV cleaning utility
├── setup_supabase.sh                        # Supabase setup script
├── SUPABASE_SETUP.md                        # Supabase documentation
│
└── BRAINROUTE_FRONTEND_SUMMARY.md           # This file - overview & summary
```

---

## 🎯 Key Files to Know

### Must Update (Schema Adaptation)
These 4 files contain column-specific references:

1. **`lib/types.ts`** ⭐
   - Define the Molecule interface
   - Update column names and types
   - Used everywhere for type safety

2. **`lib/queries/brainroute.ts`** ⭐
   - Database query functions
   - Update filter clauses
   - Update column selections

3. **`src/components/filters/FilterPanel.tsx`** ⭐
   - Filter UI and loading
   - Update option loading
   - Add/remove filters

4. **`src/components/table/DataPreview.tsx`** ⭐
   - Table column display
   - Update COLUMNS_TO_DISPLAY array
   - Custom formatting

### Configuration
- **`.env.example`** → Copy to `.env.local` and fill in credentials
- **`.env.local`** → Your Supabase URL and key (never commit!)
- **`tailwind.config.ts`** → Customize colors, fonts, spacing

### Documentation
- **`README.md`** → Full architecture and setup guide (START HERE)
- **`QUICKSTART.md`** → 5-minute quick start + checklists
- **`BRAINROUTE_FRONTEND_SUMMARY.md`** → This overview document

### Application Entry Points
- **Home Page**: `src/app/page.tsx`
- **Data Explorer**: `src/app/know-your-data/page.tsx`
- **Root Layout**: `src/app/layout.tsx`

---

## 📦 Dependencies

All in `package.json`. Key packages:

```json
{
  "react": "^18.2.0",                 # React framework
  "next": "^14.0.0",                  # Next.js framework
  "@supabase/supabase-js": "^2.38.0", # Database client
  "recharts": "^2.10.0",              # Charts library
  "lucide-react": "^0.294.0",         # Icons
  "tailwindcss": "^3.3.0"             # CSS framework
}
```

Install all: `npm install`

---

## 🚀 Running the Application

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)

# Production
npm run build                  # Build for production
npm start                      # Start production server

# Other
npm run lint                   # Run linter
```

---

## 📊 Component Hierarchy

```
App (Layout)
├── Header (Navigation)
└── Page Routes
    ├── Home (/)
    │   └── Landing Page with Feature Cards
    │
    └── Know Your Data (/know-your-data)
        ├── FilterPanel
        │   ├── TextFilter
        │   ├── SelectFilter
        │   ├── CheckboxFilter
        │   ├── RangeFilter
        │   └── MultiSelectFilter
        │
        ├── DataPreview (Table)
        │   └── Paginated Molecule Table
        │
        ├── DataInsights (Analytics)
        │   ├── Summary Cards
        │   ├── Bar Chart (Compliance)
        │   └── Percentage Stats
        │
        ├── DownloadData (Export)
        │   └── CSV Download Button
        │
        └── AIInsights (Chat)
            └── Chat Interface (Placeholder)
```

---

## 🔄 Data Flow

```
User Interaction
      ↓
Filter State Update (React useState)
      ↓
Query Builder (lib/queries/brainroute.ts)
      ↓
Supabase Client (lib/supabase/client.ts)
      ↓
Supabase Database
      ↓
Response Processing
      ↓
Component State Update
      ↓
UI Re-render
```

---

## 🗂️ What Changed From Old Version

### New Directory: `brainroute-app/`
- Complete rewrite from Create React App to Next.js
- Modern App Router architecture
- TypeScript throughout
- Direct Supabase integration

### Old Code Preserved: `_legacy/`
- Original React components
- Original styling
- Original backend server
- Available for reference/migration

### Key Improvements
✅ Better performance (Next.js optimization)
✅ Type safety (TypeScript)
✅ Easier deployment (Next.js/Vercel)
✅ Better organization (App Router structure)
✅ Direct database integration (no mock data)
✅ Modern UI components (Tailwind + custom)
✅ Scalable architecture (easy to extend)

---

## 🔑 Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
NEXT_PUBLIC_STREAMLIT_APP_URL=https://your-streamlit-app.streamlit.app  # optional
```

Get from Supabase Dashboard > Settings > API

---

## 📈 Scalability & Future

The architecture supports:
- ✅ Adding new pages (create in `src/app/`)
- ✅ Adding new filters (component + query)
- ✅ Adding new charts (Recharts component)
- ✅ Authentication (Supabase Auth)
- ✅ Server-side rendering (Next.js SSR)
- ✅ API routes (Next.js `/api/` folder)
- ✅ Backend logic (Node.js endpoints)

---

## 🧭 Navigation Guide

**Want to...**

- [ ] **Get started?** → Read `QUICKSTART.md`
- [ ] **Understand architecture?** → Read `README.md`
- [ ] **Update column names?** → Follow checklist in `QUICKSTART.md`
- [ ] **Add a filter?** → See `README.md` → "Extending"
- [ ] **Implement AI?** → See `src/components/ai/AIInsights.tsx`
- [ ] **Deploy?** → See `README.md` → "Deployment"
- [ ] **Customize colors?** → Edit `tailwind.config.ts`
- [ ] **Add a page?** → Create in `src/app/`

---

## ✅ Verification Checklist

After setup, verify these files exist and contain expected content:

- [ ] `brainroute-app/package.json` - Has dependencies
- [ ] `brainroute-app/.env.example` - Has env template
- [ ] `brainroute-app/src/app/page.tsx` - Home page code
- [ ] `brainroute-app/src/app/know-your-data/page.tsx` - Explorer page code
- [ ] `brainroute-app/lib/types.ts` - Type definitions
- [ ] `brainroute-app/lib/queries/brainroute.ts` - Query functions
- [ ] `brainroute-app/README.md` - Full docs
- [ ] `brainroute-app/QUICKSTART.md` - Quick start guide
- [ ] `_legacy/` - Old code archived
- [ ] `BRAINROUTE_FRONTEND_SUMMARY.md` - This overview

---

**Status**: ✅ Complete and Ready to Use
**Build Date**: April 2026
**Version**: 1.0.0 Production Ready
