# prod-pipeline-a8 (golf.large.worker@PrompTugal.angelo): the marks for the timeline mock, from the Fringe release feed only.
# python3 timeline.py <dir with releases.json, rel/*.json, activity.json> <out.json>. Read only; public JSON.
import json,glob,sys
D,OUT=sys.argv[1],sys.argv[2]
idx=json.load(open(D+'/releases.json')); R=sorted((json.load(open(f)) for f in glob.glob(D+'/rel/*.json')),key=lambda r:r['time'])
built=idx['built_at'][:19]+'Z'; oldest=min(c['time'] for r in R for c in r['commits'])
def marks(eid):
  out=[]
  for r in R:
    for k in ('added','removed','changed'):
      for e in r['data'][k]:
        if e['id']!=eid: continue
        f=[x['field'] for x in e.get('fields',[])]
        kind=k if k!='changed' else ('rechecked' if set(f)<={'seen_at'} else 'changed')
        out.append({'version':r['version'],'t':r['time'],'kind':kind,'fields':[x for x in f if x!='seen_at'],
          'by':sorted({c['agent'].split('@')[0] for c in r['commits'] if c['areas'].get('data')}),'url':f"https://lisbontechfringe.com/changes/{r['version']}/"})
  return out
def recent(t):  # within 15 min of the build
  from datetime import datetime as T; f=lambda s:T.fromisoformat(s.replace('Z','+00:00')); return (f(built)-f(t)).total_seconds()<=900
pages={}
for key,eid in (('district-909','2026-11-11-district-909-back-where-it-all-started'),('show-what-you-build','2026-11-12-show-what-you-build')):
  m=marks(eid); pages[key]={'event_id':eid,'page':f'https://lisbontechfringe.com/e/{eid}/','marks':m,
    'working_now':bool(m and recent(m[-1]['t'])),
    'activity_names_it':any(eid in c['subject'] for c in json.load(open(D+'/activity.json'))['commits'])}
json.dump({'source':'https://lisbontechfringe.com/api/v1/releases.json','feed_version':idx['version'],'built_at':built,
  'feed_oldest_commit':oldest,'releases':len(R),'commits':sum(len(r['commits']) for r in R),'pages':pages},open(OUT,'w'),indent=1)
for k,v in pages.items(): print(k,len(v['marks']),v['working_now'],v['activity_names_it'],[(x['version'],x['kind'],x['fields']) for x in v['marks']])
