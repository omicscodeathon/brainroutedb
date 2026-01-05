# ⚡ Quick Start Guide

Get BrainRoute Database running in 5 minutes!

## Prerequisites

- Node.js installed
- Neon PostgreSQL account ([sign up free](https://neon.tech))

---

## 🚀 Setup in 4 Steps

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env with your Neon connection string:
DATABASE_URL='postgresql://user:pass@host/db?sslmode=require&channel_binding=require'
```

### 3️⃣ Set Up Database

Go to Neon SQL Editor and run:

```sql
-- Copy and paste from server/schema.sql
CREATE TABLE IF NOT EXISTS name_of_the_table ( ... );
```

### 4️⃣ Run Application

```bash
npm run dev
```

Visit: http://localhost:3000 🎉

---

## 📊 Add Data

Use Neon SQL Editor:

```sql
INSERT INTO molecules (id, name, smiles, formula, weight, prediction, confidence, uncertainty, mw, logp, hbd, hba, tpsa, rotatable_bonds, heavy_atoms, melting_point, boiling_point, solubility, polar_surface_area)
VALUES ('CC(=O)OC1=CC=CC=C1C(=O)O', 'Aspirin', 0, 87.5, 12.3, 180.158, 1.19, 1, 4, 63.6, 3, 13, 'C9H8O4');
```

---

## Verify Everything Works

### Test Backend

```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"BrainRoute-DB API is running"}

curl http://localhost:5000/api/molecules
# Expected: {"success":true,"data":[...]}
```

### Test Frontend

1. Open http://localhost:3000
2. Search for a molecule
3. Click to view details
4. Check browser console for any errors

---

## Common Issues

### "Cannot connect to database"

- Check `DATABASE_URL` format in `.env`
- Verify Neon database is active
- Ensure SSL parameters are included

### "No molecules found"

- Database is empty - add data using migration or manual insert
- Check backend console for fetch errors

### "CORS error"

- Frontend and backend URLs must match `.env` configuration
- Restart both servers after changing `.env`

---

## 📚 Full Documentation

- **SETUP.md** - Detailed setup and API docs
- **README.md** - Project overview

---

## 🎊 You're All Set!

Your secure, scalable molecular database is ready to use.

**What's Next?**

- Add your molecule data
- Customize the frontend
- Deploy to production
- Add authentication (optional)
- Set up automated backups

Happy researching! 🧪🧬
