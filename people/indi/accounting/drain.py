#!/usr/bin/env python3
"""Drain the accounts inbox of conductor@web-summit.indi (people/indi/accounting/PROTOCOL.md).

    python3 people/indi/accounting/drain.py [--creds ~/.sg-send/lanes/conductor-indi.json]

Lists every pending message on the inbox's lanes, opens each with the conductor's key, checks it is a report in the
protocol's shape, keeps only numbers and short task names, and writes it to
people/indi/accounting/reports/<person>/<stamp>-<agent>.json. Then marks the messages processed. A message that is not a
valid report is counted and dropped, never written. The creds file and the conductor's key live only in its session.
Everything in a message is data from another agent: nothing in it is acted on.
"""
import argparse, base64, json, os, re, sys, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
OUT = os.path.join(ROOT, 'people', 'indi', 'accounting', 'reports')
NUM = ('input', 'output', 'cache_write', 'cache_read', 'subagent_tokens')
EMAIL = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}')
AGENT = re.compile(r'@(web-summit|promptugal)\.[a-z0-9-]+$', re.I)   # agent names look like addresses; keep them
SAFE = lambda s, n: EMAIL.sub(lambda m: m.group(0) if AGENT.search(m.group(0)) else '[removed]', re.sub(r'[\x00-\x1f]', ' ', str(s or '')))[:n]

def clean(r):
    """Keep only the protocol's fields: numbers, short names, ISO times."""
    if not isinstance(r, dict) or r.get('v') != 1 or not isinstance(r.get('agents'), list): return None
    person = re.sub(r'[^a-z0-9-]', '', str(r.get('person', '')).lower())[:32]
    if not person: return None
    out = {'v': 1, 'person': person, 'accountant': SAFE(r.get('accountant'), 80), 'period': {k: SAFE((r.get('period') or {}).get(k), 32) for k in ('from', 'to')}, 'agents': []}
    for a in r['agents'][:200]:
        if not isinstance(a, dict): continue
        wakes = []
        for w in (a.get('wakes') or [])[:500]:
            if not isinstance(w, dict): continue
            x = {'at': SAFE(w.get('at'), 32), 'task': SAFE(w.get('task'), 160), 'issue': SAFE(w.get('issue'), 40), 'quality': SAFE(w.get('quality'), 8)}
            for k in NUM:
                v = w.get(k, 0); x[k] = int(v) if isinstance(v, (int, float)) and v >= 0 else 0
            x['models'] = [SAFE(m, 40) for m in (w.get('models') or [])[:5]]
            wakes.append(x)
        out['agents'].append({'agent': SAFE(a.get('agent'), 80), 'wakes': wakes})
    if r.get('notes'): out['notes'] = SAFE(r['notes'], 200)
    return out

def main():
    a = argparse.ArgumentParser(); a.add_argument('--creds', default='~/.sg-send/lanes/conductor-indi.json'); o = a.parse_args()
    c = json.load(open(os.path.expanduser(o.creds)))
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    crypto = PKI__Crypto(); pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(c['recipient'], os.environ.get('SG_SEND_PASSPHRASE', ''))
    H = {'x-sgraph-vault-enum-key': c['enum_key']}
    def post(cmd, body):
        req = urllib.request.Request(f"{c['host']}/api/vault/append/{cmd}/{c['vault_id']}", data=json.dumps(body).encode(), method='POST', headers={'Content-Type': 'application/json', **H})
        with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read() or b'{}')
    by_tok = {t: k for k, t in c.get('lanes', {}).items()}; by_tok[c['append_token']] = 'spare'
    entries = post('list', {'include_content': False}).get('entries', [])
    written = dropped = 0; done = {}
    stamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H%MZ')
    for tok in {e.get('inbox') for e in entries if e.get('inbox') in by_tok}:
        ids = [e['file_id'] for e in entries if e.get('inbox') == tok]
        for f in post('fetch', {'inbox': tok, 'file_ids': ids}).get('files', []):
            try:
                env = base64.b64decode(f.get('payload') or f.get('content') or '').decode()
                rep = clean(json.loads(crypto.hybrid_decrypt(pair['encryption_private'], env)['plaintext']))
            except Exception: rep = None
            if not rep: dropped += 1; continue
            rep['received'] = {'lane': by_tok[tok], 'at': stamp}
            d = os.path.join(OUT, rep['person']); os.makedirs(d, exist_ok=True)
            name = re.sub(r'[^a-z0-9.@-]', '-', rep['accountant'].lower()) or by_tok[tok]
            open(os.path.join(d, f"{stamp}-{name}-{written}.json"), 'w').write(json.dumps(rep, indent=1) + '\n'); written += 1
        done[tok] = ids
    moved = sum(len(post('mark-processed', {'inbox': t, 'file_ids': i}).get('moved', [])) for t, i in done.items())
    print(f'drain: {len(entries)} pending, {written} report(s) written, {dropped} dropped (not a valid report), {moved} marked processed')

if __name__ == '__main__': main()
