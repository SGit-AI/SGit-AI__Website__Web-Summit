#!/usr/bin/env python3
"""Build the master vault's catalogue from the exported project folders.

usage: catalog.py <out_dir> <master_dir> <vaults.json>
  out_dir/<vault>/<session folder>/{meta.json,messages.jsonl}   (from build.py)
  vaults.json: {"<vault>": {"label":..., "description":..., "vault_id":..., "endpoint":...}}
Writes master_dir/catalog/index.json, catalog/<vault>/sessions.json, catalog/<vault>/messages-NN.jsonl.gz
(each part under ~2.5 MB; message text trimmed to 4,000 characters: the full text is in the project vault).
"""
import gzip, io, json, os, sys, datetime

PART = 2_500_000
TRIM = 4000

def main():
    out, master, vj = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
    cat = {'title': "Dinis Cruz's Claude Code sessions, archived from the account (one vault per project)",
           'generated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'vaults': []}
    for name, info in vj.items():
        vdir = os.path.join(out, name)
        if not os.path.isdir(vdir):
            continue
        cdir = os.path.join(master, 'catalog', name)
        os.makedirs(cdir, exist_ok=True)
        for f in os.listdir(cdir):
            if f.startswith('messages-'):
                os.remove(os.path.join(cdir, f))
        metas, parts, buf, n, nmsg = [], [], io.BytesIO(), 0, 0
        findings, acts = [], []
        gz = None
        def flush():
            nonlocal gz, buf, n
            if gz is None:
                return
            gz.close()
            fn = f'messages-{len(parts):02d}.jsonl.gz'
            open(os.path.join(cdir, fn), 'wb').write(buf.getvalue())
            parts.append(fn)
            gz, buf = None, io.BytesIO()
        pm_path = vdir.rstrip('/') + '.packs.json'
        pmap = json.load(open(pm_path)) if os.path.exists(pm_path) else {}
        for folder in sorted(os.listdir(vdir)):
            mp = os.path.join(vdir, folder, 'meta.json')
            if not os.path.exists(mp):
                continue
            m = json.load(open(mp))
            ap = os.path.join(vdir, folder, 'analysis.json')
            if os.path.exists(ap):
                an = json.load(open(ap))
                m['stats'] = an['stats']
                m['abp'] = an['abp']
                for f in an['findings']:
                    f['vault'] = name
                    f['source'] = 'rule'
                    findings.append(f)
                rp = os.path.join(vdir, folder, 'review.json')
                if os.path.exists(rp):
                    try:
                        rv = json.load(open(rp))
                        m['review_summary'] = rv.get('summary', '')
                        for f in rv.get('findings') or []:
                            findings.append({'session': m['id'], 'vault': name, 'source': 'review', 't': (f.get('t') or '').replace(' ', 'T'),
                                             'kind': f.get('kind', 'review'), 'severity': f.get('severity', 'info'), 'rule': f.get('rule', ''),
                                             'evidence': (f.get('what', '') + ' — ' + f.get('why', '')).strip(' —'), 'quote': f.get('evidence', '')})
                    except Exception as ex:
                        print('bad review', rp, ex)
                acp = os.path.join(vdir, folder, 'actions.jsonl.gz')
                if os.path.exists(acp):
                    for l in gzip.open(acp, 'rt', encoding='utf-8'):
                        a = json.loads(l)
                        a['vault'] = name
                        acts.append(a)
            if folder in pmap:
                m['pack_map'] = pmap[folder]
            metas.append(m)
            for l in gzip.open(os.path.join(vdir, folder, 'messages.jsonl.gz'), 'rt', encoding='utf-8'):
                r = json.loads(l)
                if len(r.get('text') or '') > TRIM:
                    r['text'] = r['text'][:TRIM] + ' …[trimmed: full text in the project vault]'
                if gz is None:
                    gz = gzip.GzipFile(fileobj=buf, mode='wb', mtime=0)
                gz.write((json.dumps(r, ensure_ascii=False) + '\n').encode())
                nmsg += 1
                if buf.tell() > PART:
                    flush()
        flush()
        json.dump(metas, open(os.path.join(cdir, 'sessions.json'), 'w'), ensure_ascii=False)
        json.dump(findings, open(os.path.join(cdir, 'findings.json'), 'w'), ensure_ascii=False)
        aparts = []
        for f in os.listdir(cdir):
            if f.startswith('actions-'):
                os.remove(os.path.join(cdir, f))
        for i in range(0, len(acts), 20000):
            fn = f'actions-{len(aparts):02d}.jsonl.gz'
            with gzip.GzipFile(os.path.join(cdir, fn), 'wb', mtime=0) as g:
                for a in acts[i:i + 20000]:
                    g.write((json.dumps(a, ensure_ascii=False) + '\n').encode())
            aparts.append(fn)
        first = min((m.get('created_at') or '' for m in metas), default='')
        last = max((m.get('last_event') or m.get('updated_at') or '' for m in metas), default='')
        cat['vaults'].append({'name': name, 'label': info.get('label', name), 'description': info.get('description', ''),
                              'vault_id': info.get('vault_id'), 'sessions': len(metas), 'events': sum(m.get('events', 0) for m in metas),
                              'messages': nmsg, 'first': first, 'last': last, 'parts': parts, 'action_parts': aparts, 'findings': len(findings), 'actions': len(acts)})
        print(f'CATALOG {name}: {len(metas)} sessions, {nmsg} messages, {len(parts)} parts')
    os.makedirs(os.path.join(master, 'catalog'), exist_ok=True)
    json.dump(cat, open(os.path.join(master, 'catalog', 'index.json'), 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
