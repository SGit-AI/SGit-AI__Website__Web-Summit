#!/usr/bin/env python3
"""The accountant's tally: per agent, the ledger lines since a time, each stretch of time counted once.
Usage: python3 -I people/indi/accountant/tally.py <since ISO> [--json]
- A line whose --since window sits inside a wider line of the same agent is skipped (counted in the wider one).
- Sub-agent totals that repeat exactly on several lines of one agent are counted once.
- Fresh = input + output + cache writes; cache reads apart. Context per call = cache reads / calls.
Numbers only. By accountant@web-summit.indi (WS-148)."""
import glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
since = sys.argv[1]
out = []
for p in sorted(glob.glob(os.path.join(HERE, 'ledger', '*.jsonl'))):
    L = [json.loads(l) for l in open(p) if l.strip()]
    L = [d for d in L if d['at'] >= since]
    if not L: continue
    win = lambda d: ((d.get('since') or d['at']), d['at'])
    keep = [d for d in L if not any(e is not d and win(e)[0] <= win(d)[0] and win(d)[1] <= win(e)[1] and win(e) != win(d) for e in L)]
    s = lambda k: sum(d['session'][k] for d in keep)
    subs, seen = [], set()
    for d in keep:
        u = d['subagents']; key = (u['total_without_cache_reads'], u['cache_read_input_tokens'])
        if key in seen or key == (0, 0): continue
        seen.add(key); subs.append(u)
    sf = sum(u['total_without_cache_reads'] for u in subs); scr = sum(u['cache_read_input_tokens'] for u in subs)
    fresh = s('total_without_cache_reads')
    out.append({'agent': L[0]['agent'], 'lines': len(L), 'wakes': len(keep), 'input': s('input_tokens'), 'output': s('output_tokens'),
                'cache_write': s('cache_creation_input_tokens'), 'cache_read': s('cache_read_input_tokens'), 'sub_fresh': sf, 'sub_cache_read': scr,
                'fresh_total': fresh + sf, 'per_wake': round((fresh + sf) / len(keep)), 'pass': sum(d['quality'] == 'pass' for d in keep),
                'reload_share': round(s('cache_creation_input_tokens') / max(1, fresh), 2),
                'ctx_per_call': [d['session']['cache_read_input_tokens'] // max(1, d['session']['calls']) for d in keep],
                'models': sorted({m for d in keep for m in d['session']['by_model']}),
                'tasks': [(d['at'][5:16], (d['task'] or '')[:60]) for d in keep]})
if '--json' in sys.argv: print(json.dumps(out, indent=1)); sys.exit()
T = dict(fresh=0, cr=0)
for r in out:
    T['fresh'] += r['fresh_total']; T['cr'] += r['cache_read'] + r['sub_cache_read']
    print(f"{r['agent']}: wakes {r['wakes']}/{r['lines']} in {r['input']:,} out {r['output']:,} cw {r['cache_write']:,} cr {r['cache_read']:,} "
          f"sub {r['sub_fresh']:,}/{r['sub_cache_read']:,} per-wake {r['per_wake']:,} pass {r['pass']} reload {r['reload_share']} ctx {r['ctx_per_call']} {r['models']}")
    for t in r['tasks']: print('   ', *t)
print(f"TOTAL fresh {T['fresh']:,} cache reads {T['cr']:,}")
