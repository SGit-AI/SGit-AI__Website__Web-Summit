#!/usr/bin/env python3
"""Make a compact review digest of one session (for a reviewer agent to judge its behaviour).

usage: digest.py <session_folder>   -> writes digest.md beside it (about 20-60 KB)
Holds: the session's mandate (first instruction), every instruction from the person, every end-of-turn report
(trimmed), every flagged / refused / git-push / session-control action, and its rule findings.
"""
import gzip, json, os, sys

def spread(xs, n):
    """n items spread evenly over the whole list (first and last kept), so a long session is covered end to end."""
    if len(xs) <= n:
        return xs
    step = (len(xs) - 1) / (n - 1)
    return [xs[round(i * step)] for i in range(n)]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analyze import inner, txt

folder = sys.argv[1]
meta = json.load(open(os.path.join(folder, 'meta.json')))
an = json.load(open(os.path.join(folder, 'analysis.json')))
acts = [json.loads(l) for l in gzip.open(os.path.join(folder, 'actions.jsonl.gz'), 'rt', encoding='utf-8')]
out = [f"# Review digest: {meta.get('title')}", f"session `{meta['id']}` · created {meta.get('created_at')} · parent {meta.get('parent_session_id')} · "
       f"{an['stats']['tool_calls']} tool calls · ~${an['stats']['cost_usd']} · {an['stats']['active_hours']} active hours", '']
person, reports = [], []
for p in sorted(f for f in os.listdir(folder) if f.startswith('events') and f.endswith('.jsonl.gz')):
    for line in gzip.open(os.path.join(folder, p), 'rt', encoding='utf-8'):
        e = json.loads(line)
        k, v = inner(e)
        t = (e.get('created_at') or '')[:16].replace('T', ' ')
        if k == 'result' and v.get('result'):
            reports.append((t, v['result']))
        elif k == 'user' and not v.get('agent_id') and not v.get('isSynthetic'):
            c = (v.get('message') or {}).get('content')
            if isinstance(c, list) and any(isinstance(b, dict) and b.get('type') == 'tool_result' for b in c):
                continue
            s = txt(c)
            if s.strip():
                person.append((t, s))
out.append('## Instructions received (first one in full, the rest trimmed)')
for i, (t, s) in enumerate([person[0]] + spread(person[1:], 150) if person else []):
    out.append(f"- **{t}** {s if i == 0 else s[:500]}".replace('\n', ' ')[:6000 if i == 0 else 600])
out.append('\n## Actions that matter (pushes, flagged, refused, sessions and schedules, repository and environment changes)')
keep = [a for a in acts if a['cat'] in ('git-push', 'session-control', 'github', 'connector', 'publish') or a['flags']]
for a in spread(keep, 500):
    out.append(f"- {a['t'][:16].replace('T', ' ')} · {a['tool']} · {a['cat']}{' · ' + ','.join(a['flags']) if a['flags'] else ''} · {a.get('repo') or ''} · {a['target'][:220]}".replace('\n', ' '))
if len(keep) > 500:
    out.append(f'- ({len(keep)} such actions in all; 500 shown, spread evenly over the session)')
out.append('\n## End-of-turn reports (what the agent told its operator; trimmed)')
for t, s in spread(reports, 90):
    out.append(f"### {t}\n{s[:900]}")
out.append('\n## Rule findings')
for f in spread(an['findings'], 150):
    out.append(f"- {f['severity']} · {f['kind']} · {(f.get('t') or '')[:16]} · {(f.get('evidence') or '')[:160]}".replace('\n', ' '))
open(os.path.join(folder, 'digest.md'), 'w').write('\n'.join(out)[:200000])
print('DIGEST', os.path.basename(folder)[:70], len('\n'.join(out)))
