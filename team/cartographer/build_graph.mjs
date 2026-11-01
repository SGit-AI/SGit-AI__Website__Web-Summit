import fs from 'fs';
import {execSync} from 'child_process';
const R='/home/user/SGit-AI__Website__Web-Summit';
const comps=JSON.parse(execSync('git show HEAD:data/companies.json',{cwd:R})).companies;
const ids=new Set(comps.map(c=>c.id));
const ev=JSON.parse(fs.readFileSync(R+'/data/events.json'));
const S=Object.fromEntries(ev.sessions.map(s=>[s.id,s]));
const E=Object.fromEntries(ev.side_events.map(s=>[s.id,s]));
const J='our judgement';
const products=[
 {id:'sgit',name:'SGit',what:'Encrypted, versioned vaults that people and agents share, with signed history.',url:'https://sgit.ai',source:'REALITY.md; https://sgit.ai/llms.txt'},
 {id:'cyber-boardroom',name:'The Cyber Boardroom',what:'Our company, which takes the Algarve Evolution startup membership and shares its open-source workflows and technology.',url:null,url_note:'no website URL in our sources yet; the newsroom article is the only public statement we hold',source:'https://newsroom.sgit.ai/articles/joining-algarve-evolution.html'},
 {id:'abp',name:'RiskMandate Agent Behaviour Policies',what:'Written policies for what an AI agent may and may not do, for the people who answer for it.',url:'https://riskmandate.ai/abp.html',source:'https://riskmandate.ai/abp.html'},
 {id:'sharness',name:'SHarness',what:'A harness for running and checking agents, introduced by the newsroom.',url:'https://newsroom.sgit.ai/articles/introducing-sharness.html',source:'https://newsroom.sgit.ai/articles/introducing-sharness.html'},
 {id:'newsroom',name:'The SGit newsroom',what:'Our agent-run newsroom: articles with markdown twins and an API.',url:'https://newsroom.sgit.ai',source:'https://newsroom.sgit.ai'}
];
const links=[];
const L=(c,to,kind,why,source=J)=>{if(!ids.has(c))throw new Error('unknown '+c);links.push({from:'company:'+c,to,kind,why,source});};
// sessions: speaker org is the company, or session hosted by it
const sess=[['cloudflare','ws26-s01','speaks-at','co-founder and CEO on the agentic internet'],
 ['european-commission','ws26-s02','speaks-at','Executive Vice-President on Europe\'s tech moment'],
 ['elastic','ws26-s05','hosts','hosts the AI-security SOC masterclass'],
 ['delinea','ws26-s06','hosts','hosts the masterclass on letting AI agents into production safely'],
 ['startup-portugal','ws26-s07','hosts','hosts the guide to Portugal\'s startup scene'],
 ['crowdstrike','ws26-s25','speaks-at','speaks on AI vs AI in cyber defence'],
 ['primitive','ws26-s29','speaks-at','speaks on secure infrastructure for inter-agent communication'],
 ['cisco-outshift','ws26-s33','speaks-at','Cisco Systems speaks on public-private security'],
 ['delinea','ws26-s37','speaks-at','speaks on identity, access and user trust']];
for(const [c,s,k,w] of sess){if(!S[s])throw s;L(c,'session:'+s,k,w,S[s].source);}
for(const [c,s,k,w] of [['ibm','se10','hosts','co-hosts the tech hub side event and happy hour with Aubay Portugal'],
 ['elastic','se14','hosts','hosts an evening of dinner and networking in Lisbon'],
 ['shakers','se06','hosts','co-organiser of the startup football tournament before the summit']]){if(!E[s])throw s;L(c,'side_event:'+s,k,w,E[s].source);}
