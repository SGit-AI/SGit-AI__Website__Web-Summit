#!/usr/bin/env python3
"""The team CRM's private vault key to each person's conductor agent (WS-170; conductor@web-summit.dinis, 5 November 2026).

    python3 -I admin/tools/crm_agents.py --stamp <stamp> --vault-id <id> --name <vault name> --key-file <file> [--root <repo>]

Called by `node admin/tools/crm.mjs seal-keys`. For every active entry of conductor@web-summit.<person> (not Dinis's own
conductor, which made the key) in data/keys.json: the vault key sealed to that agent's RSA encryption key with sgit's hybrid
v2 and signed by conductor@web-summit.dinis's key (PKI__Crypto.hybrid_encrypt, as admin/tools/inbox.py does), written to
data/sealed/agents/<agent>/<stamp>-team-crm-key.json. The agent opens it with `sgit pki decrypt` (or
PKI__Crypto.hybrid_decrypt) and checks the signature against signing_fingerprint. Prints paths only, never a key.
"""
import argparse, json, os

ME = 'conductor-3'                      # conductor@web-summit.dinis on data/keys.json

def main():
    a = argparse.ArgumentParser()
    a.add_argument('--root', default=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    for k in ('stamp', 'vault-id', 'name', 'key-file'): a.add_argument('--' + k, required=True)
    o = a.parse_args()
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    crypto = PKI__Crypto()
    creds = json.load(open(os.path.expanduser('~/.sg-send/lanes/conductor.json')))
    pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(creds['recipient'], os.environ.get('SG_SEND_PASSPHRASE', ''))
    keys = json.load(open(os.path.join(o.root, 'data', 'keys.json')))['keys']
    mine = next(k for k in keys if k['id'] == ME)['bundle']
    agent = lambda k: k.get('agent') or ((k.get('bundle') or {}).get('label') or k.get('label') or '').split(' ')[0]
    vk = open(o.key_file).read().strip()
    for k in keys:
        name = agent(k)
        if k['id'] == ME or not name.startswith('conductor@web-summit.') or k.get('status') not in (None, '', 'active') or not (k.get('bundle') or {}).get('encrypt'): continue
        plain = json.dumps({'title': "The team CRM: the private vault's key", 'vault': o.name, 'vault_id': o.vault_id, 'vault_key': vk,
                            'text': f"The vault key of {o.name} ({o.vault_id}), the team's private CRM (WS-170), for {name}. Records there sealed to your person (ws-crm-env-1) open with their key; records sealed to you as an agent (recipients with to: {k['id']}) open with yours. It also gives write access. From conductor@web-summit.dinis."})
        env = crypto.hybrid_encrypt(crypto.import_public_key_pem(k['bundle']['encrypt']), plain, signing_private_key=pair['signing_private'], signing_fingerprint=mine['signing_fingerprint'])
        out = os.path.join(o.root, 'data', 'sealed', 'agents', name, f'{o.stamp}-team-crm-key-{k["id"]}.json')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        json.dump({'v': 'sgit-hybrid-v2', 'to': k['id'], 'agent': name, 'key': k['bundle'].get('fingerprint'), 'by': 'conductor@web-summit.dinis',
                   'signing_fingerprint': mine['signing_fingerprint'], 'at': o.stamp, 'about': "The team CRM's private vault key, sealed to this agent's encryption key (sgit hybrid v2, signed). Open with sgit pki decrypt.",
                   'envelope': env}, open(out, 'w'), indent=1)
        print(f'crm: sealed to {name} ({k["id"]}): {os.path.relpath(out, o.root)}')

if __name__ == '__main__':
    main()
