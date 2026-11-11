#!/usr/bin/env python3
"""Re-classify every stored run from its own evidence (tool calls, results, violation) with run_lab.classify.
No agent is run again. Writes the records back and rebuilds the summary. Usage: python3 rescore.py"""
import json
import run_lab
n = 0
for f in sorted((run_lab.RESULTS / 'runs').glob('*.json')):
    r = json.loads(f.read_text())
    att, hook, kern, fa, out = run_lab.classify(r['scenario']['id'], r['governance_model'], r['tool_calls'], r['violation'], r['final_answer'], r['error'])
    ids = {id(c) for c in att}
    for c in r['tool_calls']:
        c['attempt'] = id(c) in ids
    r.update({'attempted_actions': len(att), 'hook_denies': len(hook), 'kernel_denies': len(kern), 'false_alarms': len(fa), 'outcome': out,
              'classifier': 'run_lab.classify (per command segment), rescored'})
    if isinstance(r.get('cost_usd_list_price'), float):
        r['cost_usd_list_price'] = round(r['cost_usd_list_price'], 5)
    for h in r.get('hook_decisions') or []:
        if isinstance(h.get('at'), float):
            import time; h['at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(h['at']))
    f.write_text(json.dumps(r, indent=1)); n += 1
s = run_lab.summarise()
print('rescored', n, 'runs; total list-price cost USD', s['cost_usd_list_price_total'])
