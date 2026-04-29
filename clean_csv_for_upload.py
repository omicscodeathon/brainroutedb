"""
Clean CSV for Supabase upload by removing the id column
(Supabase auto-generates IDs, so we don't need them in the CSV)
"""

import pandas as pd
import sys

def clean_csv_for_supabase(input_file='classified_molecules.csv', 
                          output_file='classified_molecules_clean.csv'):
    """
    Remove the id column from CSV and save clean version for Supabase upload
    """
    try:
        # Load CSV
        df = pd.read_csv(input_file)
        print(f"✓ Loaded {input_file}")
        print(f"  Original rows: {len(df)}")
        print(f"  Original columns: {len(df.columns)}")
        print(f"  Columns: {list(df.columns)[:5]}... (showing first 5)")
        
        # Remove id column if it exists
        if 'id' in df.columns:
            df = df.drop('id', axis=1)
            print(f"\n✓ Removed 'id' column")
        else:
            print(f"\n⚠ No 'id' column found (already clean)")
            return
        
        # Save clean version
        df.to_csv(output_file, index=False)
        print(f"✓ Saved to {output_file}")
        print(f"\n✅ Ready for Supabase upload!")
        print(f"  Rows: {len(df)}")
        print(f"  Columns: {len(df.columns)}")
        print(f"\nNext steps:")
        print(f"1. Go to Supabase > Table Editor > molecules")
        print(f"2. Click 'Import data'")
        print(f"3. Upload {output_file}")
        print(f"4. Supabase will auto-generate IDs for each row")
        
    except FileNotFoundError:
        print(f"✗ File not found: {input_file}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    clean_csv_for_supabase()
