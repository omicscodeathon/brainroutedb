# BrainRoute Frontend Application

A modern, production-ready Next.js web application for exploring and analyzing blood-brain barrier permeability data stored in Supabase.

## Overview

**BrainRoute** is a scientific data portal featuring:
- 🏠 **Landing Page**: Entry point with feature highlights and navigation
- 📊 **Know Your Data**: Interactive data explorer with filtering, visualization, and export capabilities
- 🔍 **Advanced Filtering**: Search, categorical filters, drug rule compliance, numeric ranges
- 📈 **Insights**: Real-time analytics and compliance statistics
- 💾 **CSV Export**: Download filtered datasets directly
- 🤖 **AI Chat Interface**: Placeholder for LLM-powered insights (ready for implementation)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React hooks + URL-based filter persistence (optional)

## Project Structure

```
brainroute-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home landing page
│   │   ├── globals.css             # Global Tailwind styles
│   │   └── know-your-data/
│   │       └── page.tsx            # Data explorer page
│   └── components/
│       ├── Header.tsx              # Navigation header
│       ├── filters/
│       │   ├── FilterComponents.tsx # Reusable filter UI (Text, Select, Checkbox, Range)
│       │   └── FilterPanel.tsx      # Filter panel container
│       ├── table/
│       │   └── DataPreview.tsx      # Molecule table with pagination
│       ├── charts/
│       │   └── DataInsights.tsx     # Analytics and visualizations
│       ├── download/
│       │   └── DownloadData.tsx     # CSV export component
│       └── ai/
│           └── AIInsights.tsx       # AI chat interface (placeholder)
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── supabase/
│   │   └── client.ts               # Supabase client setup
│   ├── queries/
│   │   └── brainroute.ts           # Database query functions
│   └── utils/
│       ├── csv-export.ts           # CSV generation and download
│       └── index.ts                # General utilities
├── public/                         # Static assets
├── .env.example                    # Environment variables template
├── .env.local                      # (Not tracked) Your actual credentials
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn installed
- Supabase project with molecules table and data already loaded
- Supabase API credentials (URL and anon key)

### 1. Install Dependencies

```bash
cd brainroute-app
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `brainroute-app` directory:

```bash
# Copy the template
cp .env.example .env.local

# Then edit .env.local with your actual credentials
```

**Fill in these values from your Supabase project:**

```env
# From Supabase > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional: Your Streamlit prediction tool URL
NEXT_PUBLIC_STREAMLIT_APP_URL=https://your-streamlit-app.streamlit.app
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Configuration & Schema Adaptation

### Adapting to Your Database Schema

The application is built around the molecules table. If your column names differ, update these files:

#### 1. **lib/types.ts** - Column Definitions
```typescript
// Update the Molecule interface to match your actual columns
export interface Molecule {
  id: number
  name: string
  // ... rest of your columns
}
```

#### 2. **lib/queries/brainroute.ts** - Query Builders
```typescript
// Update filter application code:
if (filters.your_column_name) {
  query = query.eq('your_column_name', filters.your_column_name)
}

