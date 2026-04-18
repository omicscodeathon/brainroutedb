"""
Supabase Setup & Data Upload Script
====================================
This script handles everything to get your classified molecules 
data into Supabase - a PostgreSQL database with built-in authentication
and REST API for your frontend.

SETUP STEPS:
1. Go to https://supabase.com and create a project
2. Get your credentials from Settings > API:
   - SUPABASE_URL (from "Project URL")
   - SUPABASE_KEY (from "anon public" key)
3. Replace them below or use environment variables
4. Run: python supabase_upload.py
"""

import os
import pandas as pd
import json
from supabase import create_client, Client
from typing import List, Dict, Any

# ============================================
# CONFIGURATION
# ============================================

# Get from Supabase Settings > API
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://jmhbbewaganrynxoaybh.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_kCqIWFbvQ87W02HrNcRbWA_IqSYZ7HO")

# Path to your CSV
CSV_FILE = "classified_molecules.csv"
TABLE_NAME = "molecules"


class SupabaseManager:
    """Handle all Supabase operations"""
    
    def __init__(self, url: str, key: str):
        """Initialize Supabase client"""
        self.client: Client = create_client(url, key)
        print(f"✓ Connected to Supabase")
    
    def create_table(self) -> bool:
        """Create molecules table with proper schema"""
        try:
            # SQL to create table - run this once
            sql = """
            CREATE TABLE IF NOT EXISTS molecules (
                id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR(500),
                smiles TEXT,
                
                -- Physicochemical properties
                tpsa FLOAT,
                logp FLOAT,
                mw FLOAT,
                hbd INT,
                hba INT,
                rotatable_bonds INT,
                ring_count INT,
                heterocycle_present BOOLEAN,
                molar_refractivity FLOAT,
                
                -- Structural properties
                peptide_like BOOLEAN,
                lipid_like BOOLEAN,
                aromatic BOOLEAN,
                
                -- Classification bins
                polarity_bin VARCHAR(50),
                lipophilicity_bin VARCHAR(50),
                size_bin VARCHAR(50),
                
                -- Drug candidacy flags
                lipinski_pass BOOLEAN,
                veber_pass BOOLEAN,
                egan_pass BOOLEAN,
                ghose_pass BOOLEAN,
                pains_flag BOOLEAN,
                
                -- JSON profile for complex queries
                profile_json JSONB,
                
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Create indexes for faster queries
            CREATE INDEX IF NOT EXISTS idx_lipinski ON molecules(lipinski_pass);
            CREATE INDEX IF NOT EXISTS idx_veber ON molecules(veber_pass);
            CREATE INDEX IF NOT EXISTS idx_egan ON molecules(egan_pass);
            CREATE INDEX IF NOT EXISTS idx_ghose ON molecules(ghose_pass);
            CREATE INDEX IF NOT EXISTS idx_pains ON molecules(pains_flag);
            CREATE INDEX IF NOT EXISTS idx_polarity ON molecules(polarity_bin);
            CREATE INDEX IF NOT EXISTS idx_lipophilicity ON molecules(lipophilicity_bin);
            CREATE INDEX IF NOT EXISTS idx_size ON molecules(size_bin);
            CREATE INDEX IF NOT EXISTS idx_aromatic ON molecules(aromatic);
            """
            
            # Note: You'll run this SQL directly in Supabase SQL editor
            print("✓ Table schema ready (run SQL in Supabase editor)")
            return True
        except Exception as e:
            print(f"✗ Error creating table: {e}")
            return False
    
    def upload_data(self, df: pd.DataFrame, batch_size: int = 1000) -> bool:
        """Upload CSV data to Supabase in batches"""
        try:
            total = len(df)
            print(f"\n📤 Uploading {total} molecules...")
            
            # Convert to records and handle NaN values
            records = df.where(pd.notnull(df), None).to_dict('records')
            
            # Upload in batches to avoid timeout
            for i in range(0, total, batch_size):
                batch = records[i:i + batch_size]
                response = self.client.table(TABLE_NAME).insert(batch).execute()
                
                progress = min(i + batch_size, total)
                print(f"  ✓ Uploaded {progress}/{total} molecules")
            
            print(f"✓ Successfully uploaded all {total} molecules!")
            return True
        except Exception as e:
            print(f"✗ Upload failed: {e}")
            return False
    
    def test_query(self, limit: int = 5) -> List[Dict]:
        """Test connection by fetching sample data"""
        try:
            response = self.client.table(TABLE_NAME).select("*").limit(limit).execute()
            print(f"✓ Query successful! Sample data:")
            for i, row in enumerate(response.data, 1):
                print(f"  {i}. {row.get('name')} - MW: {row.get('mw'):.1f}")
            return response.data
        except Exception as e:
            print(f"✗ Query failed: {e}")
            return []


