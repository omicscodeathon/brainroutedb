#!/usr/bin/env python3
import json

# Read the current notebook
with open('classification.ipynb', 'r') as f:
    nb = json.load(f)

# Helper to find cell by id
def find_cell_idx(cell_id):
    for i, cell in enumerate(nb['cells']):
        if cell.get('id') == cell_id:
            return i
    return -1

# Get indices of key cells
old_order = {
    'schema': find_cell_idx('#VSC-2ed51ec8'),
    'supabase': find_cell_idx('#VSC-5d4ed9a3'),
    'display': find_cell_idx('#VSC-3a791f52'),
    'export': find_cell_idx('#VSC-de4830d5'),
    'sample': find_cell_idx('#VSC-9b13ad0e'),
    'final': find_cell_idx('#VSC-ecd3aa76'),
    'dedup': find_cell_idx('#VSC-7b3de538'),
    'json': find_cell_idx('#VSC-f3a839cc'),
    'drug': find_cell_idx('#VSC-e47f65b2'),
    'bins': find_cell_idx('#VSC-f37359e5'),
    'struct': find_cell_idx('#VSC-4b4a2c29'),
    'logd': find_cell_idx('#VSC-b6d1a414'),
    'prepare': find_cell_idx('#VSC-245ab317'),
    'func': find_cell_idx('#VSC-224857bc'),
    'rdkit': find_cell_idx('#VSC-5be2fb60'),
    'diag1': find_cell_idx('#VSC-891d9174'),
    'diag2': find_cell_idx('#VSC-f4c219bf'),
    'diag3': find_cell_idx('#VSC-0d87f4c1'),
    'diag4': find_cell_idx('#VSC-48655ccf'),
}

print("Current indices:", {k: v for k, v in old_order.items() if v >= 0})

# Collect cells in new order
new_cells = []

# 1. Load data
new_cells.append(nb['cells'][0])
# 2. Empty cell
new_cells.append(nb['cells'][1])
# 3-5. Setup (installs + functions)
if old_order['rdkit'] >= 0:
    new_cells.append(nb['cells'][old_order['rdkit']])
if old_order['supabase'] >= 0:
    new_cells.append(nb['cells'][old_order['supabase']])
if old_order['func'] >= 0:
    new_cells.append(nb['cells'][old_order['func']])
# 6. Prepare data
if old_order['prepare'] >= 0:
    new_cells.append(nb['cells'][old_order['prepare']])
# 7-11. Calculations
if old_order['logd'] >= 0:
    new_cells.append(nb['cells'][old_order['logd']])
if old_order['struct'] >= 0:
    new_cells.append(nb['cells'][old_order['struct']])
if old_order['bins'] >= 0:
    new_cells.append(nb['cells'][old_order['bins']])
if old_order['json'] >= 0:
    new_cells.append(nb['cells'][old_order['json']])
if old_order['drug'] >= 0:
    new_cells.append(nb['cells'][old_order['drug']])
# 12-13. Build & dedup
if old_order['final'] >= 0:
    new_cells.append(nb['cells'][old_order['final']])
if old_order['dedup'] >= 0:
    new_cells.append(nb['cells'][old_order['dedup']])
# 14-16. Display
if old_order['display'] >= 0:
    new_cells.append(nb['cells'][old_order['display']])
if old_order['sample'] >= 0:
    new_cells.append(nb['cells'][old_order['sample']])
if old_order['export'] >= 0:
    new_cells.append(nb['cells'][old_order['export']])
# 17. Schema
if old_order['schema'] >= 0:
    new_cells.append(nb['cells'][old_order['schema']])
# 18+. Diagnostics
if old_order['diag1'] >= 0:
    new_cells.append(nb['cells'][old_order['diag1']])
if old_order['diag2'] >= 0:
    new_cells.append(nb['cells'][old_order['diag2']])
if old_order['diag3'] >= 0:
    new_cells.append(nb['cells'][old_order['diag3']])
if old_order['diag4'] >= 0:
    new_cells.append(nb['cells'][old_order['diag4']])

nb['cells'] = new_cells

# Write back
with open('classification.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print(f"\nNotebook reorganized: {len(nb['cells'])} cells")
print("\nNew order:")
for i, cell in enumerate(nb['cells']):
    cell_type = cell['cell_type']
    first_line = ''.join(cell['source'])[:40] if cell['source'] else '(empty)'
    print(f"{i+1:2d}. [{cell_type:4s}] {first_line}")
