# merges research/*.out.json into the public CRM; prints what it refused
import json,os,re,sys,glob,unicodedata
R=sys.argv[1]; V=os.path.expanduser('~/vaults/ws-team-crm-public')
NOW='2026-11-05T23:00:00Z'; BY='crm@web-summit.dinis'; READ='2026-11-05'
def slug(s):
    s=unicodedata.normalize('NFKD',str(s).lower()); s=''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')[:60]
def ok(u): return isinstance(u,str) and u.startswith('http')
def src(o): return o.get('source') if isinstance(o,dict) else None
def load(p):
    try: return json.load(open(p))
    except Exception: return None
refused=[]; stats=dict(companies=0,contacts=0,schedules=0,brazil=0)
def add_sources(r,lst):
    have={s['url'] for s in r.setdefault('sources',[])}
    for s in lst:
        if ok(s.get('url')) and s['url'] not in have:
            r['sources'].append({'url':s['url'],'read_at':s.get('read_at') or READ,'supports':s.get('supports')}); have.add(s['url'])
def sess_path(s):
    d=s.get('date') or 'undated'
    return f"{V}/schedules/{d}/{slug(s.get('id') or s['title'])}.json"
for f in sorted(glob.glob(R+'/buyers-*.out.json')):
    for c in load(f) or []:
        cid=c['id']; p=f'{V}/companies/{cid}/company.json'
        r=load(p) or {'id':cid,'type':'company','kind':'company','name':c.get('name'),'sources':[]}
        w=c.get('what') or {}
        if w.get('text') and ok(src(w)):
            r['what']=w['text']; r['what_source']=src(w)
        elif w.get('text'): refused.append((cid,'what without source'))
        if c.get('website') and not r.get('website'): r['website']=c['website']
        if c.get('country') and not r.get('country'): r['country']=c['country']
        r['products']=[x for x in c.get('products') or [] if ok(src(x))]
        r['ai_flows']=[x for x in c.get('ai_flows') or [] if ok(src(x))]
        refused+=[(cid,'flow/product without source')]*((len(c.get('products') or [])-len(r['products']))+(len(c.get('ai_flows') or [])-len(r['ai_flows'])))
        a=c.get('ai_agents') or {}
        if a.get('answer'): r['ai_agents']={k:a.get(k) for k in ('answer','why','source','read_at')}
        t=set(r.get('topics') or [])
        if a.get('answer') in ('builds','uses') and any(x.get('kind')=='ai-agents' for x in r['ai_flows']) or a.get('answer')=='builds': t.add('topic:ai-agents')
        r['topics']=sorted(t)
        sids=[]
        for s in c.get('sessions') or []:
            if not ok(s.get('url')): refused.append((cid,'session without url')); continue
            sp=sess_path(s); sid='schedule:'+os.path.basename(sp)[:-5]; sids.append((s.get('id'),sid))
            if not os.path.exists(sp):
                os.makedirs(os.path.dirname(sp),exist_ok=True)
                json.dump({'id':sid.split(':',1)[1],'type':'schedule','kind':'session','title':s['title'],'date':s.get('date'),'start':s.get('start'),'end':s.get('end'),'where':s.get('where'),'track':None,
                  'part_of':'event:web-summit-lisbon-2026','part_of_name':'Web Summit Lisbon 2026','organised_by':'company:web-summit','speakers':[],'hosted_by':[],
                  'sources':[{'url':s['url'],'read_at':READ}],'updated_at':NOW,'updated_by':BY},open(sp,'w'),indent=2,ensure_ascii=False); stats['schedules']+=1
        smap=dict(sids)
        people=[]
        for pp in c.get('people') or []:
            if not pp.get('name') or not ok(pp.get('source')): refused.append((cid,'person without summit source')); continue
            if 'websummit.com' not in pp['source']: refused.append((cid,f"person not from websummit.com: {pp['name']}")); continue
            pid=slug(pp['name']); cp=f'{V}/contacts/{pid}/contact.json'
            ss=[smap.get(x,x if str(x).startswith('schedule:') else None) for x in pp.get('sessions') or []]; ss=[x for x in ss if x]
            k=load(cp) or {'id':pid,'type':'contact','kind':'person','name':pp['name'],'sources':[],'about':'As the summit lists them: name, role, organisation. Nothing else, ever, in this public vault.'}
            k.update({'role':pp.get('role') or k.get('role'),'organisation':pp.get('organisation') or k.get('organisation'),'company':k.get('company') or f'company:{cid}'})
            k['sessions']=sorted(set((k.get('sessions') or [])+ss)); add_sources(k,[{'url':pp['source']}]); k['updated_at']=NOW; k['updated_by']=BY
            new=not os.path.exists(cp); os.makedirs(os.path.dirname(cp),exist_ok=True); json.dump(k,open(cp,'w'),indent=2,ensure_ascii=False); stats['contacts']+=new
            people.append(k)
            for s in ss:   # link the speaker into the schedule
                for fp in glob.glob(f"{V}/schedules/*/{s.split(':',1)[1]}.json"):
                    S=load(fp); 
                    if not any(x.get('contact')==f'contact:{pid}' for x in S.get('speakers',[])):
                        S.setdefault('speakers',[]).append({'contact':f'contact:{pid}','as_listed':f"{pp['name']} ({pp.get('role')}, {pp.get('organisation')})",'company':f'company:{cid}'}); json.dump(S,open(fp,'w'),indent=2,ensure_ascii=False)
        add_sources(r,c.get('sources') or []); r['research_gaps']=c.get('gaps'); r['updated_at']=NOW; r['updated_by']=BY
        os.makedirs(os.path.dirname(p),exist_ok=True); json.dump(r,open(p,'w'),indent=2,ensure_ascii=False); stats['companies']+=1
        L=[f"# {r['name']}\n",(r.get('what') or '_What it does: not yet sourced._')+(f" ([source]({r.get('what_source')}))" if r.get('what_source') else ''),'']
        if r.get('website'): L+= [f"Website: <{r['website']}>",'']
        if people: L+=['## At Web Summit Lisbon 2026',*[f"- {k['name']}, {k.get('role')}" + (f" — {', '.join(x.split(':',1)[1] for x in k['sessions'])}" if k.get('sessions') else '') for k in people],'']
        if r['products']: L+=['## Products',*[f"- **{x.get('name')}**: {x.get('what')} ([source]({x['source']}))" for x in r['products']],'']
        L+=['## Where AI agents are',*([f"- **{x.get('flow')}** ({x.get('kind')}): {x.get('what')} ([source]({x['source']}))" for x in r['ai_flows']] or ['- None found in public sources (read 5 November 2026).']),'']
        if r.get('ai_agents'): L+=[f"**AI agents:** {r['ai_agents'].get('answer')}. {r['ai_agents'].get('why') or ''}",'']
        if r.get('research_gaps'): L+=[f"_Not found yet:_ {r['research_gaps']}",'']
        L+=['Public facts only, each with its source: '+', '.join(f"<{s['url']}> (read {s.get('read_at')})" for s in r['sources'])+'.']
        open(f'{V}/companies/{cid}/notes.md','w').write('\n'.join(L)+'\n')
