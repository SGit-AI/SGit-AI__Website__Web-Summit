#!/usr/bin/env python3
"""Turn the vault plan into the files the pipeline reads, and cut the export batches.

usage: plan.py            (run from the kit folder)
reads   plan.json       {"<vault>": {"label": "...", "description": "...", "sessions": ["session_...", ...]}, ...}
        sessions/all.jsonl (from sessions/build_list.py), used only to check every id exists
writes  sessions/groups.json, vaults.json, vaults-catalog.json, vaults-catalog-now.json (empty until a vault is pushed)
        batches/b-NNN   first line the vault, then up to 3 session ids (a helper exports one batch)
Sessions already built under out/<vault>/ are left out of the batches, so it is safe to run again.
"""
import glob, json, os

plan = json.load(open('plan.json'))
known = {json.loads(l)['id'] for l in open('sessions/all.jsonl') if l.strip()}
built = {p.split('__')[-1] for p in glob.glob('out/*/*__session_*')}
groups, vj = {}, {}
for v, info in plan.items():
    ids = info.get('sessions', [])
    missing = [s for s in ids if s not in known]
    if missing:
        raise SystemExit(f'{v}: {len(missing)} ids not in sessions/all.jsonl, e.g. {missing[0]}')
    groups[v] = ids
    vj[v] = {'label': info.get('label', v), 'description': info.get('description', '')}
json.dump(groups, open('sessions/groups.json', 'w'), indent=1)
for f in ('vaults.json', 'vaults-catalog.json'):
    old = json.load(open(f)) if os.path.exists(f) else {}
    for v, d in vj.items():
        old.setdefault(v, {}).update(d)
    json.dump(old, open(f, 'w'), indent=1, ensure_ascii=False)
if not os.path.exists('vaults-catalog-now.json'):
    json.dump({}, open('vaults-catalog-now.json', 'w'))
os.makedirs('batches', exist_ok=True)
for f in glob.glob('batches/b-*'):
    os.remove(f)
n = 0
for v, ids in groups.items():
    todo = [s for s in ids if s not in built]
    for i in range(0, len(todo), 3):
        open(f'batches/b-{n:03d}', 'w').write('\n'.join([v] + todo[i:i + 3]) + '\n')
        n += 1
total = sum(len(x) for x in groups.values())
print(f'{len(groups)} vaults, {total} sessions, {len(built & {s for x in groups.values() for s in x})} built, {n} batches to export')
