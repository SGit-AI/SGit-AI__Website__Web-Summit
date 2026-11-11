# prod-pipeline-a4: trace files for four small Tech Fringe pages, from the Fringe's git history only (read-only git).
import json,subprocess,sys,re
R='/home/user/promptugal/fringe'; OUT=sys.argv[1]
g=lambda *a: subprocess.run(['git','-C',R,*a],capture_output=True,text=True).stdout.strip()
HEAD=g('rev-parse','--short=7','origin/dev')
def c(sha,kind,what,work=None,lane=None,**kw):
    f=g('log','-1','--format=%h|%aI|%cI|%s|%(trailers:key=Claude-Session,valueonly,separator=)|%(trailers:key=Co-Authored-By,valueonly,separator=)',sha).split('|')
    who=f[3].split(':')[0]; m=re.search(r'Claude ([A-Za-z]+ [\d.]+)',f[5])
    tag=sorted(g('tag','--contains',sha).split(),key=lambda v:[int(x) for x in v[1:].split('.')])[0]
    s=dict(t=f[1].replace('+00:00','Z'),kind=kind,who=who,session=f[4].rsplit('/',1)[-1] or None,model=m.group(1) if m else None,what=what,evidence=[f[0]],work_item=work,label='fact',on_dev=f[0],published_by=tag,lane=lane)
    if f[2]!=f[1]: s['committed']=f[2].replace('+00:00','Z')
    s.update(kw); return s
def dep(tag,after_sha,lane='CI'):
    tc=g('log','-1','--format=%h|%cI',tag).split('|')
    return dict(t='unknown',after=tc[1].replace('+00:00','Z'),kind='deploy',who='GitHub Actions',what=f'live as {tag} (the first version tag holding {after_sha})',evidence=[f'tag {tag} at {tc[0]}'],label='fact',lane=lane,version=tag)
def fold(files,since,lane='Build'):
    l=g('log','--format=%h|%aI',f'{since}..origin/dev','--',*files).split('\n'); l=[x for x in l if x]
    return dict(t=l[0].split('|')[1].replace('+00:00','Z'),kind='agent',who='several (the site template)',what=f'the shared template of this page changed {len(l)} times since ({", ".join(f.split("/")[-1] for f in files[:4])}, ...)',evidence=[l[-1].split('|')[0]+'..'+l[0].split('|')[0]],label='fact',lane=lane,folded=len(l),first=l[-1].split('|')[1].replace('+00:00','Z'))
def now():
    tags=sorted(g('tag').split(),key=lambda v:[int(x) for x in v[1:].split('.')]); t=tags[-1]; tc=g('log','-1','--format=%h|%cI',t).split('|')
    return dict(t=tc[1].replace('+00:00','Z'),kind='deploy',who='GitHub Actions',what=f'the newest version in the record: {t}',evidence=[f'tag {t} at {tc[0]}'],label='fact',lane='CI',version=t)
