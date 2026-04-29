#!/usr/bin/env python3
import json

with open('classification.ipynb', 'r') as f:
    nb = json.load(f)

cells = nb['cells']

# Reorder cells into logical execution flow
# 0=Load, 1=Empty, 2=Schema, 3=Supabase, 4=Display, 5=Export, 6=Sample,
# 7=Build, 8=JSON, 9=Drug, 10=Bins, 11=Struct, 12=Prepare, 13=Func, 14=RDKit, 15-18=Diag

new_order = [
    0,    # Load data
    1,    # Empty
    14,   # RDKit install
    3,    # Supabase install
    13,   # Function definitions
    12,   # Prepare dataset
    11,   # Calculate structural
    10,   # Calculate bins
    8,    # Create JSON
    9,    # Drug candidacy
    7,    # Build final dataset
    4,    # Display sample
    6,    # Show sample record
    5,    # Export to CSV
    2,    # SQL schema
    15, 16, 17, 18  # Diagnostics
]

nb['cells'] = [cells[i] for i in new_order]

with open('classification.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook reorganized successfully!")
print("\nNew structure:")
for i, cell in enumerate(nb['cells']):
    source = ''.join(cell['source']) if cell['source'] else ''
    first_line = source.split('\n')[0][:60] if source else '(empty)'
    print(f"{i+1:2d}. {first_line}")
