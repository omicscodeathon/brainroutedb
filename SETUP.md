# BrainRoute Database - Neon PostgreSQL Setup

This application now uses **Neon PostgreSQL** as the database backend instead of Google Sheets, with a secure API layer.

## Architecture

- **Frontend**: React app (port 3000)
- **Backend**: Express API server (port 5000)
- **Database**: Neon PostgreSQL (cloud-hosted)

## Security Features

✅ Database credentials never exposed to frontend  
✅ API layer with Helmet security headers  
✅ CORS protection  
✅ SSL connection to Neon database  
✅ Environment variable isolation

## Setup Instructions

### 1. Environment Configuration

The `.env` file contains:

- `DATABASE_URL`: Neon PostgreSQL connection string (backend only)
- `REACT_APP_API_URL`: API endpoint for frontend
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS

**Important**: Only variables prefixed with `REACT_APP_` are accessible to the frontend.

### 2. Database Setup

Run the schema creation script in your Neon dashboard SQL editor:

```sql
-- See server/schema.sql for the complete schema
```

Or connect via psql:

```bash
psql "postgresql://username:password@host/database?sslmode=require&channel_binding=require"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Running the Application

#### Development (Frontend + Backend together):

```bash
npm run dev
```

#### Production:

Terminal 1 - Backend:

```bash
npm run server
```

Terminal 2 - Frontend:

```bash
npm start
```

## API Endpoints

### `GET /api/health`

Health check endpoint

### `GET /api/molecules`

Fetch all molecules from database

Response:

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
      "mw": 180.158,
      "logp": 1.19,
      "hbd": 1,
      "hba": 4,
      "tpsa": 63.6,
      "rotatable_bonds": 3,
      "heavy_atoms": 13
    }
  ]
}
```

### `GET /api/molecules/:id`

Fetch a single molecule by ID

## Database Schema

```sql
CREATE TABLE molecules_and_predictions (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
Smiles TEXT UNIQUE,
Name TEXT,
Prediction SMALLINT,
Confidence NUMERIC,
mw NUMERIC,
logp NUMERIC,
hbd INTEGER,
hba INTEGER,
tpsa INTEGER,
rotatable_bonds INTEGER,
heavy_atoms INTEGER,
formula TEXT

);
```

## Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables on hosting platform
2. Deploy backend code from `server/` directory
3. Update `REACT_APP_API_URL` in frontend `.env` to production API URL

### Frontend Deployment (e.g., Vercel, Netlify, GitHub Pages)

1. Build: `npm run build`
2. Deploy the `build/` folder
3. Set `REACT_APP_API_URL` environment variable to production API

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` template instead
2. **Rotate credentials regularly** - Update Neon password periodically
3. **Use HTTPS in production** - Ensure SSL/TLS for API communication
4. **Implement rate limiting** - Protect API from abuse
5. **Add authentication** - Implement JWT or OAuth if needed

## Troubleshooting

### Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure SSL is enabled

### CORS Errors

- Check `FRONTEND_URL` in `.env`
- Verify CORS settings in `server/index.js`

### API Not Responding

- Check backend server is running on correct port
- Verify `REACT_APP_API_URL` matches backend URL

## License

© 2025 BrainRoute-DB. All rights reserved.
