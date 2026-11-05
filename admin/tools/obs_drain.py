#!/usr/bin/env python3
"""Drain observability@web-summit.dinis's experiment vault (kuuqr3do; 5 November 2026, at Dinis Cruz's word), beside
Jose's telemetry_drain.py (WS-37), whose steps it keeps:

    python3 -I admin/tools/obs_drain.py [--creds ~/.sg-send/obs-dinis/creds.json] [--vault ~/vaults/obs-dinis-data] [--dry]

1. pull the vault; 2. list every lane with the enum key; 3. fetch in batches of 50; 4. open each with the drain key
(identity/private/ in the vault); 5. verify: a page event (assets/obs-dinis.js) against data/person-keys.json, as
telemetry_drain.py does; an agent run (admin/tools/agent-log.mjs) against the agent's own key on data/keys.json: the
signing fingerprint must be an active key whose label is that agent, and the signature must be over this record;
6. append to drain/<today>.jsonl; 7. write reports/latest.json; 8. commit and push; 9. only then mark processed.
Prints counts only, never a key or an event. Every record is an untrusted claim: the tokens are public.
"""
import argparse, base64, collections, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.dont_write_bytecode = True                                           # no __pycache__ in the clone (the gate refuses it)
sys.path.insert(0, os.path.join(ROOT, 'admin', 'tools'))
import telemetry_drain as td                                          # post(), sgit(), verify() for page events

def agent_of(k):
    return ((k.get('bundle') or {}).get('label') or k.get('label') or '').split()[0]

