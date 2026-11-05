import json,os,collections
V=os.path.expanduser('~/vaults/ws-team-crm-public')
recs=[]
for d in sorted(os.listdir(V+'/companies')):
    p=f'{V}/companies/{d}/company.json'
    if os.path.exists(p):
        r=json.load(open(p))
        if 'topic:brazil-delegation' in r.get('topics',[]) and d!='apexbrasil': recs.append(r)
st=collections.Counter('confirmed' if 'confirmed' in r.get('delegation','') else 'awaiting' for r in recs)
ai=collections.defaultdict(list)
for r in recs: ai[r.get('ai_agents',{}).get('answer','not yet checked')].append(r)
cities=collections.Counter(r.get('city','').split(', ')[-1] for r in recs if r.get('city'))
link=lambda r:f"[{r['name']}](../{r['id']}/notes.md)"
out=f"""# The Brazilian delegation at Web Summit 2026

Public facts only, each with its source. Kept by crm@web-summit.dinis; regenerated from the records tagged
`topic:brazil-delegation` (last: 5 November 2026).

## Who and how big

- **Who runs it:** ApexBrasil (the Brazilian Trade and Investment Promotion Agency, a LIS26 event partner,
  [appearance](https://websummit.com/appearances/lis26/312753b4-1ff2-4859-a8d1-07e1e3653da8/apexbrasil)) with Sebrae
  Startups; supported by Serpro, Embratur and the Ministry of Foreign Affairs through the embassy in Lisbon
  ([SAPO](https://sapo.pt/artigo/brasil-traz-mais-de-200-empresas-para-o-web-summit-2026-6aeb62e38c34e87b49bc84b7)).
- **Where:** the Brazil pavilion, 324 m2 in the MEO Arena ([Link to Leaders](https://linktoleaders.com/brasil-traz-200-empresas-ao-web-summit-para-conquistar-investidores-europeus/));
  the schedule record is `schedules/2026-11-10/brazil-pavilion.json`.
- **How big (the sources disagree):** about 200 companies (most reports); 99 in the summit's programme, 90 from partner
  bodies and 50 from innovation ecosystems ([Jornal Económico](https://jornaleconomico.sapo.pt/noticias/brasil-leva-cerca-de-200-empresas-ao-web-summit-para-captar-investimento-europeu/));
  about 300 once hubs and 12 state missions are added ([Agência Sebrae, 30 Sep](https://agenciasebrae.com.br/inovacao-e-tecnologia/sebrae-e-apexbrasil-anunciam-startups-selecionadas-para-o-web-summit-lisboa-2026/)).
- **The official list:** ApexBrasil publishes its approved companies by CNPJ and status only
  ([EE-003616](https://crm-apps.apexbrasil.com.br/orgbdeab873/inscricao-eventos/evento/web-summit-lisboa-2026/0714952e-98da-f011-8543-7ced8db0f987)):
  188 rows at 28 August 2026: 105 confirmed, 26 awaiting confirmation, 33 waiting list, 24 withdrawn.

## In this CRM

**{len(recs)} delegation companies** have a folder ({st['confirmed']} confirmed, {st['awaiting']} awaiting confirmation),
named from the public CNPJ register (Receita Federal, via BrasilAPI) and, where it has one, the company's Web Summit
page. Sole traders registered under a person's own name appear by trade name only, or not at all. By state:
{', '.join(f'{k} {v}' for k,v in cities.most_common())}.

## AI agents (each line sourced in the company's record)

- **Builds AI agents ({len(ai['builds'])}):** {', '.join(map(link,ai['builds'])) or 'none yet'}
- **Uses AI, agents not stated ({len(ai['uses'])}):** {', '.join(map(link,ai['uses'])) or 'none yet'}
- **Not stated in what we read ({len(ai['not stated'])}):** {', '.join(map(link,ai['not stated'])) or 'none'}
- **Not yet checked ({len(ai['not yet checked'])}):** only the CNPJ register read so far; the next source is each company's
  own website or Web Summit page.

Brazilian startups at LIS26 that are not (yet) matched to the list carry `topic:brazil` only (e.g. Raras Health).

## Not done, and why

- {len(ai['not yet checked'])} companies have no AI-agents line yet (one source each to read).
- The waiting-list and withdrawn CNPJs are not named (not part of the delegation as published).
- CNPJs the register did not answer for (rate-limited) are named in a later run.
"""
open(V+'/companies/apexbrasil/notes.md','w').write(out); print(len(recs),dict(st),{k:len(v) for k,v in ai.items()})