// products, by our judgement
const P=[
['cisco-outshift','abp','could-partner','agentic AI developer platform whose builders need behaviour policies'],
['cisco-outshift','sharness','relevant-to','open-source agent infrastructure; a place to run SHarness checks'],
['hexamind','abp','competes-with','Hexgate enforces company policy on each agent tool call'],
['hexamind','sharness','could-partner','an open-source policy enforcer SHarness could test against'],
['primitive','sgit','could-partner','agent email addresses meet our email agent and signed vault history'],
['primitive','abp','relevant-to','agents acting by email need a written mandate'],
['mastra','abp','could-partner','agents built on the framework need behaviour policies'],
['mastra','sharness','could-partner','a framework whose agents SHarness could run and check'],
['qase','sharness','competes-with','Tiden checks agent-written changes against what was asked, close to SHarness'],
['replit','sharness','relevant-to','agentic software creation; agents writing code need a harness'],
['replit','newsroom','relevant-to','a featured speaker on agentic creation: a newsroom story'],
['kpmg-portugal','abp','could-buy','audit and advisory firms will be asked to assure agent behaviour'],
['kpmg-portugal','cyber-boardroom','could-partner','board-level cyber risk is shared ground'],
['startup-portugal','cyber-boardroom','could-partner','the door to Portuguese startups for our Algarve work'],
['startup-portugal','newsroom','relevant-to','source for a Portuguese ecosystem story'],
['1password','sgit','could-partner','agent secrets and identity next to our encrypted vaults'],
['1password','abp','relevant-to','the security layer for how agents authenticate; policies decide what they then do'],
['cloudflare','abp','relevant-to','what an agent can reach on the web is a behaviour-policy question'],
['cloudflare','newsroom','relevant-to','the agentic internet talk is a newsroom story'],
['crowdstrike','newsroom','relevant-to','AI-native security reference point for an article'],
['crowdstrike','cyber-boardroom','relevant-to','the threat picture boards ask about'],
['delinea','abp','could-partner','governs what agents do once they have access; ABP writes what they should do'],
['delinea','sgit','relevant-to','identity for machines and agents next to signed agent keys'],
['polygraf-ai','abp','competes-with','an AI behavioral control plane enforcing inline governance'],
['polygraf-ai','sharness','could-partner','runtime enforcement that SHarness could exercise'],
['cnext','abp','could-buy','builds compliant agents for European businesses; needs policies to show'],
['getvocal-ai','abp','could-buy','sells contact-centre agents on full control and trust'],
['keewano','sgit','relevant-to','an ordered event history for agents parallels versioned vaults'],
['manus-ai','abp','relevant-to','a general action agent is the archetype that needs a mandate'],
['strawberry','abp','relevant-to','browser companions acting in signed-in accounts need a mandate'],
['you-com','newsroom','relevant-to','a featured speaker on agent infrastructure: a story'],
['datadog','sharness','relevant-to','observability of agent runs next to harness checks'],
['temporal','sharness','could-partner','durable execution runs long agents that a harness checks'],
['legalfly','abp','could-buy','in-house legal teams write the policies agents follow'],
['risiq','abp','could-buy','bank risk and regulatory work needs evidence of agent policy'],
['risiq','cyber-boardroom','relevant-to','board-level risk governance for banks'],
['european-commission','abp','relevant-to','the AI Act is the regulatory backdrop for behaviour policies'],
['european-commission','newsroom','relevant-to','EU tech sovereignty is a newsroom story'],
['atlassian','abp','relevant-to','Rovo agents across Jira and Confluence act for teams'],
['melious-ai','sgit','could-partner','sovereign EU inference as a possible backend for our agents'],
['air-apps','newsroom','relevant-to','a Portuguese success story'],
['chatplace','abp','could-buy','an AI manager that answers for creators needs a mandate'],
['firefox-enterprise-mozilla','sgit','relevant-to','same audience: EU organisations seeking customer-controlled tools'],
['kiggu','newsroom','relevant-to','AI plus human offensive security: an interview'],
['kiggu','sharness','relevant-to','automated security orchestration next to harness checks'],
['spacecomputer','sgit','could-partner','key management and attestation share our verifiable approach'],
['altegio','newsroom','relevant-to','a system of record as the layer agents build on'],
['delta-labs','newsroom','relevant-to','synthetic customer twins relate to our synthetic-user studies'],
['genspark','newsroom','relevant-to','a fast-growing agent workspace: a headline for an article'],
['sensay','sgit','relevant-to','living team knowledge bases next to shared vaults'],
['elastic','sharness','relevant-to','security operations with AI, close to harness checks'],
['orb','newsroom','relevant-to','usage-based billing, relevant to how we charge for the newsroom API'],
['prelude','sgit','relevant-to','verification and authentication APIs next to signed agent identity'],
['runpod','newsroom','relevant-to','GPU cloud: describe only'],
['twilio','sgit','relevant-to','communications APIs used by agents that send messages'],
['0xbow','sgit','relevant-to','privacy with compliance parallels encrypted vaults'],
['arima','newsroom','relevant-to','privacy-first synthetic data: describe'],
['contents','newsroom','competes-with','AI content lifecycle with governance, close to the newsroom\'s evidence trail'],
['sphere','newsroom','relevant-to','AI-native tax compliance: describe'],
['andreessen-horowitz','cyber-boardroom','relevant-to','an investor in AI and infrastructure; agent security as a category'],
['neo','cyber-boardroom','relevant-to','early-stage investor and residency for technical founders'],
['pitchbook','newsroom','relevant-to','capital-markets data for researching investors on the map'],
['shakers','cyber-boardroom','could-partner','a marketplace of European AI builders as an implementer channel'],
['cerebras','newsroom','relevant-to','fast inference hardware: describe only'],
['google-cloud','sharness','relevant-to','Agent Development Kit ecosystem whose agents a harness could check'],
['ibm','abp','relevant-to','watsonx responsible-AI governance overlaps behaviour policies'],
['dig-in','newsroom','relevant-to','a Portuguese data company: describe'],
['itrecruiter','newsroom','relevant-to','the Portuguese tech talent market: describe'],
['sheerme','newsroom','relevant-to','a Portuguese consumer app: describe'],
['vtex','newsroom','relevant-to','commerce platform with Portugal as country: describe'],
['akamai','abp','relevant-to','agent traffic at the edge: what agents may reach'],
['gcore','sgit','relevant-to','European edge and cloud as a hosting and sovereignty option'],
['manageengine','sharness','could-buy','mid-market IT teams will govern agents on endpoints'],
['mobbeel','sgit','relevant-to','verified identity for people, counterpart of signed identity for agents']];
for(const [c,p,k,w] of P)L(c,'product:'+p,k,w+' (our judgement)');
// every company linked?
const linked=new Set(links.map(l=>l.from.slice(8)));
const missing=[...ids].filter(i=>!linked.has(i)); if(missing.length)throw new Error('unlinked '+missing);
const proposals=comps.map(c=>({company:c.id,decision:c.decision,priority:c.priority,why:c.why_it_matters.replace(/\s*—\s*/g,'; '),status:'proposed'}));
const clusters=[
 {id:'agent-identity',name:'Agent identity and access',companies:['1password','delinea','prelude','mobbeel','primitive','spacecomputer','cloudflare'],why:'Who an agent is and what it can reach: the ground next to SGit keys and vaults.'},
 {id:'agent-governance',name:'Agent governance and AI security',companies:['polygraf-ai','hexamind','crowdstrike','cisco-outshift','kiggu','akamai','manageengine','firefox-enterprise-mozilla','elastic','datadog'],why:'Controlling and watching what agents do: where Agent Behaviour Policies and SHarness compete and partner.'},
 {id:'agent-frameworks',name:'Agent frameworks, runtimes and products',companies:['mastra','temporal','replit','qase','keewano','manus-ai','genspark','strawberry','you-com','atlassian','altegio'],why:'The builders and their agents: the ones whose agents need a mandate and a harness.'},
 {id:'agent-buyers',name:'Companies selling agents to businesses',companies:['cnext','getvocal-ai','chatplace','legalfly','sensay','delta-labs'],why:'They sell trust and control in agents to their customers: likely buyers of written policies.'},
 {id:'grc-regulation',name:'GRC, audit and regulation',companies:['kpmg-portugal','risiq','contents','sphere','0xbow','arima','european-commission','ibm'],why:'The people who answer for agents: auditors, regulators and compliance tools.'},
 {id:'portugal',name:'Portugal ecosystem',companies:['startup-portugal','air-apps','chatplace','dig-in','itrecruiter','sheerme','vtex','kpmg-portugal','shakers'],why:'Our Algarve and Portugal community work, and the Portuguese-language site.'},
 {id:'infrastructure',name:'AI infrastructure and sovereign cloud',companies:['melious-ai','gcore','cerebras','google-cloud','runpod','twilio','orb'],why:'Where agents run and how they are paid for; the EU-hosted options matter to us.'},
 {id:'investors',name:'Investors and market intelligence',companies:['andreessen-horowitz','neo','pitchbook'],why:'Capital and data on the category; describe and research, not a first meeting.'}];