for f in sorted(glob.glob(R+'/brazil-*.out.json')):
    for c in load(f) or []:
        p=f"{V}/companies/{c['id']}/company.json"; r=load(p)
        if not r: refused.append((c['id'],'unknown id')); continue
        a=c.get('ai_agents') or {}
        if a.get('answer') in ('not found',None): continue
        if not ok(a.get('source')): refused.append((c['id'],'ai line without source')); continue
        w=c.get('what') or {}
        if w.get('text') and ok(w.get('source')): r['what']=w['text']; r['what_source']=w['source']
        if c.get('website'): r['website']=c['website']
        r['ai_agents']={k:a.get(k) for k in ('answer','why','source','read_at')}; r['identity']=c.get('identity')
        if a['answer']=='builds' and 'topic:ai-agents' not in r['topics']: r['topics'].append('topic:ai-agents')
        add_sources(r,[{'url':w.get('source'),'read_at':w.get('read_at'),'supports':'what it does'},{'url':a['source'],'read_at':a.get('read_at'),'supports':'the AI-agents line'}])
        r['updated_at']=NOW; r['updated_by']=BY; json.dump(r,open(p,'w'),indent=2,ensure_ascii=False); stats['brazil']+=1
        n=f"# {r['name']}\n\n{r.get('what') or ''}\n\nA Brazilian startup with ApexBrasil's mission to Web Summit Lisbon 2026 ({r.get('delegation')}). Registered in {r.get('city')}." + (f" Website: <{r['website']}>." if r.get('website') else '') + f"\n\n**AI agents:** {a['answer']}. {a.get('why') or ''}\n\nPublic facts only, each with its source: " + ', '.join(f"<{s['url']}> (read {s.get('read_at')})" for s in r['sources']) + '.\n'
        open(f"{V}/companies/{c['id']}/notes.md",'w').write(n)
print(stats); print('refused',len(refused)); [print(' ',x) for x in refused[:30]]
