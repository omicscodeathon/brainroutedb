import json
import csv

csv_file = 'classified_molecules.csv'
json_file = 'classified_molecules.json'

print(f"Loading {json_file}...")
with open(json_file, 'r') as f:
    json_data = json.load(f)

print(f"Loading {csv_file}...")
with open(csv_file, 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    fieldnames = reader.fieldnames

print(f"CSV rows: {len(rows)}")
print(f"JSON entries: {len(json_data)}")

# Add profile_json to each row
fieldnames.append('profile_json')
for i, row in enumerate(rows):
    if i < len(json_data):
        row['profile_json'] = json.dumps(json_data[i])
    else:
        row['profile_json'] = '{}'

print(f"✓ Added profile_json column")

# Save updated CSV
with open(csv_file, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"✓ Saved to {csv_file}")
print(f"\nCSV shape: {len(rows)} rows, {len(fieldnames)} columns")
print(f"Last column: {fieldnames[-1]}")
print(f"\nFirst row profile_json preview:")
print(rows[0]['profile_json'][:200])