EV=['admin/build/event-pages.mjs','admin/build/build.mjs','admin/build/cards.mjs','admin/build/identity.mjs','admin/build/organisers.mjs','admin/build/graph.mjs','admin/build/tokens.css','admin/build/validate.mjs','admin/build/og','data/organisers.json','admin/series.txt','.github/workflows/deploy.yml']
SH=['admin/build/build.mjs','admin/build/tokens.css','admin/build/identity.mjs']
P={
 'district-909':dict(page='/e/2026-11-11-district-909-back-where-it-all-started/',event_id='2026-11-11-district-909-back-where-it-all-started',kind='event page, one research pass',source='data/events.json (one entry)',steps=[
   dict(t='unknown',before='2026-11-11T17:49:00Z',kind='human',who='a team member',what="passed on the organisers' Luma link",evidence=['b096ccb (commit body: "From the link ... passed on")'],label='fact',lane='People'),
   dict(t='2026-11-11T17:49:00Z',kind='source-read',who='researcher.1.fringe@PrompTugal.jose',what="read the organisers' Luma page once (read_at)",evidence=['https://luma.com/cgkr0awt','data/events.json read_at at b096ccb'],label='fact',lane='Source'),
   c('b096ccb','agent','added the entry: 22:00 to 05:30, Rive Rouge, EUR 10',lane='Research'),
   dep('v0.1.422','b096ccb'),
   fold(EV,'b096ccb'), now()],
   stations=[(1,1,'Asked',None),(2,1,'Read',None),(3,3,'Entry',None),(4,1,'Live',None),(5,4,'{n} template',None),(6,1,'Now',None)],
   head="From the organisers' page to the site in 2 min", sub='1 person · 1 agent · 1 commit'),
 'storm-summit':dict(page='/e/2026-11-11-storm-summit-stormsummit-app/',event_id='2026-11-11-storm-summit-stormsummit-app',kind='event page, one research pass and one field pass',source='data/events.json (one entry)',steps=[
   dict(t='2026-11-11T13:37:00Z',kind='source-read',who='researcher.2.fringe@PrompTugal.dinis',what="read the organiser's public page (read_at)",evidence=['https://stormsummit.app/','data/events.json read_at at 0f23d54'],label='fact',lane='Source'),
   c('0f23d54','agent','added the entry: online, Wed 11 Nov 08:30',lane='Research'),
   dep('v0.1.200','0f23d54'),
   c('aefea2d','agent','work/44: cost, in_lisbon and personas set on every event, this one included',work='work/44',lane='Research'),
   dep('v0.1.227','aefea2d'),
   fold(EV,'0f23d54'), now()],
   stations=[(1,1,'Read',None),(2,3,'Entry',None),(3,1,'Live',None),(4,2,'Fields',None),(5,4,'Live',None),(6,4,'{n} template',None),(7,1,'Now',None)],
   head="From the organiser's page to the site in 1 min", sub='0 people · 1 agent · 2 commits'),
 'me':dict(page='/me/',event_id=None,kind='small static page, one build',source='admin/build/me.mjs',steps=[
   dict(t='2026-11-11T11:50:00Z',kind='human',who='Dinis',what='brief 4, "full throttle": "Give me a key that I can then put on the website ..."',evidence=['briefs/2026-11-11-1150-full-throttle.md (received:)','work/26-dinis-key-and-talk.md'],label='fact',lane='People'),
   c('467db90','agent','wrote work/26, the task for /me/',work='work/26',lane='Lead'),
   c('88d0003','agent','built /me/: a key and a passkey in the browser',work='work/26',lane='Build'),
   dep('v0.1.65','88d0003'),
   c('0aa5ca4','agent','work/26 marked done, pending a live check',work='work/26',lane='Build'),
   fold(SH,'88d0003'), now()],
   stations=[(1,1,'Dinis',None),(2,1,'Task',None),(3,1,'Built',None),(4,1,'Live',None),(5,4,'Checked',None),(6,4,'{n} template',None),(7,2,'Now',None)],
   head='From Dinis\'s brief to live in 12 min', sub='1 person · 2 agents · 3 commits'),
 'tip':dict(page='/tip/',event_id=None,kind='small static page, three changes',source='admin/build/tip.mjs',steps=[
   dict(t='unknown',before='2026-11-11T13:36:52Z',kind='human',who='Dinis',what='asked for a tip box (the task names "Dinis, 13:36 UTC")',evidence=['064a9a1 (subject)'],label='fact',lane='People'),
   c('064a9a1','agent','wrote work/41, the task for /tip/',work='work/41',lane='Lead'),
   c('191bd96','agent','built /tip/: a sealed paste box and a status API',work='work/41',lane='Build'),
   dep('v0.1.201','191bd96'),
   c('00a6e45','agent','work/46: the give-us-the-intel box links here',work='work/46',lane='Build'),
   dep('v0.1.227','00a6e45'),
   c('1608aef','agent','D36: a "Tell us" link on every event page, prefilled here',work='D36',lane='Build'),
   dep('v0.1.291','1608aef'),
   fold(SH,'191bd96'), now()],
   stations=[(1,1,'Dinis',None),(2,1,'Task',None),(3,1,'Built',None),(4,1,'Live',None),(5,4,'Intel box',None),(7,3,'Tell us',None),(8,4,'Live',None),(9,4,'{n} template',None),(10,2,'Now',None)],
   head='From Dinis\'s ask to live in 3 min', sub='1 person · 3 agents · 4 commits'),
}
for k,p in P.items():
    st=p['steps']
    for i,s in enumerate(st,1): s['n']=i
    fo=[s for s in st if s.get('folded')][0]
    stations=[dict(n=n,lvl=l,label=lab.format(n=fo['folded'])) for n,l,lab,_ in p['stations']]
    known=[s for s in st if s['t']!='unknown']
    agents=sorted({s['who'] for s in st if s['kind'] in('agent','sub-agent') and not s.get('folded')})
    gaps=[ "deploy times: git holds the version tag, not the deploy run's end; GitHub's run list was not read (out of this step's reach), so each deploy step has t unknown and the time of the tagged commit as 'after'",
           "the page's template changes are folded into one step (folded: N); each is a commit to a shared build file, not to this page" ]
    if any(s['kind']=='human' and s['t']=='unknown' for s in st): gaps.append("the person's ask has no time in the record; 'before' is the first commit that names it")
    if k=='storm-summit': gaps.append('no ask in the record: the researcher found the event on its own wake; nothing names who asked')
    gaps.append('sub-agents behind any commit: none named in the trailers; not visible to git')
    T=dict(about=f"How {p['page']} on the Tech Fringe was made: every step the Fringe's git record shows, a simulation input for prod-pipeline-a4, not the Fringe's own trace",
        event_id=p['event_id'],page='https://lisbontechfringe.com'+p['page'],page_kind=p['kind'],page_source=p['source'],
        built_by='the Tech Fringe swarm (PrompTugal/PrompTugal__News__Fringe)',traced_by='juliett.large.worker@PrompTugal.angelo (prod-pipeline-a4, design)',
        traced_at=sys.argv[2],repo_head=HEAD,generator='prod-pipeline-a4 gen.py: read-only git log, show and tag on a clone of the Fringe dev branch; no Fringe code run',
        shape='lisbon-fringe-trace/1 plus A3\'s optional fields (stations, lane, folded, version)',privacy='no private person named; the person who passed a link is "a team member"; session ids are the public trailers',
        item='prod-pipeline-a4',headline=p['head'],headline_sub=p['sub'],stations=stations,steps=st,gaps=gaps,
        totals=dict(steps=len(st),steps_unfolded=len(st)-1+fo['folded'],agents=len(agents),people=len({s['who'] for s in st if s['kind']=='human'}),commits=len([s for s in st if s.get('on_dev')]),first=known[0]['t'],last=known[-1]['t']))
    json.dump(T,open(f'{OUT}/{k}.trace.json','w'),indent=1,ensure_ascii=False); open(f'{OUT}/{k}.trace.json','a').write('\n')
    print(k,len(st),'steps; unfolded',T['totals']['steps_unfolded'],'agents',agents)
