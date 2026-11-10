#!/usr/bin/env python3
"""Issue the team messaging lanes on the shared vault ws-team-messages (WS-203).

conductor@web-summit.indi, 10 November 2026, at Indi's word. One append lane per member of data/messaging/groups.json
"team", plus conductor@web-summit.indi. The vault's key is sealed to this agent
(data/sealed/agents/conductor@web-summit.indi/2026-11-09T1815Z-messaging-vault-conductor-indi.json, by
conductor@web-summit.dinis). Lane tokens and the vault's enum key are made here and kept only in
~/.sg-send/lanes/messaging.json (chmod 600); then people/indi/messaging/seal-lanes.mjs seals each person's details to
their site key. Nothing secret is printed. Re-run to add members: existing tokens are kept.

    SG_SEND_ACCESS_TOKEN=... python3 -I people/indi/messaging/issue-lanes.py
"""
import base64, hashlib, json, os, secrets, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SEALED = os.path.join(ROOT, 'data/sealed/agents/conductor@web-summit.indi/2026-11-09T1815Z-messaging-vault-conductor-indi.json')
CREDS = os.path.expanduser('~/.sg-send/lanes/messaging.json')
HOST = 'https://dev.send.sgraph.ai'
ME_FP = 'sha256:870bd65bd9223d06'          # conductor-indi
EXTRA = ['conductor@web-summit.indi']


def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method='POST', headers={'Content-Type': 'application/json', **headers})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read() or b'{}')


def main():
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    crypto = PKI__Crypto()
    pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(ME_FP, os.environ.get('SG_SEND_PASSPHRASE', ''))
    env = json.load(open(SEALED))['envelope']
    try:
        out = crypto.hybrid_decrypt(pair['encryption_private'], env)
    except Exception:
        out = crypto.hybrid_decrypt(pair['encryption_private'], base64.b64decode(env + '=' * (-len(env) % 4)).decode())
    plain = out['plaintext']
    if isinstance(plain, bytes): plain = plain.decode()
    import re
    m = re.search('sgit_private_' + r'vault_[A-Za-z0-9]+:[a-z0-9]+', plain)
    if not m: sys.exit('issue-lanes: no vault key in the sealed file (nothing printed)')
    vk = m.group(0)
    vault_id = vk.split(':')[-1]
    c = json.load(open(CREDS)) if os.path.exists(CREDS) else {}
    c.update({'host': HOST, 'vault_id': vault_id})
    c.setdefault('enum_key', secrets.token_hex(32))
    names = json.load(open(os.path.join(ROOT, 'data/messaging/groups.json')))['groups']['team'] + EXTRA
    lanes = c.setdefault('lanes', {})
    for n in names: lanes.setdefault(n, secrets.token_hex(32))
    h = lambda s: hashlib.sha256(s.encode()).hexdigest()
    write_key = Vault__Crypto().derive_keys_from_vault_key(vk)['write_key']
    r = post(f"{HOST}/api/vault/append/configure/{vault_id}", {'append_anchors': [h(t) for t in lanes.values()], 'enum_key_hash': h(c['enum_key'])},
             {'x-sgraph-vault-write-key': write_key, 'x-sgraph-access-token': os.environ['SG_SEND_ACCESS_TOKEN']})
    if r.get('status') != 'configured':
        sys.exit(f"issue-lanes: configure answered {sorted(r)} (status {r.get('status')})")
    fd = os.open(CREDS, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    os.write(fd, json.dumps(c, indent=1).encode()); os.close(fd)
    print(f'issue-lanes: {len(lanes)} lanes configured on {vault_id}: {", ".join(lanes)}; tokens in {CREDS}')


if __name__ == '__main__':
    main()
