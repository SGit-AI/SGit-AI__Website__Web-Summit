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
import telemetry_drain as td
import obs_lets as lets

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

APP_SRC = os.path.join(ROOT, 'people', 'dinis', 'observability', 'app', 'index.htm')

def load_rows(vault):
    rows = []
    for name in sorted(os.listdir(os.path.join(vault, 'drain'))):
        if name.endswith('.jsonl'): rows += [json.loads(l) for l in open(os.path.join(vault, 'drain', name)) if l.strip()]
    return list({r.get('_file') or id(r): r for r in rows}.values())

CRAWLERS = ('googlebot', 'bingbot', 'bot')
GROUPS = ['readers', 'team', 'synthetic', 'crawlers']

def classes(pages):
    """Each tab (sid) gets one group, declared signals first, then inferred (the PHP newsroom's rules, observability pack 4)."""
    by = collections.defaultdict(list)
    for r in pages: by[r.get('sid')].append(r)
    out = {}
    for sid, rs in by.items():
        agents = {r.get('agent') for r in rs if r.get('agent')}
        first = min(rs, key=lambda r: str(r.get('ts', '')))
        if agents & set(CRAWLERS): g = 'crawlers'
        elif agents & {'webdriver', 'headless'}: g = 'synthetic'
        elif any(r.get('verified') for r in rs): g = 'team'
        elif sum(1 for r in rs if r.get('type') == 'view') > 40: g = 'crawlers'
        elif first.get('tz') in ('UTC', 'Etc/UTC', '') or str(first.get('lang', '')).endswith('@posix'): g = 'synthetic'
        else: g = 'readers'
        out[sid] = g
    return out

def public(rows, now):
    """What the public vault holds: counts per group, the team's named reads, the agents' runs. No anonymous row, no tab id,
    no time zone, no language, no referrer: an anonymous reader is only ever a count."""
    good = [r for r in rows if r.get('v') == 1 and not r.get('test')]
    pages = [{**r, 'path': lets.norm(r['path'])} for r in good if r.get('type') in ('view', 'read') and r.get('path')]
    runs = sorted([r for r in good if r.get('type') == 'web-summit.agent-run/v1'], key=lambda r: r.get('run', ''), reverse=True)
    cls = classes(pages)
    totals = {g: {'views': 0, 'reads': 0, 'sessions': 0} for g in GROUPS}
    for sid, g in cls.items(): totals[g]['sessions'] += 1
    daily = collections.defaultdict(lambda: {g: 0 for g in GROUPS})
    paths = collections.defaultdict(lambda: {'views': {g: 0 for g in GROUPS}, 'reads': 0, 's': 0, 'scroll': 0})
    for r in pages:
        g = cls[r.get('sid')]
        if r['type'] == 'view':
            totals[g]['views'] += 1; daily[str(r.get('ts', ''))[:10]][g] += 1; paths[r['path']]['views'][g] += 1
        else:
            totals[g]['reads'] += 1; p = paths[r['path']]; p['reads'] += 1; p['s'] += r.get('visible_s', 0); p['scroll'] += r.get('scroll', 0)
    team = collections.defaultdict(lambda: {'views': 0, 'reads': 0, 'visible_s': 0, 'max_scroll': 0, 'last': ''})
    for r in pages:
        if not r.get('verified'): continue
        t = team[(r['person'], r['path'])]; t['last'] = max(t['last'], str(r.get('ts', '')))
        if r['type'] == 'view': t['views'] += 1
        else: t['reads'] += 1; t['visible_s'] += r.get('visible_s', 0); t['max_scroll'] = max(t['max_scroll'], r.get('scroll', 0))
    agents = collections.defaultdict(lambda: {'runs': 0, 'signed': 0, 'read_md': 0, 'read_html': 0, 'read_repo': 0, 'did': 0, 'last': ''})
    read_by = collections.defaultdict(set)
    reads_of = collections.defaultdict(lambda: collections.defaultdict(lambda: {'as': '', 'times': 0, 'last': ''}))
    did_of = collections.defaultdict(list)
    for r in runs:
        for x in r.get('read', []):
            e = reads_of[r.get('agent', '?')][str(x.get('url', ''))]; e['as'] = x.get('as', ''); e['times'] += 1; e['last'] = max(e['last'], r.get('run', ''))
        for x in r.get('did', []):
            if len(did_of[r.get('agent', '?')]) < 50: did_of[r.get('agent', '?')].append({**x, 'run': r.get('run', '')})
    for r in runs:
        a = agents[r.get('agent', '?')]; a['runs'] += 1; a['signed'] += 1 if r.get('signed') else 0; a['did'] += len(r.get('did', [])); a['last'] = max(a['last'], r.get('run', ''))
        for x in r.get('read', []):
            u = str(x.get('url', '')); read_by[u].add(r.get('agent'))
            a['read_repo' if u.startswith('repo:') else 'read_md' if x.get('as') == 'md' else 'read_html'] += 1
    keep = ('agent', 'run', 'trigger', 'repo', 'read', 'did', 'tokens', 'notes', 'signed', 'key_id', 'sig_finding')
    return {'v': 1, 'generated': now, 'records': len(good), 'groups': GROUPS,
            'totals': totals, 'daily': sorted(daily.items()),
            'pages': sorted(({'path': k, 'views': v['views'], 'total': sum(v['views'].values()), 'reads': v['reads'],
                              'read_s_avg': round(v['s'] / v['reads']) if v['reads'] else 0, 'scroll_avg': round(v['scroll'] / v['reads']) if v['reads'] else 0}
                             for k, v in paths.items()), key=lambda x: -x['total']),
            'team': [{'person': p, 'path': path, **v} for (p, path), v in sorted(team.items(), key=lambda x: x[1]['last'], reverse=True)],
            'agents': {'runs': len(runs), 'signed': sum(1 for r in runs if r.get('signed')),
                       'by_agent': [{'agent': k, **v, 'reads': sorted(({'url': u, **e} for u, e in reads_of[k].items()), key=lambda e: (-e['times'], e['url']))[:200], 'done': did_of[k]} for k, v in sorted(agents.items(), key=lambda x: x[1]['last'], reverse=True)],
                       'most_read': sorted(([u, sorted(a)] for u, a in read_by.items()), key=lambda x: (-len(x[1]), x[0]))[:100],
                       'recent': [{k: r[k] for k in keep if k in r} for r in runs[:200]]},
            'findings': {'page_signatures': sum(1 for r in pages if r.get('sig_finding')), 'agent_signatures': sum(1 for r in runs if r.get('sig_finding'))},
            'about': 'Published by observability@web-summit.dinis (admin/tools/obs_drain.py) from the private vault kuuqr3do. Groups: declared signals first (a crawler or automation flag; a verified site key), then inferred (more than 40 pages in one tab: crawler; a UTC time zone or a POSIX language: synthetic). The team is named only when the browser holds their site key; everyone else is a count. Every record is an untrusted claim: the lanes\' tokens are public.'}

