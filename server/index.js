require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
// Use PORT (provided by hosting services) or SERVER_PORT (local .env) or default to 5000
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*", // Allow frontend access
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error acquiring client", err.stack);
  } else {
    console.log("✅ Successfully connected to Neon database");
    release();
  }
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/molecules", async (req, res) => {
  try {
    // Select and rename columns to match Frontend expectations exactly
    const query = `
            SELECT 
                id::text, 
                "Name" as name, 
                "Smiles" as smiles, 
                formula, 
                "Prediction" as prediction, 
                "Confidence" as confidence, 
                mw as weight, 
                logp as "logP", 
                hbd, 
                hba, 
                tpsa, 
                rotatable_bonds, 
                heavy_atoms 
            FROM molecules_and_predictions
            ORDER BY id DESC
        `;

    const { rows } = await pool.query(query);

    // Process data to ensure correct types for the frontend
    const processedRows = rows.map((row) => ({
      ...row,
      // Ensure numeric values are numbers
      weight: parseFloat(row.weight) || 0,
      logP: parseFloat(row.logP) || 0,
      hbd: parseInt(row.hbd) || 0,
      hba: parseInt(row.hba) || 0,
      tpsa: parseFloat(row.tpsa) || 0,
      // Ensure prediction is formatted as a label
      prediction:
        row.prediction === "1" || row.prediction === 1
          ? "BBB+"
          : row.prediction === "0" || row.prediction === 0
          ? "BBB-"
          : row.prediction,
    }));

    res.json({
      success: true,
      count: processedRows.length,
      data: processedRows,
    });
  } catch (err) {
    console.error("Error fetching molecules:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 SERVER RUNNING ON: http://localhost:${PORT}`);
  console.log(`   API Endpoint:      http://localhost:${PORT}/api/molecules`);
});