# ============================================
# QUERY HELPERS
# ============================================

def get_query_client(url: str, key: str) -> Client:
    """Get Supabase client for your frontend/app to use"""
    return create_client(url, key)


def query_drug_candidates(client: Client) -> List[Dict]:
    """Example: Get all drug candidates (pass all major rules)"""
    try:
        response = (
            client.table(TABLE_NAME)
            .select("id, name, smiles, mw, logp, polarity_bin, profile_json")
            .eq("lipinski_pass", True)
            .eq("veber_pass", True)
            .limit(100)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Query error: {e}")
        return []


def query_small_molecules(client: Client, max_mw: float = 300) -> List[Dict]:
    """Example: Get small drug-like molecules"""
    try:
        response = (
            client.table(TABLE_NAME)
            .select("id, name, smiles, mw, size_bin")
            .lte("mw", max_mw)
            .eq("lipinski_pass", True)
            .limit(100)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Query error: {e}")
        return []


def query_by_properties(client: Client, **filters) -> List[Dict]:
    """
    Generic query by properties
    Examples:
        query_by_properties(client, polarity_bin="moderate", aromatic=True)
        query_by_properties(client, size_bin="small", pains_flag=False)
    """
    try:
        query = client.table(TABLE_NAME).select("*")
        
        # Apply filters
        for key, value in filters.items():
            if value is None:
                query = query.is_(key, "null")
            elif isinstance(value, bool):
                query = query.eq(key, value)
            else:
                query = query.eq(key, value)
        
        response = query.limit(100).execute()
        return response.data
    except Exception as e:
        print(f"Query error: {e}")
        return []


# ============================================
# MAIN WORKFLOW
# ============================================

def main():
    print("=" * 50)
    print("SUPABASE MOLECULES DATABASE SETUP")
    print("=" * 50)
    
    # Check credentials
    if SUPABASE_URL == "your-supabase-url-here":
        print("\n⚠️  SETUP REQUIRED:")
        print("1. Get credentials from https://supabase.com/dashboard")
        print("2. Set environment variables:")
        print("   export SUPABASE_URL='your-url'")
        print("   export SUPABASE_KEY='your-key'")
        print("3. Or edit this script with your credentials")
        return
    
    # Initialize
    manager = SupabaseManager(SUPABASE_URL, SUPABASE_KEY)
    
    # Step 1: Create table
    print("\n1️⃣  TABLE CREATION")
    print("-" * 50)
    manager.create_table()
    print("⚠️  Go to Supabase > SQL Editor and run the schema SQL")
    print("   (It's printed in the code above)")
    
    # Step 2: Load CSV
    print("\n2️⃣  LOADING DATA")
    print("-" * 50)
    try:
        df = pd.read_csv(CSV_FILE)
        print(f"✓ Loaded {len(df)} molecules from {CSV_FILE}")
        print(f"  Columns: {len(df.columns)}")
    except FileNotFoundError:
        print(f"✗ File not found: {CSV_FILE}")
        return
    
    # Step 3: Upload
    print("\n3️⃣  UPLOADING TO SUPABASE")
    print("-" * 50)
    success = manager.upload_data(df)
    
    if success:
        # Step 4: Test
        print("\n4️⃣  TESTING CONNECTION")
        print("-" * 50)
        manager.test_query()
    
    # Instructions
    print("\n" + "=" * 50)
    print("✓ SETUP COMPLETE!")
    print("=" * 50)
    print("\nNEXT STEPS:")
    print("1. Data is now hosted on Supabase (publicly accessible)")
    print("2. Use these credentials in your GitHub Pages frontend:")
    print(f"   URL: {SUPABASE_URL}")
    print(f"   KEY: {SUPABASE_KEY}")
    print("\n3. From your JavaScript frontend, connect like this:")
    print("""
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(URL, KEY)
    
    // Get all small molecules
    const { data } = await supabase
      .from('molecules')
      .select('*')
      .lte('mw', 300)
    """)


if __name__ == "__main__":
    main()
