#!/usr/bin/env python3
"""Copy built session folders into a project vault's working copy, with an index and a README.

usage: fill_vault.py <out_dir>/<vault> <vault_dir> <label> <description>
Writes <vault_dir>/packs/pack-NNN.zip (whole sessions packed, each zip under ~3.5 MB), index.json (with pack_map per session), README.md; and <out_dir>/<vault>.packs.json for catalog.py.
"""
import json, os, shutil, sys, datetime

src, dst, label, desc = sys.argv[1:5]
import zipfile, zlib
CAP = 3_400_000          # each pack stays under ~3.5 MB, so a browser (and the explorer) can read it in one go
# Small files cost most on push (each object is its own S3 write), so whole sessions are packed together into
# packs/pack-NNN.zip, filled in folder order (a new session only changes the last pack). index.json maps every
# session file to [pack, member]; the explorer opens a pack in memory and reads the member.
if os.path.isdir(os.path.join(dst, 'sessions')):
    shutil.rmtree(os.path.join(dst, 'sessions'))
pdir = os.path.join(dst, 'packs')
if os.path.isdir(pdir):
    shutil.rmtree(pdir)
os.makedirs(pdir)
metas, items = [], []
for folder in sorted(os.listdir(src)):
    s = os.path.join(src, folder)
    if not os.path.isdir(s) or not os.path.exists(os.path.join(s, 'meta.json')):
        continue
    meta = json.load(open(os.path.join(s, 'meta.json')))
    one = {'meta': meta}
    for name in ('analysis', 'review'):
        pth = os.path.join(s, name + '.json')
        if os.path.exists(pth):
            one[name] = json.load(open(pth))
    files = [('session.json', json.dumps(one, ensure_ascii=False, indent=1).encode())]
    for f in sorted(os.listdir(s)):
        if f.startswith('events') or f in ('transcript.md', 'messages.jsonl.gz'):
            files.append((f, open(os.path.join(s, f), 'rb').read()))
    for f, b in files:
        stored = f.endswith('.gz')
        size = len(b) if stored else len(zlib.compress(b, 6))
        items.append((folder, f, b, stored, size))
    metas.append(meta)
packs, cur, cur_size = [], [], 0
for it in items:
    if cur and cur_size + it[4] + 200 > CAP:
        packs.append(cur); cur, cur_size = [], 0
    cur.append(it); cur_size += it[4] + 200
if cur:
    packs.append(cur)
fmap = {}
for i, pk in enumerate(packs):
    name = f'pack-{i:03d}.zip'
    with zipfile.ZipFile(os.path.join(pdir, name), 'w') as z:
        for folder, f, b, stored, _ in pk:
            zi = zipfile.ZipInfo(f'{folder}/{f}', date_time=(1980, 1, 1, 0, 0, 0))
            zi.compress_type = zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED
            zi.external_attr = 0o644 << 16
            z.writestr(zi, b)
            fmap.setdefault(folder, {})[f] = ['packs/' + name, f'{folder}/{f}']
json.dump(fmap, open(src.rstrip('/') + '.packs.json', 'w'), indent=0)
for m in metas:
    m['pack_map'] = fmap.get(m['folder'], {})
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
json.dump({'label': label, 'description': desc, 'generated': now, 'sessions': metas}, open(os.path.join(dst, 'index.json'), 'w'), indent=1, ensure_ascii=False)
rows = '\n'.join(f"| {m.get('created_at','')[:10]} | {m.get('title','')} | {m.get('events',0):,} | {m.get('person_messages',0)} | `{(m.get('pack_map') or {}).get('session.json', ['?'])[0]}` |" for m in sorted(metas, key=lambda m: m.get('created_at') or ''))
open(os.path.join(dst, 'README.md'), 'w').write(f"""# {label}

{desc}

Archived from {os.environ.get('OWNER','the owner')}'s Claude Code account by {os.environ.get('AGENT','an archive agent')} on {now[:10]}. This vault is one of the project vaults of the master vault `sessions-master`, which holds its key, a search catalogue and the Sessions Explorer.

Sessions are packed into `packs/pack-NNN.zip` (each under ~3.5 MB, so few files to push and each readable in a browser); `index.json` gives, for every session, which pack holds each of its files (`pack_map`). Inside a pack, each session is a folder `<folder>/` with:
- `events-NNN.jsonl.gz`: the full raw record, oldest first, in parts;
- `transcript.md`: a readable transcript;
- `messages.jsonl.gz`: one line per message;
- `session.json`: the account's record of the session plus counts (meta), the analysis (stats, the observed ABP, rule findings) and the reviewer's findings.

Text that looked like a secret was replaced with `[redacted]`; the count is in each `session.json` (meta.redactions).

| Created | Session | Events | Your messages | Pack |
|---|---|---|---|---|
{rows}
""")
print(f'FILLED {dst}: {len(metas)} sessions in {len(packs)} packs')
