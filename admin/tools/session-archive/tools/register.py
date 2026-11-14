#!/usr/bin/env python3
"""Register project vaults in the master vault: keys/<name>.json, vaults/<name>.link.json, vaults.json (no key printed).

usage: register.py <master_dir> <vaults_root> <vaults.json> [name ...]
  vaults_root/<name>/.sg_vault/local/{vault_key,base_url} are read; read_key is derived with `sgit vault derive-keys`.
  vaults.json gains vault_id and endpoint for each name.
"""
import json, os, subprocess, sys, secrets

def main():
    master, root, vjp = sys.argv[1], sys.argv[2], sys.argv[3]
    names = sys.argv[4:]
    vj = json.load(open(vjp))
    os.makedirs(os.path.join(master, 'keys'), exist_ok=True)
    os.makedirs(os.path.join(master, 'vaults'), exist_ok=True)
    for name in names:
        loc = os.path.join(root, name, '.sg_vault', 'local')
        vk = open(os.path.join(loc, 'vault_key')).read().strip()
        base = open(os.path.join(loc, 'base_url')).read().strip() if os.path.exists(os.path.join(loc, 'base_url')) else 'https://dev.send.sgraph.ai'
        out = subprocess.run(['sgit', 'vault', 'derive-keys', vk], capture_output=True, text=True, check=True).stdout
        d = dict(l.split(':', 1) for l in out.splitlines() if ':' in l)
        d = {k.strip(): v.strip() for k, v in d.items()}
        vid, rk = d['vault_id'], d['read_key']
        key = {'name': name, 'label': vj.get(name, {}).get('label', name), 'vault_id': vid, 'endpoint': base,
               'vault_key': vk, 'read_key': rk,
               'note': 'Full key (read and write) of this project vault. This file lives only inside the private master vault.'}
        json.dump(key, open(os.path.join(master, 'keys', f'{name}.json'), 'w'), indent=1)
        lp = os.path.join(master, 'vaults', f'{name}.link.json')
        ref = json.load(open(lp)).get('ref_id') if os.path.exists(lp) else 'lk-' + secrets.token_hex(6)
        json.dump({'vault_id': vid, 'ref_id': ref, 'label': key['label']}, open(lp, 'w'), indent=1)
        vj.setdefault(name, {}).update({'vault_id': vid, 'endpoint': base})
        print(f'REGISTERED {name} vault_id={vid}')
    json.dump(vj, open(vjp, 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