for(const cl of clusters)for(const c of cl.companies)if(!ids.has(c))throw c;
const inCl=new Set(clusters.flatMap(c=>c.companies));const nocl=[...ids].filter(i=>!inCl.has(i));if(nocl.length)throw new Error('no cluster '+nocl);
const fm=[
 ['delinea','agent access in production is the case ABP writes policies for; two sessions','session:ws26-s06 (10 Nov, Masterclass 3, they host) or session:ws26-s37 (12 Nov, Stage 8)'],
 ['primitive','email built for agents meets our email agent and signed vaults','session:ws26-s29 (12 Nov, Stage 9)'],
 ['cloudflare','what an agent can reach on the web; a Centre Stage talk','session:ws26-s01 (10 Nov, Centre Stage)'],
 ['cisco-outshift','open-source agentic AI platform; a route to agent builders','session:ws26-s33 (12 Nov, Stage 8), or the partner stand'],
 ['elastic','AI security operations and a host of a side event: two easy places to meet','session:ws26-s05 (10 Nov, Masterclass 4) or side_event:se14 (10 Nov evening)'],
 ['startup-portugal','the door to Portuguese startups and our Algarve work','session:ws26-s07 (10 Nov, Masterclass 1, they host) or session:ws26-s40 (founders in Portugal meetup, 12 Nov)'],
 ['hexamind','Hexgate is the nearest open-source neighbour of ABP: compete or partner','session:ws26-s39 (people in cybersecurity meetup, 12 Nov); stand not yet read'],
 ['polygraf-ai','an AI behavioral control plane: compete or partner on policy enforcement','session:ws26-s39 (people in cybersecurity meetup, 12 Nov); startup stand day not yet read'],
 ['1password','agent identity and secrets next to our vaults','partner stand (location not yet read); session:ws26-s39 (people in cybersecurity meetup, 12 Nov)'],
 ['mastra','the leading TypeScript agent framework: its agents need policies and a harness','startup stand (day not yet read); session:ws26-s12 (Developer Lounge, 10 Nov) is the nearest developer session'],
 ['kpmg-portugal','auditors will be asked to assure agent behaviour; an event partner in Lisbon','partner stand (location not yet read); session:ws26-s40 (founders in Portugal meetup, 12 Nov)'],
 ['crowdstrike','the AI-native security reference point; decision is write-about, a talk to cover','session:ws26-s25 (12 Nov, Stage 8)']
].map(([company,why,where])=>({company,why,session_or_event:where,status:'proposed'}));
const graph={about:'Links between companies, sessions, events, people seats and our products. Kept by the cartographer.',
 read_on:'2026-11-01',
 method:'Built by cartographer@web-summit on 1 November 2026 from the committed data/companies.json (HEAD, '+comps.length+' companies) and data/events.json. Company-to-session and company-to-side-event links only where a session speaker\'s organisation is the company, or the session or event names it as host; source is the session or event URL. Company-to-product links, proposals, clusters and first meetings are our judgement and are proposals until each company\'s owner decides. Proposals echo the researcher\'s decision and priority from data/companies.json.',
 nodes:{products,sessions:ev.sessions.map(s=>s.id),side_events:ev.side_events.map(s=>s.id)},
 links,proposals,clusters,first_meetings:fm};
fs.writeFileSync(R+'/data/graph.json',JSON.stringify(graph,null,2)+'\n');
console.log('links',links.length,'by kind',JSON.stringify(links.reduce((a,l)=>(a[l.kind]=(a[l.kind]||0)+1,a),{})),'proposals',proposals.length);
