#!/usr/bin/env python3
"""The conductor's inbox: one append lane per agent, each lane's token sealed to that agent's own key (Dinis,
4 November 2026: "you publish on the website your vault's public key for the append lane, but the actual append lane
value ... is encrypted using the other agent's public key. So only they can send it to you.").

    python3 -I admin/tools/inbox.py issue [--creds ~/.sg-send/lanes/conductor.json]
        for every active key on data/keys.json: a lane token (kept in the creds file, outside the repository), all the
        lanes configured on the conductor's inbox vault in one call (configure replaces the list), and each token
        sealed to its agent's encryption key and signed by the conductor's key (sgit's hybrid envelope v2, as
        `sgit pki encrypt` makes it); writes data/inbox/conductor-dinis.json: the vault, the endpoint, the conductor's
        public key (what to seal messages to) and, per agent, its sealed token. Re-run when keys change: existing
        tokens are kept, new keys get one, ended keys lose theirs.

Sending, for an agent: open your sealed token with your key (`sgit pki decrypt` on the envelope, or PKI__Crypto
.hybrid_decrypt), seal your message to the conductor's key (`sgit pki encrypt`), and POST
{"append_token": <token>, "payload": base64(<the .enc text>)} to <endpoint>/api/vault/append/write/<vault_id>.
The drain (admin/tools/feedback_drain.py) reads every lane and says which agent's lane each message came on.
"""
import argparse, base64, hashlib, json, os, secrets, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'data', 'inbox', 'conductor-dinis.json')
ME = 'conductor-3'          # the conductor's entry on data/keys.json (agent conductor@web-summit.dinis)

def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method='POST', headers={'Content-Type': 'application/json', **headers})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read() or b'{}')

def agent_of(k):
    return k.get('agent') or ((k.get('bundle') or {}).get('label') or k.get('label') or '').split()[0]

def main():
    a = argparse.ArgumentParser(); a.add_argument('cmd', choices=['issue']); a.add_argument('--creds', default='~/.sg-send/lanes/conductor.json')
    o = a.parse_args(); cf = os.path.expanduser(o.creds); c = json.load(open(cf))
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    crypto = PKI__Crypto()
    pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(c['recipient'], os.environ.get('SG_SEND_PASSPHRASE', ''))
    keys = json.load(open(os.path.join(ROOT, 'data', 'keys.json')))['keys']
    mine = next(k for k in keys if k['id'] == ME)['bundle']
    live = [k for k in keys if k['id'] != ME and (k.get('status') in (None, '', 'active')) and (k.get('bundle') or {}).get('encrypt') and '@' in agent_of(k)]
    lanes = c.setdefault('lanes', {})
    for k in live: lanes.setdefault(k['id'], secrets.token_hex(32))
    for gone in [i for i in lanes if i not in {k['id'] for k in live}]: lanes.pop(gone)
    vk = open(os.path.join(c['vault_dir'], '.sg_vault', 'local', 'vault_key')).read().strip()
    write_key = Vault__Crypto().derive_keys_from_vault_key(vk)['write_key']
    h = lambda s: hashlib.sha256(s.encode()).hexdigest()
    anchors = [h(c['append_token'])] + [h(t) for t in lanes.values()]
    r = post(f"{c['host']}/api/vault/append/configure/{c['vault_id']}", {'append_anchors': anchors, 'enum_key_hash': h(c['enum_key'])},
             {'x-sgraph-vault-write-key': write_key, 'x-sgraph-access-token': os.environ['SG_SEND_ACCESS_TOKEN']})
    if r.get('status') != 'configured': sys.exit(f'inbox: configure answered {r}')
    open(cf, 'w').write(json.dumps(c, indent=2)); os.chmod(cf, 0o600)
    out = {'about': "The conductor's inbox (conductor@web-summit.dinis): one append lane per agent. Each lane's token is sealed to that agent's own encryption key (data/keys.json) and signed by the conductor's key, so only that agent can open it and write to this inbox. Seal what you send to `recipient`; the drain says which agent's lane it came on. admin/tools/inbox.py.",
           'agent': 'conductor@web-summit.dinis', 'endpoint': c['host'], 'vault_id': c['vault_id'],
           'recipient': {'fingerprint': mine['fingerprint'], 'signing_fingerprint': mine['signing_fingerprint'], 'encrypt': mine['encrypt']},
           'how': ['open sealed_token with your key: sgit pki decrypt (or PKI__Crypto.hybrid_decrypt); the signature is the conductor\'s (signing_fingerprint)',
                   'seal your message to recipient.encrypt: sgit pki encrypt',
                   'POST {"append_token": <token>, "payload": base64(<the .enc text>)} to <endpoint>/api/vault/append/write/<vault_id>; the answer is always {"ok": true}'],
           'lanes': []}
    for k in live:
        pub = crypto.import_public_key_pem(k['bundle']['encrypt'])
        env = crypto.hybrid_encrypt(pub, lanes[k['id']], signing_private_key=pair['signing_private'], signing_fingerprint=mine['signing_fingerprint'])
        out['lanes'].append({'key_id': k['id'], 'agent': agent_of(k), 'to': k['bundle'].get('fingerprint'), 'sealed_token': env})
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(json.dumps(out, indent=1) + '\n')
    print(f"inbox: {len(out['lanes'])} lanes configured on {c['vault_id']} (plus the open feedback lane); sealed tokens in data/inbox/conductor-dinis.json")

if __name__ == '__main__': main()
