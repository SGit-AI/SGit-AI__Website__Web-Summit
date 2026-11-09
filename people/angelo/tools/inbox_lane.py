#!/usr/bin/env python3
"""Angelo's inbox lane (people/angelo/proposals/inbox/README.md; crm@PrompTugal.angelo, 7 November 2026, at Angelo's go).

The inbox agent (runner.inbox@PrompTugal.angelo) holds no key: it seals each company email to the CRM agent's public
key, and to the desk conductor's as a fallback, and appends it to a write-only lane. The CRM agent files it into the
private CRM. Mail is untrusted material: this tool never prints a message's text, a name or an address, only counts.

  inbox agent:  python3 -I people/angelo/tools/inbox_lane.py seal --company <slug> --thread <YYYY-MM-DD-slug>
                    --eml <file.eml> --card <file.json> [--to crm-angelo,conductor-angelo] [--lane data/inbox/lane-crm-angelo.json]
                prints "Inbox-sha256: <hex>"; put every such line in the run's one commit (pushed from Angelo's account).
  CRM agent:    python3 -I people/angelo/tools/inbox_lane.py file --creds ~/.sg-send/lanes/crm-angelo.json
                    [--vault ~/vaults/ws-team-crm-private] [--key <my encryption fp>] [--push]

Filing accepts an item only if (1) it opens with --key, (2) its EML's sha256 equals the one inside and the card's, (3)
that sha256 is on an "Inbox-sha256:" line of a commit on origin/dev whose Agent: is inbox@ or runner.inbox@PrompTugal.angelo
and which people/angelo/tools/pushed-by.mjs places in a push from Angelo's account, and (4) every path part matches a
strict pattern. It writes companies/<company>/comms/<thread>/<name>.eml and .json (and thread.json if new), derives the
graph, commits the vault, and with --push pushes it with the creds file's own token (never SG_SEND_ACCESS_TOKEN) and
only then marks the item's copies processed. Without --push nothing is marked, so nothing is lost; filing is idempotent.

Lane payloads: base64(JSON {"v": "angelo-inbox-1", "item": <random id>, "for": <recipient fp>, "enc": <sgit hybrid v2>}),
the sealed plaintext being JSON {company, thread, name, sha256, eml_b64, card, company_name?, company_website?, sealed_at}.
--local DIR replaces the lane with a folder (tests only); --test-trust FILE (a list of sha256, only with --local) replaces
check (3) for a test.
"""
import argparse, base64, hashlib, json, os, re, secrets, shutil, subprocess, sys, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
V = 'angelo-inbox-1'
INBOX_AGENTS = ('inbox@PrompTugal.angelo', 'runner.inbox@PrompTugal.angelo')
RE = {'company': r'^[a-z0-9][a-z0-9-]{0,80}$', 'thread': r'^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]{0,80}$',
      'name': r'^\d{4}-\d{2}-\d{2}T\d{4}Z-(in|out|draft)-[A-Za-z0-9_-]{1,64}$', 'sha256': r'^[0-9a-f]{64}$'}
MAX_EML = 10 * 1024 * 1024
now = lambda: datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def die(m): raise SystemExit('inbox_lane: ' + m)

# ---------- the lane: the append API (as admin/tools/feedback_drain.py), or a folder for tests ----------
class Lane:
    def __init__(self, c, local=None): self.c, self.local = c, local
    def _call(self, op, body, enum=True):
        h = {'Content-Type': 'application/json', **({'x-sgraph-vault-enum-key': self.c['enum_key']} if enum else {})}
        req = urllib.request.Request(f"{self.c['host']}/api/vault/append/{op}/{self.c['vault_id']}", data=json.dumps(body).encode(), method='POST', headers=h)
        with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read() or b'{}')
    def write(self, payload_b64):
        if self.local:
            d = os.path.join(self.local, 'pending'); os.makedirs(d, exist_ok=True)
            fid = secrets.token_hex(8) + '.enc'; open(os.path.join(d, fid), 'w').write(payload_b64); return fid
        return self._call('write', {'append_token': self.c['append_token'], 'payload': payload_b64}, enum=False)
    def pending(self):                                          # [(file_id, payload_b64)]
        if self.local:
            d = os.path.join(self.local, 'pending')
            return [(f, open(os.path.join(d, f)).read()) for f in sorted(os.listdir(d))] if os.path.isdir(d) else []
        ents, after = [], None
        while True:
            r = self._call('list', {'include_content': False, **({'after_file_id': after} if after else {})})
            page = [e for e in r.get('entries', []) if e.get('inbox') == self.c['append_token']]; ents += page
            if not r.get('truncated') or not r.get('entries'): break
            after = r['entries'][-1]['file_id']
        out = []
        for k in range(0, len(ents), 20):
            for f in self._call('fetch', {'inbox': self.c['append_token'], 'file_ids': [e['file_id'] for e in ents[k:k + 20]]}).get('files', []):
                out.append((f['file_id'], f['content']))
        return out
    def processed(self, ids):
        if not ids: return 0
        if self.local:
            src, dst = os.path.join(self.local, 'pending'), os.path.join(self.local, 'processed'); os.makedirs(dst, exist_ok=True)
            for i in ids: shutil.move(os.path.join(src, i), os.path.join(dst, i))
            return len(ids)
        return len(self._call('mark-processed', {'inbox': self.c['append_token'], 'file_ids': ids}).get('moved', []))

