# builds companies/<slug>/ in the public CRM for ApexBrasil's delegation (Confirmado / Aguardando), from the CNPJ register
import json,re,os,sys,unicodedata
BR=sys.argv[1]; V=os.path.expanduser('~/vaults/ws-team-crm-public')
APEX='https://crm-apps.apexbrasil.com.br/orgbdeab873/inscricao-eventos/evento/web-summit-lisboa-2026/0714952e-98da-f011-8543-7ced8db0f987'
READ='2026-11-05'; NOW='2026-11-05T19:00:00Z'; BY='crm@web-summit.dinis'
ST={r['cnpj']:r['status'] for r in json.load(open(BR+'/apex_list.json'))}
STEN={'Confirmado':'confirmed','Aguardando confirmação':'awaiting confirmation'}
CORP=re.compile(r'\b(LTDA|S\.?A\.?|S/A|EIRELI|INOVA SIMPLES|CORPORATION|COMPANY)\b')
def slug(s):
    s=unicodedata.normalize('NFKD',s.lower()); s=''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')[:60]
def tidy(s):
    small={'de','da','do','das','dos','e','em','para','a'}
    return ' '.join(w if w in ('AI','IA','S.A.','S/A','LTDA') or len(w)<=3 and w.isupper() and not w.lower() in small else (w.lower() if w.lower() in small and i else w.capitalize()) for i,w in enumerate(s.split()))
existing={}
for d in os.listdir(V+'/companies'):
    try: existing[d]=json.load(open(f'{V}/companies/{d}/company.json'))
    except Exception: pass
MATCH={'hablla':'hablla','just travel':'just-travel','naporta':'naporta','ai infinity global company':'ai-infinity'}
made=upd=skipped=0; rows=[]
for l in open(BR+'/ok2.jsonl'):
    d=json.loads(l)
    if not d.get('razao_social'): continue
    legal=d['razao_social'].strip(); trade=(d.get('nome_fantasia') or '').strip()
    person_like = not CORP.search(legal) or re.match(r'^\d',legal)
    if person_like:   # a sole trader registered under a person's name: never publish the legal name
        if not trade: skipped+=1; continue
        legal=None
    name=tidy(trade) if trade else tidy(re.sub(r'\s*(LTDA\.?|S\.A\.|S/A|INOVA SIMPLES \(I\.S\.\))\s*$','',legal))
    key=(trade or legal or '').lower()
    sid=next((v for k,v in MATCH.items() if k in key or (legal and k in legal.lower())),None) or slug(name)
    status=STEN[ST[d['cnpj']]]
    srcs=[{'url':APEX,'read_at':READ,'supports':f'ApexBrasil\'s approved list for its Web Summit Lisboa 2026 mission: CNPJ {d["cnpj"]}, "{ST[d["cnpj"]]}" at 28/8/2026'},
          {'url':'https://brasilapi.com.br/api/cnpj/v1/'+re.sub(r'\D','',d['cnpj']),'read_at':READ,'supports':'the public CNPJ register (Receita Federal, via BrasilAPI): '+('legal name, ' if legal else '')+'trade name, city, main activity'}]
    p=f'{V}/companies/{sid}/company.json'
    if sid in existing:
        r=existing[sid]; urls={s['url'] for s in r['sources']}
        r['sources']+= [s for s in srcs if s['url'] not in urls]
        if 'topic:brazil-delegation' not in r.get('topics',[]): r.setdefault('topics',[]).append('topic:brazil-delegation')
        r['delegation']=f'on ApexBrasil\'s approved list, {status} at 28/8/2026'
        r['cnpj']=d['cnpj']; r['updated_at']=NOW; r['updated_by']=BY
        json.dump(r,open(p,'w'),indent=2,ensure_ascii=False); upd+=1
    else:
        r={'id':sid,'type':'company','kind':'company','name':name,'legal_name':legal,'cnpj':d['cnpj'],'website':None,
           'what':None,'category':(d.get('cnae_fiscal_descricao') or None),'country':'Brazil',
           'city':f"{tidy(d['municipio'])}, {d['uf']}",
           'attending':f'with the Brazilian mission (ApexBrasil and Sebrae Startups): {status} at 28/8/2026',
           'attending_as':'startup (Brazil delegation)','topics':['topic:brazil','topic:brazil-delegation'],
           'delegation':f'on ApexBrasil\'s approved list, {status} at 28/8/2026',
           'ai_agents':{'answer':'not yet checked','why':'Only the CNPJ register has been read; its own website or Web Summit page is the next source.'},
           'sources':srcs,'updated_at':NOW,'updated_by':BY}
        os.makedirs(os.path.dirname(p),exist_ok=True); json.dump(r,open(p,'w'),indent=2,ensure_ascii=False); made+=1
        open(f'{V}/companies/{sid}/notes.md','w').write(f"# {name}\n\nA Brazilian startup with ApexBrasil's mission to Web Summit Lisbon 2026 ({status} at 28/8/2026). Registered in {r['city']}; main activity: {r['category']}.\n\n**AI agents:** not yet checked.\n\nPublic facts only, each with its source: " + ', '.join(f"<{s['url']}> (read {s['read_at']})" for s in srcs) + '.\n')
    rows.append((sid,status))
AIL={'the-insight':('uses','Its Gust profile: "desenvolve soluções em Inteligência Artificial" for oil and gas, mining and energy companies (Florianópolis, as the register); agents not stated.','https://gust.com/companies/the-insight-2'),
 'niara':('uses','ABC da Comunicação: Niara is a Brazilian AI platform for SEO (a chat, ChatSEO, and templates), 15,000 users; a generative AI tool, agents not stated.','https://www.abcdacomunicacao.com.br/primeira-plataforma-de-ia-para-seo-do-brasil-celebra-15-mil-usuarios/')}
for sid,(a,why,u) in AIL.items():
    p=f'{V}/companies/{sid}/company.json'
    if not os.path.exists(p): continue
    r=json.load(open(p)); r['ai_agents']={'answer':a,'why':why,'source':u,'read_at':READ}
    if not any(s['url']==u for s in r['sources']): r['sources'].append({'url':u,'read_at':READ,'supports':'what it does, and the AI-agents line'})
    json.dump(r,open(p,'w'),indent=2,ensure_ascii=False)
    n=open(f'{V}/companies/{sid}/notes.md').read().replace('**AI agents:** not yet checked.',f'**AI agents:** {a}. {why}')
    open(f'{V}/companies/{sid}/notes.md','w').write(n)
json.dump(rows,open(BR+'/gen_rows.json','w'))
print('made',made,'updated',upd,'skipped (sole traders without a trade name)',skipped)
