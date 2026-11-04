#!/usr/bin/env python3
"""Drain the site's page-view lanes into the private data vault (WS-37; conductor@web-summit.jose, 4 November 2026,
at Jose Bota's word; from the observability pack, /observability-pack/, and the PHP newsroom's telemetry_drain.py).

    python3 -I admin/tools/telemetry_drain.py [--creds ~/.sg-send/obs/creds.json] [--vault ~/vaults/ws-observability-data] [--dry]

1. pull the vault; 2. list every lane with the enum key (no content); 3. fetch in batches of 50; 4. open each event with
the drain key (identity/private/ in the vault); 5. verify a signed event against data/person-keys.json (a failed
signature drops the person and is recorded as a finding); 6. append to drain/<today>.jsonl (sorted keys); 7. write
reports/latest.json; 8. commit and push the vault; 9. only then mark processed: a failed push loses nothing.
The same steps as the app's Queue & drain page (ws-observability-ux). Prints counts only, never a key or an event.
Every event is an untrusted claim: counted, never trusted.
"""
import argparse, base64, collections, json, os, subprocess, sys, time, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def post(c, op, body):
    req = urllib.request.Request(f"{c['host']}/api/vault/append/{op}/{c['vault_id']}", data=json.dumps(body).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': c['enum_key']})
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        raise SystemExit(f'telemetry_drain: {op} failed with {e.code}' + (' (a bad enum key or vault id returns 404)' if e.code == 404 else ''))

def sgit(vault, *args):
    r = subprocess.run(['sgit', *args], cwd=vault, capture_output=True, text=True)
    if r.returncode: raise SystemExit(f"telemetry_drain: sgit {args[0]} failed (exit {r.returncode}); nothing marked processed")

def verify(ev, keys):
    """A signed event names a team member: check the ECDSA P-256 signature over sig.over, and that over is this event."""
    sg = ev.pop('sig', None)
    if not ev.get('person') and not sg: return ev
    try:
        from cryptography.hazmat.primitives.asymmetric import ec, utils
        from cryptography.hazmat.primitives import hashes
        if not sg: raise ValueError('a person without a signature')
        k = next((k for k in keys if k['person'] == ev.get('person') and k['fingerprint'] == sg.get('key')), None)
        if not k: raise ValueError(f"no published key {sg.get('key')}")
        if k.get('status') != 'active': raise ValueError(f"key {k['fingerprint']} is {k.get('status')}, not active")
        b = lambda x: int.from_bytes(base64.urlsafe_b64decode(x + '=' * (-len(x) % 4)), 'big')
        pub = ec.EllipticCurvePublicNumbers(b(k['sign']['x']), b(k['sign']['y']), ec.SECP256R1()).public_key()
        raw = base64.b64decode(sg['sig'])
        pub.verify(utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big')), sg['over'].encode(), ec.ECDSA(hashes.SHA256()))
        over = json.loads(sg['over'])
        if any(over.get(f) != ev.get(f) for f in ('path', 'ts', 'sid', 'person')): raise ValueError('the event differs from what was signed')
        ev['verified'] = True; ev['key'] = k['fingerprint']
    except Exception as e:
        ev.pop('person', None); ev['sig_finding'] = f'{type(e).__name__}: {e}'[:200]
    return ev

def report(rows, drained_now, today):
    good = [r for r in rows if r.get('v') == 1 and not r.get('test')]
    top = lambda key, n=50: collections.Counter(str(r.get(key) or '') for r in good if key in r).most_common(n)
    team = [r for r in good if r.get('verified')]
    return {'as_of': today, 'drained_now': drained_now, 'events': len(good), 'test_or_undecryptable': len(rows) - len(good),
            'sessions': len({r.get('sid') for r in good}),
            'by_day': sorted(collections.Counter(str(r.get('ts', ''))[:10] for r in good).items()),
            'by_path': top('path'), 'by_referrer': top('ref', 20), 'by_screen': top('screen', 5), 'by_agent': top('agent', 10),
            'by_person': collections.Counter(r['person'] for r in team).most_common(),
            'by_person_path': sorted(collections.Counter((r['person'], r['path']) for r in team).items(), key=lambda x: -x[1])[:200],
            'signature_findings': sum(1 for r in good if r.get('sig_finding')),
            'note': 'Counts over events received in the lanes. Every event is an untrusted claim: the tokens and the key are public, so rows can be forged or flooded. No row leaves this vault.'}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/obs/creds.json'))
    ap.add_argument('--vault', default=os.path.expanduser('~/vaults/ws-observability-data'))
    ap.add_argument('--dry', action='store_true')
    o = ap.parse_args()
    c = json.load(open(o.creds))
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    pki = PKI__Crypto()
    if not o.dry: sgit(o.vault, 'pull')
    entries, after = [], None
    while True:
        r = post(c, 'list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})})
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    lanes = collections.OrderedDict()
    for e in entries: lanes.setdefault(e['inbox'], []).append(e['file_id'])
    print(f"telemetry_drain: {len(entries)} pending in {len(lanes)} lane(s)" + ''.join(f"; lane {c['tokens'].index(t) + 1 if t in c['tokens'] else '?'}: {len(ids)}" for t, ids in lanes.items()))
    if o.dry or not entries: return
    key = pki.import_private_key_pem(open(os.path.join(o.vault, 'identity/private/private_key.pem')).read())
    people = json.load(open(os.path.join(ROOT, 'data/person-keys.json')))['keys']
    rows, done, bad = [], collections.defaultdict(list), 0
    for token, ids in lanes.items():
        for i in range(0, len(ids), 50):
            for f in post(c, 'fetch', {'inbox': token, 'file_ids': ids[i:i + 50]}).get('files', []):
                try: ev = verify(json.loads(pki.hybrid_decrypt(key, base64.b64decode(f['content']).decode())['plaintext']), people)
                except Exception as e: ev = {'v': 0, 'undecryptable': True, 'error': type(e).__name__}; bad += 1
                ev['_file'] = f['file_id']; ev['_received'] = int(f['file_id'][:13]) if f['file_id'][:13].isdigit() else None
                rows.append(ev); done[token].append(f['file_id'])
    today = time.strftime('%Y-%m-%d', time.gmtime())
    os.makedirs(os.path.join(o.vault, 'drain'), exist_ok=True); os.makedirs(os.path.join(o.vault, 'reports'), exist_ok=True)
    seen = set()                                                      # a retried drain must not add a row twice
    for name in os.listdir(os.path.join(o.vault, 'drain')):
        if name.endswith('.jsonl'): seen |= {json.loads(l).get('_file') for l in open(os.path.join(o.vault, 'drain', name)) if l.strip()}
    with open(os.path.join(o.vault, f'drain/{today}.jsonl'), 'a') as out:
        for ev in rows:
            if ev['_file'] not in seen: out.write(json.dumps(ev, sort_keys=True) + '\n'); seen.add(ev['_file'])
    with open(os.path.join(o.vault, 'identity/person-keys.json'), 'w') as pk: json.dump({'keys': people}, pk, indent=2)
    allrows = []
    for name in sorted(os.listdir(os.path.join(o.vault, 'drain'))):
        if name.endswith('.jsonl'):
            allrows += [json.loads(l) for l in open(os.path.join(o.vault, 'drain', name)) if l.strip()]
    allrows = list({r.get('_file') or id(r): r for r in allrows}.values())
    rep = report(allrows, len(rows), today)
    for name in ('latest.json', f'{today}.json'):
        with open(os.path.join(o.vault, 'reports', name), 'w') as out: json.dump(rep, out, indent=2)
    sgit(o.vault, 'commit', '-m', f'drain {time.strftime("%Y-%m-%dT%H:%MZ", time.gmtime())}: {len(rows)} event(s)')
    sgit(o.vault, 'push')
    for token, ids in done.items():                                   # only after the push
        for i in range(0, len(ids), 100): post(c, 'mark-processed', {'inbox': token, 'file_ids': ids[i:i + 100]})
    print(f"telemetry_drain: drained {len(rows)} ({bad} undecryptable), pushed, marked processed; "
          f"totals {rep['events']} events, {rep['sessions']} sessions, {sum(n for _, n in rep['by_person'])} signed by the team, "
          f"{rep['signature_findings']} signature finding(s)")

if __name__ == '__main__':
    main()
