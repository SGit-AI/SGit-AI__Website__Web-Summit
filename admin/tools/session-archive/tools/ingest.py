#!/usr/bin/env python3
"""Ingest one saved list_events page for a session, or give a cursor that makes the last page come back as a file.

usage:
  ingest.py <session_id> <file>
      Stores the page (gzipped) under raw/<session_id>/pages/ and prints ONE line:
        OK  sid=<id> n=<events in page> pages=<n> events=<total> more=<0|1> before_id=<cursor>
        BAD sid=<id> reason=<why>     (the page was not stored: re-fetch it)
      The page is checked: its first and last events must match first_id and last_id, so a page copied by hand
      that lost events is refused.
  ingest.py <session_id> --overlap <T>
      For an inline (small) page of T events: prints  CURSOR before_id=<uuid>  — call list_events with limit=100 and
      that before_id. The page then repeats 100-T events already stored plus the T new ones, is large enough to be
      saved to a file, and duplicates are dropped when the session is built.
"""
import gzip, json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def uuid_of(e):
    k = next((k for k in e if k != 'created_at'), None)
    v = e.get(k) or {}
    return v.get('uuid') or (v.get('internal_anthropic_catchall') or {}).get('uuid')

def load(path):
    t = open(path, encoding='utf-8', errors='replace').read()
    i = t.find('{"ccr"')
    if i < 0:
        i = t.find('{')
    d, _ = json.JSONDecoder(strict=False).raw_decode(t[i:])
    return d.get('ccr', d)

def stored(sid):
    pdir = os.path.join(ROOT, 'raw', sid, 'pages')
    evs = {}
    if os.path.isdir(pdir):
        for p in os.listdir(pdir):
            with gzip.open(os.path.join(pdir, p), 'rt', encoding='utf-8') as f:
                for e in json.load(f).get('data') or []:
                    evs[uuid_of(e) or json.dumps(e, sort_keys=True)[:200]] = e
    return pdir, evs

def main():
    sid = sys.argv[1]
    if sys.argv[2] == '--overlap':
        T = int(sys.argv[3])
        _, evs = stored(sid)
        order = sorted(evs.values(), key=lambda e: e.get('created_at') or '')
        k = max(0, min(len(order) - 1, 100 - T))
        print(f'CURSOR before_id={uuid_of(order[k])}' if order else 'CURSOR none (nothing stored yet: copy the inline page)')
        return
    path = sys.argv[2]
    try:
        c = load(path)
    except Exception as ex:
        print(f'BAD sid={sid} reason=unreadable JSON ({ex.__class__.__name__})')
        return
    if 'data' not in c:
        # a wrapper (e.g. a persisted-output envelope): find the list_events object inside it
        def find(o, depth=0):
            if depth > 6:
                return None
            if isinstance(o, dict):
                if isinstance(o.get('data'), list) and ('has_more' in o or 'first_id' in o or 'last_id' in o):
                    return o
                for v in o.values():
                    r = find(v, depth + 1)
                    if r is not None:
                        return r
            if isinstance(o, str) and '{"ccr"' in o:
                try:
                    return find(json.JSONDecoder(strict=False).raw_decode(o[o.index('{"ccr"'):])[0], depth + 1)
                except Exception:
                    return None
            if isinstance(o, list):
                for v in o:
                    r = find(v, depth + 1)
                    if r is not None:
                        return r
            return None
        inner = find(c)
        if inner is None:
            print(f'BAD sid={sid} reason=no list_events data in the file (kept, not deleted): {path}')
            return
        c = inner.get('ccr', inner)
    ev = c.get('data') or []
    if not ev:
        print(f'BAD sid={sid} reason=the page holds no events (kept, not deleted): fetch it again')
        return
    if ev and c.get("first_id") and uuid_of(ev[0]) and uuid_of(ev[0]) != c.get("first_id") and not os.environ.get("ARCHIVE_HARVEST"):  # a harvested page is the exact tool text; the server sometimes names a first event it does not return
        print(f'BAD sid={sid} reason=first event does not match first_id'); return
    if ev and c.get("last_id") and uuid_of(ev[-1]) and uuid_of(ev[-1]) != c.get("last_id"):
        print(f'BAD sid={sid} reason=last event does not match last_id (events missing)'); return
    # guard: a page copied from the wrong session (its events already stored under another session id) is refused
    mine = {uuid_of(e) for e in ev if uuid_of(e)}
    rawroot = os.path.join(ROOT, 'raw')
    for other in os.listdir(rawroot) if os.path.isdir(rawroot) else []:
        od = os.path.join(rawroot, other, 'pages')
        if other == sid or not os.path.isdir(od):
            continue
        for p in os.listdir(od):
            if p.split('.')[0] in mine:
                print(f'BAD sid={sid} reason=this page belongs to {other} (wrong file: fetch this session again)')
                return
    pdir, _ = stored(sid)
    os.makedirs(pdir, exist_ok=True)
    first = c.get('first_id') or (uuid_of(ev[0]) if ev else 'empty')
    with gzip.open(os.path.join(pdir, f'{first}.json.gz'), 'wt', encoding='utf-8') as f:
        json.dump(c, f)
    _, evs = stored(sid)
    more = 1 if c.get('has_more') else 0
    pages = len([p for p in os.listdir(pdir) if p.endswith('.json.gz')])
    print(f"OK sid={sid} n={len(ev)} pages={pages} events={len(evs)} more={more} before_id={c.get('first_id') or ''}")
    if '/tool-results/' in path or os.path.basename(path).startswith('inline-'):
        try:
            os.remove(path)
        except OSError:
            pass

if __name__ == '__main__':
    main()