def publish(rows, app_src, pub_vault, app_vault):
    now = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    html = open(app_src).read()
    manifest = {'entry': 'index.html', 'present': True, 'auto_open': True, 'title': 'Who reads web-summit.sgit.ai', 'hud': {'mode': 'minimal'}, 'permissions': {'fs': {'read': True}}}
    for v, data in ((pub_vault, True), (app_vault, False)):
        if not v or not os.path.isdir(v): continue
        __import__('subprocess').run(['sgit', 'pull'], cwd=v, capture_output=True, text=True)   # a new vault has nothing to pull
        os.makedirs(os.path.join(v, '.vault'), exist_ok=True)
        open(os.path.join(v, 'index.html'), 'w').write(html)
        open(os.path.join(v, '.vault', 'app.json'), 'w').write(json.dumps(manifest, indent=2) + '\n')
        if data:
            os.makedirs(os.path.join(v, 'data'), exist_ok=True)
            with open(os.path.join(v, 'data', 'public.json'), 'w') as f: json.dump(public(rows, now), f, indent=1)
        r = __import__('subprocess').run(['sgit', 'commit', f'publish {now}'], cwd=v, capture_output=True, text=True)
        p = __import__('subprocess').run(['sgit', 'push'], cwd=v, capture_output=True, text=True)
        if p.returncode: print(f'obs_drain: push of {os.path.basename(v)} failed (exit {p.returncode}): ' + (p.stderr or p.stdout).strip().splitlines()[-1][:200])
    print(f'obs_drain: published {now} to the public vault and the app vault')

def roster():
    """Every agent with an active key on the keys page: the agents expected to log."""
    keys = json.load(open(os.path.join(ROOT, 'data/keys.json')))['keys']
    return sorted({agent_of(k) for k in keys if k.get('status') in (None, '', 'active') and not k.get('replaced_by') and '@web-summit.' in agent_of(k)})

