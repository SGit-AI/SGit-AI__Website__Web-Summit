#!/usr/bin/env python3
"""Harvest list_events pages from a helper agent's own transcript (a .jsonl), so small pages that came back inline
are stored without anyone copying them by hand.

usage: harvest.py <agent_transcript.jsonl> [session_id ...]
For every list_events call in the transcript (optionally only for the given sessions), the exact tool result text is
written to a temporary inline-harvest-*.json file and passed to ingest.py, which checks it (first and last ids, the
wrong-session guard) and stores it; duplicates are dropped when the session is built. Prints ingest.py's lines.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')

def texts(content):
    if isinstance(content, str):
        return [content]
    out = []
    for b in content or []:
        if isinstance(b, dict) and b.get('type') == 'text':
            out.append(b.get('text', ''))
    return out

def main():
    path, only = sys.argv[1], set(sys.argv[2:])
    calls = {}
    n = 0
    for line in open(path, encoding='utf-8', errors='replace'):
        try:
            e = json.loads(line)
        except Exception:
            continue
        msg = e.get('message') or {}
        for b in msg.get('content') or [] if isinstance(msg.get('content'), list) else []:
            if not isinstance(b, dict):
                continue
            if b.get('type') == 'tool_use' and str(b.get('name', '')).endswith('list_events'):
                calls[b.get('id')] = (b.get('input') or {}).get('session_id')
            elif b.get('type') == 'tool_result' and b.get('tool_use_id') in calls:
                sid = calls[b['tool_use_id']]
                if only and sid not in only:
                    continue
                for t in texts(b.get('content')):
                    if '"ccr"' not in t or '"data"' not in t:
                        continue          # a saved-to-file notice or an error: that page is already a file, or failed
                    n += 1
                    tmp = os.path.join(ROOT, f'inline-harvest-{os.getpid()}-{n}.json')
                    open(tmp, 'w', encoding='utf-8').write(t)
                    r = subprocess.run([sys.executable, '-I', os.path.join(HERE, 'ingest.py'), sid, tmp], capture_output=True, text=True, env={**os.environ, 'ARCHIVE_HARVEST': '1'})
                    print((r.stdout or r.stderr).strip())
                    if os.path.exists(tmp):
                        os.remove(tmp)
    print(f'harvested {n} inline pages from {os.path.basename(path)}')

if __name__ == '__main__':
    main()
