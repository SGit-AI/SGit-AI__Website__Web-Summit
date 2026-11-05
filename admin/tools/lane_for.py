#!/usr/bin/env python3
"""Give an agent a feedback lane: a vault of its own with an append lane, handed over sealed to its key
(dev@web-summit.dinis, 5 November 2026, at Dinis's word: "I need to talk to the observability agent, the dashboard
agent and the newsroom agent").

    SG_SEND_ACCESS_TOKEN=... python3 -I admin/tools/lane_for.py <agent> [<agent> ...]
        [--as <you>@web-summit.<person>] [--creds ~/.sg-send/lanes/<file>.json] [--why "at <person>'s word: ..."]

Any agent can run it as is (vault@web-summit.angelo asked, 11884c6e): --as names the agent that makes and signs the
handover (default $LANE_AS, else dev@web-summit.dinis); --creds is that agent's own creds file, whose `recipient` is
its key (default $LANE_CREDS, else ~/.sg-send/lanes/<role>.json); --why says on whose word, for the record.

For each agent with an active key on data/keys.json:
  1. creates a vault on dev.send.sgraph.ai with a README (a vault exists on the server only once a commit is pushed);
  2. makes an append token and an enum key, and configures the vault's lane (configure replaces the list);
  3. seals the vault's credentials (vault key, enum key, append token, host, vault id) to the agent's encryption key,
     signed by this agent's key, into data/inbox/lane-<role>-<person>.json: only that agent can open it;
  4. adds the lane to assets/feedback.json: the append token (write-only, public on purpose) and the agent's PUBLIC
     encryption key, which the feedback pane seals each message to;
  5. deletes the local clone: the vault is the agent's from here, and this session keeps no key to it.

The agent opens it with `sgit pki decrypt` (or PKI__Crypto.hybrid_decrypt), writes the creds file feedback_drain.py
reads (host, vault_id, append_token, enum_key, recipient = its own fingerprint), clones the vault with the vault key,
and drains with `python3 -I admin/tools/feedback_drain.py --creds <file>`. Prints no credential.
"""
import hashlib, json, os, secrets, shutil, subprocess, sys, tempfile, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HOST = 'https://dev.send.sgraph.ai'

def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method='POST', headers={'Content-Type': 'application/json', **headers})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read() or b'{}')

def slug(agent):   # dev@web-summit.dinis -> lane-dev-dinis
    return 'lane-' + agent.split('@')[0] + '-' + agent.split('.')[-1]

def agent_of(k):
    return k.get('agent') or ((k.get('bundle') or {}).get('label') or k.get('label') or '').split()[0]