def run(cmd, cwd):
    import subprocess
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/obs-dinis/creds.json'))
    ap.add_argument('--vault', default=os.path.expanduser('~/vaults/obs-dinis-data'))
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--public', default=os.path.expanduser('~/vaults/obs-dinis-public'), help='the public vault (read key published)')
    ap.add_argument('--app', default=os.path.expanduser('~/vaults/obs-dinis-ux'), help='the app vault (code only)')
    ap.add_argument('--publish-only', action='store_true', help='transform and publish without draining the lanes')
    ap.add_argument('--all', action='store_true', help='transform every hour again, not only the new ones')
    o = ap.parse_args()
    c = json.load(open(o.creds))
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    pki = PKI__Crypto()
    # L: load the lanes
    entries, after = [], None
    while True:
        r = td.post(c, 'list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})})
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    lanes = collections.OrderedDict()
    for e in entries: lanes.setdefault(e['inbox'], []).append(e['file_id'])
    print(f"obs_drain: {len(entries)} pending in {len(lanes)} lane(s)" + ''.join(f"; lane {c['tokens'].index(t) + 1 if t in c['tokens'] else '?'}: {len(ids)}" for t, ids in lanes.items()))
    if o.dry: return
    td.sgit(o.vault, 'pull')
    touched = lets.migrate(o.vault)
    key = pki.import_private_key_pem(open(os.path.join(o.vault, 'identity/private/private_key.pem')).read())
    people = json.load(open(os.path.join(ROOT, 'data/person-keys.json')))['keys']
    keys = json.load(open(os.path.join(ROOT, 'data/keys.json')))['keys']
    def extract(content):                                                 # E: open and verify one sealed record
        try:
            ev = json.loads(pki.hybrid_decrypt(key, base64.b64decode(content).decode())['plaintext'])
            return verify_agent(ev, keys) if ev.get('type') == 'web-summit.agent-run/v1' else td.verify(ev, people)
        except Exception as e: return {'v': 0, 'undecryptable': True, 'error': type(e).__name__}
    t2, from_browser = lets.fold_inbox(o.vault, extract); touched |= t2
    rows, done, bad = [], collections.defaultdict(list), 0
    if not o.publish_only and entries:
        for token, ids in lanes.items():
            lane = c['tokens'].index(token) + 1 if token in c['tokens'] else 0
            for i in range(0, len(ids), 50):
                for f in td.post(c, 'fetch', {'inbox': token, 'file_ids': ids[i:i + 50]}).get('files', []):
                    ev = extract(f['content']); bad += 1 if ev.get('undecryptable') else 0
                    ev['_file'] = f['file_id']; ev['_lane'] = lane
                    ev['_received'] = int(f['file_id'][:13]) if f['file_id'][:13].isdigit() else None
                    rows.append(ev); done[token].append(f['file_id'])
        # S (raw): by the hour each record happened in
        touched |= lets.save_raw(o.vault, rows)
    now_hour = (time.strftime('%Y-%m-%d', time.gmtime()), time.strftime('%H', time.gmtime()))
    stamp = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    if touched or rows or from_browser:
        td.sgit(o.vault, 'commit', '-m', f'drain {stamp}: {len(rows)} record(s), {from_browser} from a browser, {len(touched)} hour(s)')
        td.sgit(o.vault, 'push')
    for token, ids in done.items():                                       # only after the push
        for i in range(0, len(ids), 100): td.post(c, 'mark-processed', {'inbox': token, 'file_ids': ids[i:i + 100]})
    # T + S (public): the dirty hours, their days, latest/
    run(['sgit', 'pull'], o.public)
    dirty = set(lets.all_hours(o.vault)) if o.all else touched
    if o.all:
        import shutil
        for d in os.listdir(o.public):
            if d[:2] == '20' and os.path.isdir(os.path.join(o.public, d)): shutil.rmtree(os.path.join(o.public, d))
        if os.path.exists(os.path.join(o.public, 'latest', 'index.json')): os.remove(os.path.join(o.public, 'latest', 'index.json'))
    got = lets.transform(o.vault, o.public, dirty, now_hour, roster())
    allrows = [r for d, h in lets.all_hours(o.vault) for r in lets.hour_rows(o.vault, d, h)]
    publish(allrows, APP_SRC, o.public, o.app)
    print(f"obs_drain: drained {len(rows)} ({bad} undecryptable), {from_browser} folded in from a browser; transformed {got['hours']} hour(s), "
          f"{got['days']} day(s); {got['pages']} pages, {got['agents']} agents (with the roster)")

if __name__ == '__main__':
    main()
