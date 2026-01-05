# 🏗️ BrainRoute Database Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           React Frontend (Port 3000)                     │   │
│  │                                                           │   │
│  │  • Search Interface                                      │   │
│  │  • Molecule Visualization                                │   │
│  │  • Property Display                                      │   │
│  │  • RDKit Structure Rendering                             │   │
│  │                                                           │   │
│  │  Environment Variables:                                  │   │
│  │  ✓ REACT_APP_API_URL                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP Request
                            │ fetch(API_URL/api/molecules)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Express API Server (Port 5000)                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Security Middleware                                    │    │
│  │  • Helmet (Security Headers)                            │    │
│  │  • CORS (Origin Control)                                │    │
│  │  • SSL/TLS                                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  API Endpoints                                          │    │
│  │  • GET  /api/health                                     │    │
│  │  • GET  /api/molecules                                  │    │
│  │  • GET  /api/molecules/:id                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Environment Variables:                                          │
│  ✓ DATABASE_URL (Hidden from frontend!)                         │
│  ✓ PORT                                                          │
│  ✓ FRONTEND_URL                                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ SQL Query
                            │ SELECT * FROM molecules
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              Neon PostgreSQL (Cloud Database)                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  molecules Table                                        │    │
│  │                                                          │    │
│  │  ┌─────────────┬──────────────────┬────────────────┐  │    │
│  │  │ id          │ name             │ smiles         │  │    │
│  │  ├─────────────┼──────────────────┼────────────────┤  │    │
│  │  │ MOL-001     │ Aspirin          │ CC(=O)OC1=...  │  │    │
│  │  │ MOL-002     │ Caffeine         │ CN1C=NC2=C...  │  │    │
│  │  │ MOL-003     │ Glucose          │ C(C1C(C(C(...  │  │    │
│  │  └─────────────┴──────────────────┴────────────────┘  │    │
│  │                                                          │    │
│  │  + Indexes for fast searching                           │    │
│  │  + ACID compliance                                       │    │
│  │  + Automatic backups                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  SSL/TLS Encrypted Connection                                    │
│  sslmode=require & channel_binding=require                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Searches for a Molecule

```
User Types "Aspirin"
        ↓
React Frontend updates searchInput state
        ↓
Navigate to /search route
        ↓
useEffect triggers fetchFromDatabase()
        ↓
fetch(http://localhost:5000/api/molecules)
        ↓
Express API receives request
        ↓
Validates request & checks CORS
        ↓
Executes SQL: SELECT * FROM molecules
        ↓
Neon PostgreSQL returns results
        ↓
Express transforms data to JSON
        ↓
Sends response: { success: true, data: [...] }
        ↓
React receives data
        ↓
Updates molecules state
        ↓
Filters by search term "Aspirin"
        ↓
Renders SearchResults component
        ↓
User sees molecule cards
```

### 2. User Views Molecule Detail

```
User clicks molecule card
        ↓
Navigate to /molecule/MOL-001
        ↓
MoleculeDetail component finds molecule from state
        ↓
RDKit renders 2D structure from SMILES
        ↓
Display properties and physical data
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Environment Isolation                               │
│ • Frontend only sees REACT_APP_* variables                   │
│ • DATABASE_URL hidden from browser                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: CORS Protection                                     │
│ • Only allowed origins can access API                        │
│ • Prevents unauthorized cross-origin requests                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Helmet Security Headers                            │
│ • XSS Protection                                             │
│ • Content Security Policy                                    │
│ • HSTS, X-Frame-Options, etc.                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: SSL/TLS Encryption                                  │
│ • All database connections encrypted                         │
│ • sslmode=require enforced                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Database-level Security                             │
│ • User authentication (Neon credentials)                     │
│ • Connection pooling                                         │
│ • SQL injection prevention (parameterized queries)           │
└─────────────────────────────────────────────────────────────┘
```

---

## Development vs Production

### Development (localhost)

```
Frontend: http://localhost:3000
            ↓
Backend:  http://localhost:5000
            ↓
Database: Neon PostgreSQL (cloud)
```

### Production

```
Frontend: https://your-app.vercel.app
            ↓
Backend:  https://your-api.railway.app
            ↓
Database: Neon PostgreSQL (cloud)
```

**Environment Configuration:**

Development `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

Production `.env`:

```env
REACT_APP_API_URL=https://your-api.railway.app
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://...
```

---

## Technology Stack

```
┌─────────────────┐
│   Frontend      │
├─────────────────┤
│ React 19.2.0    │
│ React Router    │
│ Tailwind CSS    │
│ RDKit.js        │
│ Lucide Icons    │
└─────────────────┘
        ↕ HTTP/JSON
┌─────────────────┐
│    Backend      │
├─────────────────┤
│ Node.js         │
│ Express.js      │
│ Helmet          │
│ CORS            │
│ node-postgres   │
└─────────────────┘
        ↕ PostgreSQL Protocol (SSL)
┌─────────────────┐
│   Database      │
├─────────────────┤
│ Neon PostgreSQL │
│ Serverless      │
│ Auto-scaling    │
│ Backups         │
└─────────────────┘
```

---

## File Structure

```
brainroute-db/
├── public/                 # Static files
├── src/
│   ├── App.js             # Main React component
│   ├── index.js           # React entry point
│   └── ...
├── server/
│   ├── index.js           # Express API server
│   ├── schema.sql         # Database schema
│   └── migrate-from-sheets.js  # Migration utility
├── .env                   # Environment variables (gitignored)
├── .env.example           # Template
├── package.json           # Dependencies & scripts
├── README.md              # Project overview
├── SETUP.md               # Detailed setup guide
├── MIGRATION.md           # Migration guide
├── MIGRATION_SUMMARY.md   # What changed
├── QUICKSTART.md          # Quick setup
└── ARCHITECTURE.md        # This file
```

---

## API Request/Response Examples

### GET /api/molecules

**Request:**

```http
GET http://localhost:5000/api/molecules HTTP/1.1
Host: localhost:5000
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "MOL-001",
      "name": "Aspirin",
      "smiles": "CC(=O)OC1=CC=CC=C1C(=O)O",
      "weight": 180.158,
      "formula": "C9H8O4",
      "prediction": "BBB-",
      "confidence": 87.5,
      "uncertainty": 12.3,
      "properties": {
        "mw": 180.158,
        "logp": 1.19,
        "hbd": 1,
        "hba": 4,
        "tpsa": 63.6,
        "rotatable_bonds": 3,
        "heavy_atoms": 13,
        "meltingPoint": "135°C",
        "boilingPoint": "140°C",
        "solubility": "Slightly soluble in water",
        "polarSurfaceArea": "63.6 Ų"
      }
    }
  ]
}
```

---

## Deployment Architecture

### Option 1: All-in-One Platform

```
Vercel (Frontend + Backend)
        ↓
Neon PostgreSQL
```

### Option 2: Separate Services (Recommended)

```
Vercel/Netlify (Frontend)
        ↓
Railway/Render (Backend)
        ↓
Neon PostgreSQL
```

**Benefits:**

- Independent scaling
- Separate SSL certificates
- Better security isolation
- Easier debugging

---

© 2025 BrainRoute-DB by BrainRoute Team