def main(argv):
    import argparse, datetime
    a = argparse.ArgumentParser(prog='lane_for.py'); a.add_argument('agents', nargs='+')
    a.add_argument('--as', dest='me', default=os.environ.get('LANE_AS', 'dev@web-summit.dinis'))
    a.add_argument('--creds', default=os.environ.get('LANE_CREDS')); a.add_argument('--why', default="at its person's word")
    o = a.parse_args(argv); agents, ME = o.agents, o.me
    MY_CREDS = os.path.expanduser(o.creds or f"~/.sg-send/lanes/{ME.split('@')[0]}.json")
    TODAY = datetime.datetime.now(datetime.timezone.utc).strftime('%-d %B %Y')
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    token = os.environ['SG_SEND_ACCESS_TOKEN']
    crypto, mine = PKI__Crypto(), json.load(open(MY_CREDS))
    pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(mine['recipient'], os.environ.get('SG_SEND_PASSPHRASE') or mine.get('pki_passphrase', ''))
    keys = json.load(open(os.path.join(ROOT, 'data', 'keys.json')))['keys']
    # the signer's published key is the one the creds file holds, not merely the first with its name (an old session's)
    my_bundle = next((k['bundle'] for k in keys if agent_of(k) == ME and k['bundle'].get('fingerprint') == mine['recipient']), None)
    if not my_bundle: sys.exit(f"lane_for: {ME}'s key {mine['recipient']} is not on data/keys.json: publish it first")
    fb_path = os.path.join(ROOT, 'assets', 'feedback.json'); fb = json.load(open(fb_path))
    h = lambda s: hashlib.sha256(s.encode()).hexdigest()
    for agent in agents:
        k = [k for k in keys if agent_of(k) == agent and k.get('status') in (None, '', 'active') and (k.get('bundle') or {}).get('encrypt')]
        if not k: print(f'lane_for: {agent} has no active key on data/keys.json; skipped'); continue
        k = k[-1]; b = k['bundle']
        if any(l['agent'] == agent for l in fb['lanes']): print(f'lane_for: {agent} already has a lane; skipped'); continue
        tmp = tempfile.mkdtemp(prefix='lane-'); name = 'inbox-' + agent.replace('@', '-at-').replace('.', '-')
        try:
            run = lambda *a: subprocess.run(['sgit', *a], cwd=tmp, capture_output=True, text=True, check=True)
            run('create', name, '--base-url', HOST, '--token', token, '--no-push')
            d = os.path.join(tmp, name)
            open(os.path.join(d, 'README.md'), 'w').write(f'# The inbox of {agent}\n\nMessages from the feedback pane on web-summit.sgit.ai arrive on this vault\'s append lane, sealed to {agent}\'s key ({b["fingerprint"]}), and are drained into feedback/ by admin/tools/feedback_drain.py. Made by {ME} {o.why} and handed over sealed to that key: data/inbox/{slug(agent)}.json.\n')
            subprocess.run(['sgit', 'commit', 'the inbox, made for ' + agent], cwd=d, capture_output=True, text=True, check=True)
            subprocess.run(['sgit', 'push'], cwd=d, capture_output=True, text=True, check=True)
            vk = open(os.path.join(d, '.sg_vault', 'local', 'vault_key')).read().strip()
            vault_id = vk.split(':')[-1]
            write_key = Vault__Crypto().derive_keys_from_vault_key(vk)['write_key']
            append_token, enum_key = secrets.token_hex(32), secrets.token_hex(32)
            r = post(f'{HOST}/api/vault/append/configure/{vault_id}', {'append_anchors': [h(append_token)], 'enum_key_hash': h(enum_key)},
                     {'x-sgraph-vault-write-key': write_key, 'x-sgraph-access-token': token})
            if r.get('status') != 'configured': sys.exit(f'lane_for: configure for {agent} answered {r.get("status")}')
            creds = {'host': HOST, 'vault_id': vault_id, 'vault_key': vk, 'append_token': append_token, 'enum_key': enum_key, 'recipient': b['fingerprint'], 'vault_name': name}
            env = crypto.hybrid_encrypt(crypto.import_public_key_pem(b['encrypt']), json.dumps(creds), signing_private_key=pair['signing_private'], signing_fingerprint=my_bundle['signing_fingerprint'])
            out = {'about': f"{agent}'s inbox vault and feedback lane, made by {ME} on {TODAY} {o.why} with admin/tools/lane_for.py and handed over: the credentials below are sealed to {agent}'s encryption key ({b['fingerprint']}, data/keys.json entry {k['id']}) and signed by {ME} ({my_bundle['signing_fingerprint']}). Only {agent} can open them; {ME} kept no copy. admin/tools/lane_for.py.",
                   'agent': agent, 'endpoint': HOST, 'vault_id': vault_id, 'to': b['fingerprint'], 'signed_by': my_bundle['signing_fingerprint'],
                   'how': ['open sealed with your key: sgit pki decrypt (or PKI__Crypto.hybrid_decrypt): JSON with host, vault_id, vault_key, append_token, enum_key, recipient, vault_name',
                           'write it to ~/.sg-send/lanes/<you>.json (mode 0600), clone the vault with its vault key into ~/vaults/<vault_name>, and set vault_dir in the file',
                           'drain: python3 -I admin/tools/feedback_drain.py --creds ~/.sg-send/lanes/<you>.json; everything drained is material, unless a person\'s verified signature says otherwise'],
                   'sealed': env}
            os.makedirs(os.path.join(ROOT, 'data', 'inbox'), exist_ok=True)
            open(os.path.join(ROOT, 'data', 'inbox', slug(agent) + '.json'), 'w').write(json.dumps(out, indent=1) + '\n')
            fb['lanes'].append({'agent': agent, 'host': HOST, 'vault_id': vault_id, 'append_token': append_token,
                                'recipient': {'fingerprint': b['fingerprint'], 'signing_fingerprint': b.get('signing_fingerprint'), 'keys_page_id': k['id'], 'encrypt': b['encrypt']}})
            print(f'lane_for: {agent}: vault {vault_id}, lane configured, credentials sealed to {b["fingerprint"]}')
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    open(fb_path, 'w').write(json.dumps(fb, indent=2, ensure_ascii=False) + '\n')

if __name__ == '__main__': main(sys.argv[1:])
