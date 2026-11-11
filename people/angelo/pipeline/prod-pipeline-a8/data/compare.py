# prod-pipeline-a8 (golf.large.worker@PrompTugal.angelo): A7 traces against the Fringe release feed. Read only.
# python3 compare.py <dir with rel/*.json (from /api/v1/releases/<v>.json) and a7-<page>.json> <out.json>
import json,glob,sys,re,collections
D=sys.argv[1]; OUT=sys.argv[2]
R=[json.load(open(f)) for f in glob.glob(D+'/rel/*.json')]
R.sort(key=lambda r:r['time'])
inwin={}
for r in R:
  for c in r['commits']: inwin[c['short']]=(r['version'],c)
oldest=min(c['time'] for r in R for c in r['commits'])
pages={'district-909':('e','2026-11-11-district-909-back-where-it-all-started',r'district 909'),
 'storm-summit':('e','2026-11-11-storm-summit-stormsummit-app',r'storm summit'),
 'me':('p',None,r'/me/'),'tip':('p',None,r'/tip/|\btips?\b'),
 'home':('l',None,r'\bhome\b'),'programme':('l',None,r'programme')}
res={}
for p,(kind,eid,rx) in pages.items():
  a7=json.load(open(f'{D}/a7-{p}.json'))
  steps=[s for s in a7['steps'] if s['kind']=='commit']
  rows=[]
  for s in steps:
    sha=s['sha']; w=inwin.get(sha)
    rows.append({'t':s['t'][11:16],'sha':sha,'who':s['who'].split('@')[0],'role':s['role'],
      'in_window':bool(w),'release':w[0] if w else None,'live_in':s.get('live_in'),'what':s['what'].split(': ',1)[-1][:70]})
  rel=[]
  for r in R:
    hit=None
    if kind=='e':
      for k in ('added','removed','changed'):
        for e in r['data'][k]:
          if e['id']==eid: hit=k+(': '+', '.join(f['field'] for f in e.get('fields',[])) if e.get('fields') else '')
    elif kind=='l':
      d=r['data']; 
      if d['added'] or d['removed'] or d['changed']: hit=f"events +{len(d['added'])} -{len(d['removed'])} ~{len(d['changed'])}"
    for c in r['commits']:
      if re.search(rx,c['subject'],re.I) and not (kind=='l'):
        hit=(hit+'; ' if hit else '')+'names it: '+c['short']
    if hit: rel.append({'after_a7':r['time']>'2026-11-11T20:01:52Z','version':r['version'],'t':r['time'][11:16],'what':hit,'agents':[a.split('@')[0] for a in r['agents']]})
  a7shas={x['sha'] for x in rows}
  extra=[x for x in rel if not any(c in a7shas for c in re.findall(r'[0-9a-f]{7}',x['what']))]
  res[p]={'a7_commit_steps':len(rows),'a7_in_window':sum(x['in_window'] for x in rows),'rows':rows,'release_marks':rel}
json.dump({'feed_version':R[-1]['version'],'releases':len(R),'commits':sum(len(r['commits']) for r in R),'oldest_commit':oldest,'newest':R[-1]['time'],'pages':res},open(OUT,'w'),indent=1)
for p,v in res.items(): print(p,v['a7_commit_steps'],v['a7_in_window'],len(v['release_marks']), [ (m['version'],m['what'][:60]) for m in v['release_marks']][:6])
print(oldest)
