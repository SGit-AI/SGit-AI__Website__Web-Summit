#!/usr/bin/env python3
"""One polite GET per primary page we could not read; records each try in entities/<entity>.json "tries".
Run once an hour (incident.researcher@'s wake). Public pages only; no bot-check workarounds."""
import json, os, re, sys, urllib.request, datetime, html
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'entities')
PAGES = [  # entity, url, what we look for (Wednesday's notice)
  ('bridges', 'https://www.lusoponte.pt/', r'60 ?km|velocidade|Charles|vento'),
  ('metro', 'https://www.metrolisboa.pt/', r'quarta-feira|11 de novembro|Charles|servi[çc]o (?:normal|reduzido|suspenso)|perturba'),
  ('tunnels', 'https://www.lisboa.pt/', r't[úu]nel|Charles|alerta'),
  ('tunnels', 'https://informacao.lisboa.pt/', r't[úu]nel|Charles|alerta'),
  ('airport', 'https://www.aeroportolisboa.pt/pt/lis/home', r'Charles|meteorol|cancel'),
  ('cp', 'https://www.cp.pt/', r'Charles|meteorol|suprim|perturba'),
  ('rede-expressos', 'https://www.rede-expressos.pt/', r'Charles|suspen|meteorol'),
]
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
for ent, url, pat in PAGES:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (incident research; public pages, one request an hour)'})
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read().decode('utf-8', 'replace'); code = r.status
        text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<script.*?</script>|<style.*?</style>', '', body, flags=re.S))))
        hits = [text[max(0, m.start()-100):m.end()+100] for m in re.finditer(pat, text, re.I)][:2]
        res = dict(at=now, url=url, http=code, bytes=len(body), result='published: see excerpt' if hits else 'answered; no notice found', excerpt=hits)
    except Exception as e:
        res = dict(at=now, url=url, http=getattr(e, 'code', None), result='not reached: ' + type(e).__name__ + (' ' + str(getattr(e, 'code', '')) if getattr(e, 'code', None) else ''))
    f = os.path.join(D, ent + '.json'); d = json.load(open(f))
    d.setdefault('tries', []).append(res)
    n = sum(1 for t in d['tries'] if t['url'] == url)
    d['tries_summary'] = {u: {'tries': sum(1 for t in d['tries'] if t['url'] == u), 'published_found': any(t['url'] == u and t.get('excerpt') for t in d['tries'])} for u in {t['url'] for t in d['tries']}}
    json.dump(d, open(f, 'w'), indent=1, ensure_ascii=False); open(f, 'a').write('\n')
    print(ent, url, res['result'], res.get('http'))
