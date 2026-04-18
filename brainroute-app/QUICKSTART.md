# BrainRoute Frontend - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd brainroute-app
npm install
```
**Time: ~2 minutes**

### Step 2: Set Environment Variables
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_STREAMLIT_APP_URL=YOUR_STREAMLIT_URL (optional)
```

Get these from Supabase Dashboard > Settings > API

**Time: ~1 minute**

### Step 3: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

**Time: Instant**

### Step 4: Verify Setup
1. Home page loads ✓
2. Click "Explore Data" → Know Your Data page loads ✓
3. Filters load and you can see data ✓

**Time: ~1 minute**

---

## 📋 Schema Adaptation Checklist

If your Supabase table column names differ from the defaults, follow this checklist:

### 1. **Update Type Definitions**
**File**: `lib/types.ts`

- [ ] Update `Molecule` interface with your actual column names
- [ ] Ensure all column types match your database (string, number, boolean, etc.)
- [ ] Add/remove columns as needed

**Example**:
```typescript
export interface Molecule {
  id: number
  name: string
  smiles: string
  my_custom_column: number | null  // Add your columns
  // ... rest of columns
}
```

### 2. **Update Query Functions**
**File**: `lib/queries/brainroute.ts`

Search for these functions and update column names:

- [ ] `queryMolecules()` - Update all filter clause `eq()`, `gte()`, `lte()` calls
- [ ] `getFilteredCount()` - Update filter clauses
- [ ] `getFilteredDataForExport()` - Update filter clauses
- [ ] `getFilterOptions()` - Update `.select()` to include your categorical columns
- [ ] `getNumericRanges()` - Update `.select()` and array iteration for numeric columns

**Example**:
```typescript
// Before:
if (filters.tpsa_max !== undefined) {
  query = query.lte('tpsa', filters.tpsa_max)
}

// After (if your column is named 'my_tpsa'):
if (filters.tpsa_max !== undefined) {
  query = query.lte('my_tpsa', filters.tpsa_max)
}
```

### 3. **Update Filter Panel**
**File**: `src/components/filters/FilterPanel.tsx`

- [ ] Update `getFilterOptions()` call to select your categorical columns
- [ ] Update `getNumericRanges()` to use your numeric columns
- [ ] Update filter UI components to match your categories
- [ ] Rename filter labels to match your data

**Example**:
```typescript
// Before:
if (options.polarity_bin) {
  setPolarityOptions(...)
}

// After (if your column is 'polarity_category'):
if (options.polarity_category) {
  setPolarityOptions(...)
}
```

### 4. **Update Data Preview Table**
**File**: `src/components/table/DataPreview.tsx`

- [ ] Update `COLUMNS_TO_DISPLAY` array with columns you want to show
- [ ] Update `formatValue()` function for custom column formatting if needed

**Example**:
```typescript
const COLUMNS_TO_DISPLAY = [
  'name',
  'my_custom_column',
  'mw',
  'logp',
  // ... your columns
]
```

### 5. **Update CSV Export**
**File**: `lib/utils/csv-export.ts`

- [ ] Update `columns` array to include your columns
- [ ] Verify column order and naming

### 6. **Update Insights Charts**
**File**: `src/components/charts/DataInsights.tsx`

- [ ] Update chart data sources to match your filters
- [ ] Update category names for compliance percentages

---

## 🔑 Key Configuration Points

### Database Table Name
Currently set to `'molecules'` in `lib/queries/brainroute.ts`:
```typescript
const TABLE_NAME = 'molecules'
```

**If different**: Update this constant throughout the queries.

### Supabase Credentials
Set in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Streamlit App URL
Set in `.env.local` (optional):
```env
NEXT_PUBLIC_STREAMLIT_APP_URL=your-streamlit-url
```

Used in home page for "Prediction Tool" button.

---

## 📊 Feature Walkthrough

### Know Your Data Page Layout

```
┌─────────────────────────────────────────┐
│         HEADER (Navigation)             │
├─────────────────────────────────────────┤
│  FILTERS    │    DATA PREVIEW           │
│  ━━━━━━━━   │    ━━━━━━━━━━━━━━━━━━     │
│  • Search   │    [Table with pagination]│
│  • Category │                           │
│  • Drugs    │    INSIGHTS               │
│  • Structure│    ━━━━━━━━━━━━━━━━━━     │
│  • Numeric  │    [Summary cards]        │
│            │    [Charts]               │
│            │                           │
│            │    EXPORT                 │
│            │    ━━━━━━━━━━━━━━━━━━     │
│            │    [Download CSV button]  │
│            │                           │
│            │    AI INSIGHTS            │
│            │    ━━━━━━━━━━━━━━━━━━     │
│            │    [Chat interface]       │
└─────────────────────────────────────────┘
```

### Filter Types Available

| Type | Use Case | Example |
|------|----------|---------|
| **Text** | Free-form search | Search molecule names |
| **Select** | Single category | Choose polarity bin |
| **Checkbox** | Boolean flags | Lipinski Pass (Yes/No) |
| **Range** | Numeric bounds | MW: 100-500 |

---

## 🧪 Testing Checklist

After setup, verify these work:

- [ ] **Home page loads** - Navigation bar visible, feature cards show
- [ ] **Navigate to Know Your Data** - Page loads, filters render
- [ ] **Search works** - Type in name filter, results update
- [ ] **Categorical filter works** - Select polarity, results change
- [ ] **Range filter works** - Set MW min/max, results update
- [ ] **Drug rules filter** - Check Lipinski, see filtered results
- [ ] **Table shows data** - Preview table displays molecules
- [ ] **Pagination works** - Navigate between pages
- [ ] **Insights load** - Summary cards and charts show
- [ ] **Export works** - Download CSV file
- [ ] **AI Chat loads** - Text input visible and functional

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot find module 'next/...'" | Run `npm install`, close dev server, restart |
| No data showing | Check `.env.local` credentials, verify RLS policies |
| Filters not working | Verify column names match your database |
| Slow queries | Check database indexes, use Supabase query analysis |
| Build errors | Clear `.next` folder: `rm -rf .next && npm run build` |

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home landing page |
| `src/app/know-your-data/page.tsx` | Main data explorer |
| `lib/types.ts` | TypeScript interfaces (UPDATE THIS) |
| `lib/queries/brainroute.ts` | Database queries (UPDATE THIS) |
| `src/components/filters/FilterPanel.tsx` | Filter UI (UPDATE THIS) |
| `src/components/table/DataPreview.tsx` | Data table (UPDATE THIS) |
| `src/components/charts/DataInsights.tsx` | Analytics charts |
| `src/components/download/DownloadData.tsx` | CSV export |
| `src/components/ai/AIInsights.tsx` | AI chat placeholder |

---

## 🚀 Next Steps

1. **Customize styling** - Update colors in `tailwind.config.ts`
2. **Add more filters** - Add filter cases in `lib/queries/brainroute.ts`
3. **Implement AI chat** - Create `/api/ai-insights` endpoint
4. **Add authentication** - Use Supabase Auth for user-specific data
5. **Deploy** - Push to Vercel or your hosting platform

---

## 📞 Support

For detailed information, see `README.md`

Common questions:
- **How do I change column names?** → See "Schema Adaptation Checklist" above
- **How do I add a new filter?** → See `README.md` → "Adding a New Filter"
- **How do I implement AI?** → See `src/components/ai/AIInsights.tsx` comments
- **How do I deploy?** → See `README.md` → "Deployment"

---

**Last Updated**: April 2026 | **Version**: 1.0.0
