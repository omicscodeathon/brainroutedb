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

The backend must be hosted publicly to be accessible by the live frontend.

1.  Push code to GitHub.
2.  Create a new **Web Service** on [Render](https://render.com/).
3.  Connect your repository.
4.  Set **Build Command**: `npm install`
5.  Set **Start Command**: `node server/index.js`
6.  Add Environment Variables in Render Dashboard:
    - `DATABASE_URL`: Your Neon connection string
    - `SERVER_PORT`: `5000`
7.  Deploy anf Copy your new backend URL (e.g., `https://brainroutedb-api.onrender.com`).

### Frontend Deployment (e.g., Vercel, Netlify, GitHub Pages)

1.  Update your local `.env` file with the live backend URL:
    ```env
    REACT_APP_API_URL=https://your-backend-app.onrender.com
    ```
2.  Deploy the frontend:
    ```bash
    npm run deploy
    ```
    This command builds the app and pushes it to the `gh-pages` branch.

---

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

© 2026 BrainRoute-DB. All rights reserved.