// Update column names in getNumericRanges()
;['your_numeric_column1', 'your_numeric_column2'].forEach(field => {
  // ...
})
```

#### 3. **src/components/filters/FilterPanel.tsx** - Filter Options
```typescript
// Update option loading:
if (options.your_category_column) {
  setYourCategoryOptions(
    options.your_category_column.map((opt: string) => ({ label: opt, value: opt }))
  )
}
```

#### 4. **src/components/table/DataPreview.tsx** - Displayed Columns
```typescript
const COLUMNS_TO_DISPLAY = [
  'your_column1',
  'your_column2',
  'your_column3',
  // ...
]
```

### Database Permissions (Supabase RLS)

Ensure your Supabase table allows SELECT for the anon key:

```sql
-- Run in Supabase SQL Editor
CREATE POLICY "Allow public read access" ON molecules
FOR SELECT USING (true);
```

## Core Components

### FilterPanel (`src/components/filters/FilterPanel.tsx`)
- Loads available filter options from database
- Provides text search, categorical filters, checkboxes, and range inputs
- Syncs state with parent component
- Reset functionality

### DataPreview (`src/components/table/DataPreview.tsx`)
- Fetches paginated molecule data based on filters
- Shows selected columns with formatted values
- Implements pagination controls
- Loading and error states

### DataInsights (`src/components/charts/DataInsights.tsx`)
- Summary cards (total records, compliance counts, etc.)
- Bar chart showing drug rule compliance
- Percentage calculations for pass rates
- Updates dynamically with filter changes

### DownloadData (`src/components/download/DownloadData.tsx`)
- Exports complete filtered dataset as CSV
- Includes all relevant columns
- Properly escapes CSV special characters
- Client-side generation (no server overhead)

### AIInsights (`src/components/ai/AIInsights.tsx`)
- Chat-like interface for asking questions about data
- Placeholder implementation with comments on integration
- Ready for API connection to LLM service
- Message history and timestamp display

## Key Features

### Real-time Filtering
Filters are applied immediately and update the data preview, insights, and total count in real-time via Supabase queries.

### Efficient Querying
- Uses Supabase range-based queries for pagination (no client-side loading of entire dataset)
- Separate count queries for quick summary updates
- Indexed columns for fast filtering

### CSV Export
- Downloads all filtered results (not just visible page)
- Includes properly formatted SMILES strings and JSON data
- Client-side generation - no server upload needed

### Responsive Design
- Mobile-first Tailwind CSS
- Adapts from single column (mobile) to two-column layout (desktop)
- Table scrolls horizontally on small screens

## Extending the Application

### Adding a New Filter

1. **Update the database query** (`lib/queries/brainroute.ts`):
   ```typescript
   if (filters.new_column !== undefined) {
     query = query.eq('new_column', filters.new_column)
   }
   ```

2. **Add to FilterPanel** (`src/components/filters/FilterPanel.tsx`):
   ```typescript
   <SelectFilter
     label="My New Filter"
     value={filters.my_filter || ''}
     onChange={(value) => updateFilter('my_filter', value || undefined)}
     options={myOptions}
   />
   ```

3. **Update types** (`lib/types.ts`):
   ```typescript
   export interface FilterState {
     // ...
     my_filter?: string | number
   }
   ```

### Adding a New Visualization

1. **Create component** in `src/components/charts/`:
   ```typescript
   export function MyChart({ filters }: { filters: FilterState }) {
     // Fetch data and render chart
   }
   ```

2. **Add to Know Your Data page**:
   ```typescript
   <MyChart filters={filters} />
   ```

### Implementing AI Insights

Replace placeholder code in `src/components/ai/AIInsights.tsx`:

```typescript
// Create API endpoint: /api/ai-insights
const response = await fetch('/api/ai-insights', {
  method: 'POST',
  body: JSON.stringify({
    query: input,
    filters: filters,
    totalRecords: totalRecords,
  }),
})

const data = await response.json()
// Handle response and update messages
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon public key (safe for frontend) |
| `NEXT_PUBLIC_STREAMLIT_APP_URL` | No | URL to external Streamlit app |

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then set environment variables in Vercel dashboard.

### Other Hosting
1. Build: `npm run build`
2. Deploy the `.next` folder with `npm start`
3. Set environment variables in hosting platform

## Troubleshooting

### "Cannot connect to Supabase"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Verify Supabase RLS policies allow SELECT

### "No data in table"
- Ensure you've uploaded data to the molecules table
- Check RLS policies permit public SELECT

### "Columns not found"
- Verify column names match your actual database schema
- Update column references in type definitions and query builders

### Slow queries
- Check that indexed columns are used in WHERE clauses
- Consider adding indexes to frequently filtered columns
- Use EXPLAIN in Supabase SQL editor to analyze query plans

## Architecture Notes

### State Management
Currently uses React `useState` for filter state. For more advanced use cases:
- Implement URL search params for shareable filter links
- Use Zustand for global state (already installed)
- Add React Query for advanced caching

### Data Fetching
- Component-level fetching with `useEffect`
- Separated query logic in `lib/queries/brainroute.ts`
- Can be replaced with React Query for automatic caching

### Styling
- Utility-first Tailwind CSS
- No custom component library (pure HTML + Tailwind)
- Easy to add shadcn/ui components if needed

## API Endpoints (For Future Use)

Plan for backend endpoints to power advanced features:

- `POST /api/ai-insights` - LLM-powered data analysis
- `POST /api/molecules/bulk-query` - Advanced filtering
- `GET /api/download/molecules` - Server-side CSV generation (optional)

## License

[Add your license here]

## Support

For questions or issues, please [add contact/support information]

---

**Built with ❤️ for scientific research**
