-- BrainRoute Database Schema for Neon PostgreSQL
-- This schema defines the molecules table structure

-- Create molecules table if it doesn't exist
CREATE TABLE IF NOT EXISTS molecules_and_predictions (
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
