import sqlite3
import json

conn = sqlite3.connect("campusos.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = [r[0] for r in cursor.fetchall() if not r[0].startswith('sqlite_') and not r[0] == 'alembic_version']

print("=" * 80)
print("GL BAJAJ CAMPUSOS DATABASE OVERVIEW (campusos.db)")
print("=" * 80)

summary = {}
for t in tables:
    cursor.execute(f'SELECT COUNT(*) FROM "{t}"')
    count = cursor.fetchone()[0]
    cursor.execute(f'PRAGMA table_info("{t}")')
    cols = cursor.fetchall()
    col_names = [c[1] for c in cols]
    col_types = [f"{c[1]} ({c[2]})" for c in cols]
    
    cursor.execute(f'SELECT * FROM "{t}" LIMIT 2')
    sample_rows = cursor.fetchall()
    
    summary[t] = {
        "count": count,
        "columns": col_names,
        "column_types": col_types,
        "sample": sample_rows
    }
    print(f"Table: {t:<28} | Rows: {count:<6} | Columns: {len(col_names)}")

print("\n" + "=" * 80)
print("DETAILED TABLES AND SAMPLE DATA")
print("=" * 80)

for t, info in summary.items():
    print(f"\n--- [TABLE] {t} ({info['count']} rows) ---")
    print(f"Columns: {', '.join(info['column_types'][:8])}" + ("..." if len(info['column_types']) > 8 else ""))
    print("Sample Rows:")
    for row in info['sample']:
        # Format row for readability
        truncated_row = [str(val)[:30] if val is not None else "NULL" for val in row[:6]]
        print("  ->", truncated_row)

conn.close()