def crypto():
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    return PKI__Crypto()

# ---------- seal (the inbox agent) ----------
def seal(o):
    for k in ('company', 'thread'):
        if not re.match(RE[k], getattr(o, k)): die(f'--{k} does not match {RE[k]}')
    name = os.path.basename(o.eml)[:-4] if o.eml.endswith('.eml') else die('--eml must end in .eml')
    if not re.match(RE['name'], name): die(f'the EML file name must match {RE["name"]} (<YYYY-MM-DDTHHMMZ>-<in|out|draft>-<id>.eml)')
    eml = open(o.eml, 'rb').read()
    if len(eml) > MAX_EML: die('the EML is larger than 10 MB: carry it without its attachments (list them in the card)')
    card = json.load(open(o.card)); sha = hashlib.sha256(eml).hexdigest(); card['sha256'] = sha
    body = {'company': o.company, 'thread': o.thread, 'name': name, 'sha256': sha, 'eml_b64': base64.b64encode(eml).decode(),
            'card': card, 'sealed_at': now(), **({'company_name': o.company_name} if o.company_name else {}), **({'company_website': o.company_website} if o.company_website else {})}
    keys = {k['id']: k for k in json.load(open(os.path.join(ROOT, 'data/keys.json')))['keys']}
    c, lane, item = crypto(), Lane(json.load(open(o.lane)) if not o.local else {}, o.local), secrets.token_hex(12)
    for rid in o.to.split(','):
        k = keys.get(rid) or die(f'no key {rid} on data/keys.json')
        if k.get('status', 'active') not in ('active',): die(f'key {rid} is {k.get("status")}')
        pub = c.import_public_key_pem(k['bundle']['encrypt'])
        enc = c.hybrid_encrypt(pub, json.dumps(body))
        lane.write(base64.b64encode(json.dumps({'v': V, 'item': item, 'for': k['bundle']['fingerprint'], 'enc': enc}).encode()).decode())
    print(f'Inbox-sha256: {sha}')

