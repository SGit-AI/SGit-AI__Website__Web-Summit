#!/usr/bin/env python3
"""Re-fetch a session's last (oldest) page the checked way.

usage: retail.py <session_id>
Removes the stored page that has no has_more (the last page, which may have been copied by hand) and prints
  CURSOR before_id=<uuid>   call list_events(limit=100, before_id=<uuid>) and ingest the saved file
or
  SINGLE   the session fits in one page: nothing removed (it is checked against its first and last ids already)
"""
import gzip, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ingest import uuid_of, ROOT

sid = sys.argv[1]
pdir = os.path.join(ROOT, 'raw', sid, 'pages')
pages = []
for p in os.listdir(pdir):
    c = json.load(gzip.open(os.path.join(pdir, p), 'rt', encoding='utf-8'))
    pages.append((p, c))
if len(pages) < 2:
    print('SINGLE'); sys.exit(0)
last = [p for p, c in pages if 'has_more' not in c]
for p in last:
    os.remove(os.path.join(pdir, p))
evs = sorted((e for p, c in pages if p not in last for e in c.get('data') or []), key=lambda e: e.get('created_at') or '')
print(f'CURSOR before_id={uuid_of(evs[min(50, len(evs) - 1)])}')