def verify_agent(rec, keys):
    sg = rec.pop('sig', None)
    if not sg: rec['signed'] = False; return rec
    try:
        from cryptography.hazmat.primitives.asymmetric import ec, utils
        from cryptography.hazmat.primitives import hashes, serialization
        k = next((k for k in keys if (k.get('bundle') or {}).get('signing_fingerprint') == sg.get('key')), None)
        if not k: raise ValueError(f"no published key {sg.get('key')}")
        if agent_of(k) != rec.get('agent'): raise ValueError(f"key {sg.get('key')} is {agent_of(k)}'s, not {rec.get('agent')}'s")
        if k.get('status') not in (None, '', 'active') or k.get('replaced_by'): raise ValueError(f"key {sg.get('key')} is {k.get('status')}")
        pub = serialization.load_pem_public_key(k['bundle']['sign'].encode())
        raw = base64.b64decode(sg['sig'])
        pub.verify(utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big')), sg['over'].encode(), ec.ECDSA(hashes.SHA256()))
        if json.loads(sg['over']) != {x: y for x, y in rec.items()}: raise ValueError('the record differs from what was signed')
        rec['signed'] = True; rec['key'] = sg['key']; rec['key_id'] = k['id']
    except Exception as e:
        rec['signed'] = False; rec['sig_finding'] = f'{type(e).__name__}: {e}'[:200]
    return rec

def report(rows, drained_now, today):
    good = [r for r in rows if r.get('v') == 1 and not r.get('test')]
    pages = [r for r in good if r.get('type') in ('view', 'read')]
    views, reads, runs = [r for r in pages if r['type'] == 'view'], [r for r in pages if r['type'] == 'read'], [r for r in good if r.get('type') == 'web-summit.agent-run/v1']
    C = collections.Counter
    team_reads = collections.defaultdict(lambda: {'views': 0, 'reads': 0, 'visible_s': 0, 'max_scroll': 0})
    for r in pages:
        if not r.get('verified'): continue
        t = team_reads[(r['person'], r['path'])]
        if r['type'] == 'view': t['views'] += 1
        else: t['reads'] += 1; t['visible_s'] += r.get('visible_s', 0); t['max_scroll'] = max(t['max_scroll'], r.get('scroll', 0))
    agents = collections.defaultdict(lambda: {'runs': 0, 'signed': 0, 'read_md': 0, 'read_html': 0, 'read_repo': 0, 'did': 0, 'last': ''})
    for r in runs:
        a = agents[r.get('agent', '?')]; a['runs'] += 1; a['signed'] += 1 if r.get('signed') else 0; a['did'] += len(r.get('did', []))
        for x in r.get('read', []):
            a['read_repo' if str(x.get('url', '')).startswith('repo:') else 'read_md' if x.get('as') == 'md' else 'read_html'] += 1
        a['last'] = max(a['last'], r.get('run', ''))
    read_by = collections.defaultdict(set)                              # url -> agents that read it
    for r in runs:
        for x in r.get('read', []): read_by[x.get('url')].add(r.get('agent'))
    return {'as_of': today, 'drained_now': drained_now, 'records': len(good), 'test_or_undecryptable': len(rows) - len(good),
            'pages': {'views': len(views), 'reads': len(reads), 'sessions': len({r.get('sid') for r in pages}),
                      'by_day': sorted(C(str(r.get('ts', ''))[:10] for r in views).items()),
                      'by_path': C(r.get('path') for r in views).most_common(50),
                      'by_agent_class': C(r.get('agent', '') for r in views).most_common(10),
                      'read_seconds_by_path': sorted(((p, sum(r.get('visible_s', 0) for r in reads if r.get('path') == p)) for p in {r.get('path') for r in reads}), key=lambda x: -x[1])[:50],
                      'team': [{'person': p, 'path': path, **v} for (p, path), v in sorted(team_reads.items())],
                      'signature_findings': sum(1 for r in pages if r.get('sig_finding'))},
            'agents': {'runs': len(runs), 'signed': sum(1 for r in runs if r.get('signed')),
                       'by_agent': dict(sorted(agents.items())),
                       'most_read': sorted(((u, sorted(a)) for u, a in read_by.items()), key=lambda x: -len(x[1]))[:50],
                       'signature_findings': sum(1 for r in runs if r.get('sig_finding'))},
            'note': 'Counts over records received in the lanes. Every record is an untrusted claim: the tokens and the key are public, so rows can be forged or flooded; a signed one names a key on this site.'}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/obs-dinis/creds.json'))
    ap.add_argument('--vault', default=os.path.expanduser('~/vaults/obs-dinis-data'))
    ap.add_argument('--dry', action='store_true')
    o = ap.parse_args()
    c = json.load(open(o.creds))
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    pki = PKI__Crypto()
    if not o.dry: td.sgit(o.vault, 'pull')
    entries, after = [], None
    while True:
        r = td.post(c, 'list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})})
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    lanes = collections.OrderedDict()
    for e in entries: lanes.setdefault(e['inbox'], []).append(e['file_id'])
    print(f"obs_drain: {len(entries)} pending in {len(lanes)} lane(s)" + ''.join(f"; lane {c['tokens'].index(t) + 1 if t in c['tokens'] else '?'}: {len(ids)}" for t, ids in lanes.items()))
    if o.dry or not entries: return
    key = pki.import_private_key_pem(open(os.path.join(o.vault, 'identity/private/private_key.pem')).read())
    people = json.load(open(os.path.join(ROOT, 'data/person-keys.json')))['keys']
    keys = json.load(open(os.path.join(ROOT, 'data/keys.json')))['keys']
    rows, done, bad = [], collections.defaultdict(list), 0
    for token, ids in lanes.items():
        lane = c['tokens'].index(token) + 1 if token in c['tokens'] else 0
        for i in range(0, len(ids), 50):
            for f in td.post(c, 'fetch', {'inbox': token, 'file_ids': ids[i:i + 50]}).get('files', []):
                try:
                    ev = json.loads(pki.hybrid_decrypt(key, base64.b64decode(f['content']).decode())['plaintext'])
                    ev = verify_agent(ev, keys) if ev.get('type') == 'web-summit.agent-run/v1' else td.verify(ev, people)
                except Exception as e: ev = {'v': 0, 'undecryptable': True, 'error': type(e).__name__}; bad += 1
                ev['_file'] = f['file_id']; ev['_lane'] = lane
                ev['_received'] = int(f['file_id'][:13]) if f['file_id'][:13].isdigit() else None
                rows.append(ev); done[token].append(f['file_id'])
    today = time.strftime('%Y-%m-%d', time.gmtime())
    for d in ('drain', 'reports'): os.makedirs(os.path.join(o.vault, d), exist_ok=True)
    seen = set()
    for name in os.listdir(os.path.join(o.vault, 'drain')):
        if name.endswith('.jsonl'): seen |= {json.loads(l).get('_file') for l in open(os.path.join(o.vault, 'drain', name)) if l.strip()}
    with open(os.path.join(o.vault, f'drain/{today}.jsonl'), 'a') as out:
        for ev in rows:
            if ev['_file'] not in seen: out.write(json.dumps(ev, sort_keys=True) + '\n'); seen.add(ev['_file'])
    allrows = []
    for name in sorted(os.listdir(os.path.join(o.vault, 'drain'))):
        if name.endswith('.jsonl'): allrows += [json.loads(l) for l in open(os.path.join(o.vault, 'drain', name)) if l.strip()]
    allrows = list({r.get('_file') or id(r): r for r in allrows}.values())
    rep = report(allrows, len(rows), today)
    for name in ('latest.json', f'{today}.json'):
        with open(os.path.join(o.vault, 'reports', name), 'w') as out: json.dump(rep, out, indent=2)
    td.sgit(o.vault, 'commit', '-m', f'drain {time.strftime("%Y-%m-%dT%H:%MZ", time.gmtime())}: {len(rows)} record(s)')
    td.sgit(o.vault, 'push')
    for token, ids in done.items():
        for i in range(0, len(ids), 100): td.post(c, 'mark-processed', {'inbox': token, 'file_ids': ids[i:i + 100]})
    print(f"obs_drain: drained {len(rows)} ({bad} undecryptable), pushed, marked processed; totals {rep['pages']['views']} views, "
          f"{rep['pages']['reads']} reads, {rep['agents']['runs']} agent runs ({rep['agents']['signed']} signed), "
          f"{rep['pages']['signature_findings'] + rep['agents']['signature_findings']} signature finding(s)")

if __name__ == '__main__':
    main()