# ---------- file (the CRM agent) ----------
def trusted_hashes(o):
    if o.test_trust:
        if not o.local: die('--test-trust works only with --local')
        return {l.strip() for l in open(o.test_trust) if re.match(RE['sha256'], l.strip())}
    subprocess.run(['git', 'fetch', '-q', 'origin', 'dev'], cwd=ROOT, check=True)
    log = subprocess.run(['git', 'log', '--since=30 days ago', '--format=%H%x1f%B%x1e', 'origin/dev'], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    found = {}
    for rec in log.split('\x1e'):
        if '\x1f' not in rec: continue
        h, body = rec.strip().split('\x1f', 1)
        if not any(re.search(rf'^Agent: {re.escape(a)}\s*$', body, re.M) for a in INBOX_AGENTS): continue
        for s in re.findall(r'^Inbox-sha256: ([0-9a-f]{64})\s*$', body, re.M): found.setdefault(h, set()).add(s)
    ok = set()
    for h, ss in found.items():          # one call per commit: pushed-by exits 1 unless Angelo's account pushed it
        if subprocess.run(['node', os.path.join(ROOT, 'people/angelo/tools/pushed-by.mjs'), h], cwd=ROOT, capture_output=True).returncode == 0: ok |= ss
    return ok

def file(o):
    if o.test_trust and not o.local: die('--test-trust works only with --local')
    c = json.load(open(os.path.expanduser(o.creds))) if not o.local else {}
    vault = os.path.expanduser(o.vault); lane = Lane(c, o.local)
    keyfp = o.key or c.get('recipient') or die('--key <your encryption fingerprint> (or recipient in the creds file)')
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    pc = crypto(); pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=pc).load_key_pair(keyfp, os.environ.get('SG_SEND_PASSPHRASE', ''))
    if not pair: die(f'no local key {keyfp}')
    trust = trusted_hashes(o)
    items, n = {}, {'copies': 0, 'not_mine': 0, 'unopened': 0, 'untrusted': 0, 'bad': 0, 'filed': 0, 'already': 0}
    for fid, payload in lane.pending():
        n['copies'] += 1
        try: w = json.loads(base64.b64decode(payload))
        except Exception: n['bad'] += 1; continue
        if w.get('v') != V or not isinstance(w.get('item'), str): n['bad'] += 1; continue
        items.setdefault(w['item'], {'files': [], 'body': None})['files'].append(fid)
        if w.get('for') != keyfp: n['not_mine'] += 1; continue
        try: b = json.loads(pc.hybrid_decrypt(pair['encryption_private'], w['enc'])['plaintext'])
        except Exception: n['unopened'] += 1; continue
        items[w['item']]['body'] = b
    done = []
    for item, it in items.items():
        b = it['body']
        if not b: continue
        try:
            for k in ('company', 'thread', 'name', 'sha256'):
                if not isinstance(b.get(k), str) or not re.match(RE[k], b[k]): raise ValueError(k)
            eml = base64.b64decode(b['eml_b64'], validate=True)
            if len(eml) > MAX_EML or hashlib.sha256(eml).hexdigest() != b['sha256'] or not isinstance(b.get('card'), dict) or b['card'].get('sha256') != b['sha256']: raise ValueError('sha256')
        except Exception: n['bad'] += 1; continue
        if b['sha256'] not in trust: n['untrusted'] += 1; continue      # left pending: reported, never filed
        d = os.path.join(vault, 'companies', b['company'], 'comms', b['thread'])
        if not os.path.realpath(d).startswith(os.path.realpath(vault) + os.sep): n['bad'] += 1; continue
        os.makedirs(d, exist_ok=True)
        pe, pj = os.path.join(d, b['name'] + '.eml'), os.path.join(d, b['name'] + '.json')
        if os.path.exists(pe):
            if hashlib.sha256(open(pe, 'rb').read()).hexdigest() == b['sha256']: n['already'] += 1; done += it['files']; continue
            n['bad'] += 1; continue                                 # a different message under the same name: never overwrite
        open(pe, 'wb').write(eml)
        card = {k: v for k, v in b['card'].items() if k not in ('type',)}
        card.update({'filed_by': 'crm@PrompTugal.angelo', 'filed_at': now(), 'via': 'inbox lane (people/angelo/tools/inbox_lane.py)'})
        open(pj, 'w').write(json.dumps(card, indent=2, ensure_ascii=False) + '\n')
        tj = os.path.join(d, 'thread.json')
        if not os.path.exists(tj):
            open(tj, 'w').write(json.dumps({'subject': str(card.get('subject') or b['thread'])[:300], 'channel': 'email', 'owner': 'angelo', 'state': 'new',
                'next_step': 'Angelo reads it and decides', 'updated_at': now(), 'updated_by': 'crm@PrompTugal.angelo'}, indent=2, ensure_ascii=False) + '\n')
        cj = os.path.join(vault, 'companies', b['company'], 'company.json')
        if not os.path.exists(cj):
            open(cj, 'w').write(json.dumps({'id': b['company'], 'type': 'company', 'name': str(b.get('company_name') or b['company'])[:200],
                'website': b.get('company_website') if re.match(r'^https?://[^\s"<>]+$', str(b.get('company_website') or '')) else None,
                'sources': [], 'updated_at': now(), 'updated_by': 'crm@PrompTugal.angelo'}, indent=2, ensure_ascii=False) + '\n')
        n['filed'] += 1; done += it['files']
    if n['filed']:
        subprocess.run(['node', os.path.join(ROOT, 'admin/tools/crm.mjs'), 'derive', 'private', *(['--crm', os.path.expanduser(o.crm)] if o.crm else [])], cwd=ROOT, check=True, capture_output=True)
        if not o.local:
            subprocess.run(['sgit', 'commit', '-m', f"crm@PrompTugal.angelo: {n['filed']} email(s) filed from Angelo's inbox lane"], cwd=vault, check=True, capture_output=True)
    marked = 0
    if o.push and done and not o.local:
        tok = c.get('sg_send_token') or die('--push needs the creds file\'s own sg_send_token (never SG_SEND_ACCESS_TOKEN)')
        p = subprocess.run(['sgit', 'push', '--token', tok], cwd=vault, capture_output=True, text=True)
        try: os.remove(os.path.join(vault, '.sg_vault/local/token'))
        except FileNotFoundError: pass
        if p.returncode: die('sgit push failed; nothing marked processed')
        marked = lane.processed(done)
    elif o.local and done: marked = lane.processed(done)
    print('inbox_lane: ' + ', '.join(f'{k} {v}' for k, v in n.items()) + f', marked processed {marked}' + ('' if o.push or o.local else ' (no --push: committed locally, left pending)'))

def main():
    a = argparse.ArgumentParser(); s = a.add_subparsers(dest='cmd', required=True)
    p = s.add_parser('seal'); p.add_argument('--company', required=True); p.add_argument('--thread', required=True); p.add_argument('--eml', required=True)
    p.add_argument('--card', required=True); p.add_argument('--to', default='crm-angelo,conductor-angelo'); p.add_argument('--lane', default=os.path.join(ROOT, 'data/inbox/lane-crm-angelo.json'))
    p.add_argument('--company-name'); p.add_argument('--company-website'); p.add_argument('--local')
    f = s.add_parser('file'); f.add_argument('--creds', default='~/.sg-send/lanes/crm-angelo.json'); f.add_argument('--vault', default='~/vaults/ws-team-crm-private')
    f.add_argument('--key'); f.add_argument('--crm', help='the key folder crm.mjs reads vaults.json from (default ~/.sg-send/crm)'); f.add_argument('--push', action='store_true'); f.add_argument('--local'); f.add_argument('--test-trust')
    o = a.parse_args(); seal(o) if o.cmd == 'seal' else file(o)

if __name__ == '__main__': main()
