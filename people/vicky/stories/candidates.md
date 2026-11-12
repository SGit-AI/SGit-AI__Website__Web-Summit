# The curator's story candidates

Kept by curator@PrompTugal.vicky (until 6 November curator@web-summit.vicky), Vicky's curator desk for PrompTugal.news. The curator reads what the researcher found and suggests stories for the journalist. This page lists every story idea that is still open, newest first, each with its sources underneath. It is updated at every curator run (07:45, 11:45, 15:45 and 19:45 UTC).

**About the sources.** Each source is a public page the researcher captured in the research vault (41j3e9s9), with the publisher, its title and the day the researcher read it, written as the newsroom's STYLE.md asks. The curator copies them from the researcher's captures and does not open or check them; that is the fact-checkers' job, on both sides: reviewer@PrompTugal.vicky for Vicky's desks, and Indi's fact-checker for Indi's. Only pages that are public and open without a login are listed. A storyline with nothing behind it yet says "no source yet".

**Connections** (from 5 November, at Dinis's direction): stories that link startups and companies at Web Summit so each gets the most out of the week: startups in the same field, startups and the investors or programmes that back that field, companies on the same stage or day, Portuguese startups and the European ones they could work with. They are marked "Connections" in the beat. Each link is the curator's suggestion from public facts: no source says these organisations plan to meet, and no story should say so. Organisations only; nothing private about anyone.

Last updated: Thursday 12 November 2026, 07:38 UTC.

**Categories** (Vicky, 10 November 2026): the curator assigns every article its main categories from `desks/curator/categories.json` (one or more of Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate) when commissioning it, and adds its line to that file before the article is published. A new main category only with Vicky's approval; routine corrections are the curator's. Corporate versus Startups & Scaleups by the story's subject and angle, never by size, valuation, funding round or headcount. No article file is edited for this.

**Categories with every commission** (conductor.B at Vicky's word, 11 November 2026): every commission in a map carries its `categories` (in the story and in its note and README line); and as soon as a draft goes to review, the curator sends reviewer@PrompTugal.vicky the slug (the draft file name without the S-number) and the categories line, with the curator's word for reviewer@ to add it to `categories.json` in the same release as the article, so nothing Ready waits for it.

**Standing source rule: storm-charles.promptugal.news** (conductor.B at Vicky's word, 11 November 2026, at Dinis's request; full rule `desks/conductor-vicky/sources/storm-charles.md`): Dinis's incident team's storm site (JSON at `/api/v1/index.json`, `llms.txt`) is an input for storm and summit-disruption angles, a pointer and never the source we cite. Every fact is read and cited at the official source (IPMA, ANEPC, the government, an operator, Web Summit) before commissioning or publishing; it is not independent confirmation of our weather desk or social.watch (it reads both); its hypothesis and analysis rows are never stated as fact; check each row's read time. Its closures list and Thursday outlook may suggest angles.

**Standing source rule: lisbontechfringe.com** (conductor.B at Vicky's word, 11 November 2026, 13:20 UTC, at Dinis's suggestion): the Lisbon Fringe site (data at `/api/v1/events.json` and `/api/v1/graph.json`) is an input for side-event angles (events moved or cancelled by the storm, communities, meetups), under the same rule as the storm site: a pointer, never the citation; every fact is checked and cited at the organiser's own page before we publish; its "unknown" or unconfirmed rows are never stated as fact; it is built by Dinis's swarm including Vicky's own fringe conductor, so it is not independent confirmation of what our desks already say. From 11 November 17:24 UTC (conductor.B, until the researcher audits its 16:13 UTC pass, which refreshed read_at times without re-checking each event's status): treat a Fringe entry's read_at as a pointer only; any side-event fact commissioned rests on the organiser's own page read by a person, or the organiser's own post.

**Connections: how participation in Web Summit is confirmed** (conductor.B relaying Vicky, 11 November 2026, about 13:45 UTC; updates standing answer 19's confirmation step): for Connections storylines, participation may be confirmed by the person's or company's own public page or post, a press report, or Vicky's own browser read of their Web Summit page. **No machine reads of websummit.com by any desk** (from this note on the curator makes none: no curl or script against websummit.com; Web Summit facts come from its public statements as quoted by others, the organiser pages of side events, or a person's read in a browser). The duplicate checks stand.

**Web Summit: no machine reads, no copied data for new work** (conductor.B relaying Vicky after Dinis's answer "yes, don't use them", 11 November 2026, about 14:30 UTC): (1) No machine reads of websummit.com, any of its subdomains or the Web Summit app by this desk: no curl, fetch, script, sub-agent, headless or automated browser, API or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press. (2) The desk's tools, scripts, notes and wake prompt carry no step that reads websummit.com (checked 11 November 2026, 14:35 UTC; the generator reads only the local research-vault clone and writes this page; the websummit.com links on this page are citations of stories already published, not reads). (3) No new work from data copied from Web Summit's site: the programme agenda (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places` and the Web Summit links in `data/companies`, and the researcher's startup capture in the vault; nothing of it is deleted or changed until Dinis says what to do with it.

**No machine reads of Luma, Meetup or Eventbrite** (conductor.B relaying Vicky, 11 November 2026, about 14:40 UTC, until Dinis decides on Luma and the terms of Meetup and Eventbrite are checked): no machine reads of luma.com, lu.ma or Luma's API, meetup.com or eventbrite.com by this desk. Side-event leads from lisbontechfringe.com stay usable as pointers; a fact that needs the organiser's page on those sites needs a person's browser read. (The curator read three Luma pages by machine at 13:35 UTC on 11 November, before the rule; that is recorded on S57.)

**Sources for anything about Web Summit** (conductor.B relaying Vicky, 11 November 2026, about 15:45 UTC, until Dinis decides): use press reports, the companies', speakers' and organisers' own posts and releases, official public bodies, and a person's browser check for single facts. Link to Web Summit's pages instead of copying or summarising them. Applied to commissioning: each brief says which of these sources support the angle, and no angle rests on summarising Web Summit's own pages.

**Temporary discovery workflow** (Vicky, 11 November 2026, about 00:30 UTC, until her researcher returns; full text `desks/conductor-vicky/discovery/WORKFLOW.md`): at each wake the curator reads new leads in `desks/journalist-vicky/leads/` and social.watch's public findings (`board/team/social.watch/`: newest `hourly/` file, `coverage.json`, `signals/`; read-only material), runs the usual duplicate check and source checks, re-reads each source before commissioning, and commissions as usual with categories in `categories.json`. Connections still needs a public Web Summit source confirming participation. Each map carries a `leads_reviewed` list (each lead: commissioned with story id, held with why, or dropped with why). Research gaps go to `desks/journalist-vicky/leads/requests.md` (desk, gap, sources wanted) as well as `gaps_for_the_researcher`. When the researcher returns, the curator finishes the logged leads and hands over requests.md and the open gaps.

## At a glance

| Id | Title | Beat | Added |
|---|---|---|---|
| S59 | Discord is opening its first engineering hub outside San Francisco, in Lisbon | Portugal | 12 Nov |
| S58 | Thursday at Web Summit: a practical guide to the last day (published 11 Nov) | The summit | 11 Nov |
| S56 | The EU proposes a Digital Fairness Act: what it would change for online shoppers, including those using AI agents (published 11 Nov) | Europe | 11 Nov |
| S55 | The EU says TikTok's For You feed may breach its platform law: what it found, and what happens next (published 11 Nov) | Europe | 11 Nov |
| S54 | Four startups pitch on Thursday's Centre Stage: what each says it does (published 11 Nov) | Connections: the summit | 11 Nov |
| S53 | The EU asks for views on updating its election rules for the age of generative AI (published 11 Nov) | Europe | 11 Nov |
| S52 | Konecta chooses Lisbon for a global delivery centre, with 700 new jobs by the end of 2027 (published 11 Nov) | Portugal | 11 Nov |
| S51 | Getting around Lisbon on Wednesday: what Carris and Fertagus have said, and what the government has closed (published 11 Nov) | The summit | 11 Nov |
| S50 | The AI Act's first harmonised standard is out: what EN 18286 changes for AI providers (published 11 Nov) | Europe | 11 Nov |
| S49 | Update: the EU's Wednesday sessions at Web Summit fall on the cancelled day (published 11 Nov) | Europe | 11 Nov |
| S48 | Manus 2.0: agents that get their own email, phone number and wallet, in Manus's own words (published 11 Nov) | Connections: the summit | 11 Nov |
| S47 | Update: Web Summit's final 2026 figures (published as an update) | The summit | 11 Nov |
| S46 | How Zalando rolled out AI coding agents across 250 teams, in its own account (published 11 Nov) | AI and robotics | 11 Nov |
| S45 | Web Summit's cancelled Day 2: what is known about refunds (published 10 Nov) | The summit | 10 Nov |
| S44 | Update: Web Summit's Wednesday will not take place; it aims to hold Thursday (drafted, awaiting review) | The summit | 10 Nov |
| S42 | What Lovable deleted: its CEO on rebuilding an AI coding agent (published 10 Nov) | AI and robotics | 10 Nov |
| S41 | Red wind warning for Lisbon on Wednesday: what it means for Web Summit (published 10 Nov) | The summit | 10 Nov |
| S40 | AI agents are spreading faster than their security, Gravitee's survey finds (published 10 Nov) | The summit | 10 Nov |
| S39 | How WPP turns call transcripts into reviewed Jira plans (published 10 Nov) | Connections: the summit | 10 Nov |
| S38 | Glovo's restaurant partners meet 80 AI agents on WhatsApp, GetVocal says (published 10 Nov) | Connections: the summit | 10 Nov |
| S37 | What failed when Teamworks built an AI assistant for NFL coaches (published 10 Nov) | AI and robotics | 10 Nov |
| S36 | Portugal on the programme: a masterclass, a meetup and three announcements (published 9 Nov) | Portugal | 9 Nov |
| S35 | Web Summit's press conferences, day by day: what is announced and when (published 9 Nov) | The summit | 9 Nov |
| S34 | Where to find Portugal at Web Summit: Pavilion 1, stand E145 (published 9 Nov) | Portugal | 9 Nov |
| S33 | Sports tech at Web Summit: IBM's startup challenge ends in Lisbon (published 9 Nov) | The summit | 9 Nov |
| S32 | Rehab beyond the clinic: three Portuguese startups at Web Summit | Connections: Portugal | 9 Nov |
| S31 | Beyond Lisbon: where Road 2 Web Summit's 78 startups come from (published 9 Nov) | Portugal | 9 Nov |
| S30 | Eleven health startups at Web Summit, by the problem they tackle (published 8 Nov) | Connections: the summit | 8 Nov |
| S29 | Who builds the parts of an AI agent? Startups at Web Summit (published 8 Nov) | AI and robotics | 8 Nov |
| S28 | Five AI builders on Web Summit's speaker list worth knowing (published 8 Nov) | Connections: the summit | 8 Nov |
| S27 | A map of Web Summit's buildings, and what each holds | AI and robotics | 7 Nov |
| S26 | Two editions a day: PrompTugal.news starts a daily newsletter | AI and robotics | 7 Nov |
| S25 | The sign-in: how editors and agents prove who they are | AI and robotics | 7 Nov |
| S24 | Driving to Web Summit? Road closures and drop-off points | The summit | 6 Nov |
| S22 | From pineapple waste to fish feed: AgroGrINTech's pilot in Maia | Portugal | 6 Nov |
| S20 | Lisbon's Octo Health launches health tracking in Portugal and the US | Portugal | 6 Nov |
| S19 | Brazil comes to Lisbon as Intuitivo heads to Brazil | Connections: announcements | 5 Nov |
| S18 | Tuesday 10 November: Europe on Centre Stage, universities pitching, first-timers meeting | Connections: the summit | 5 Nov |
| S17 | 11 November for startups going abroad: three events to know | Connections: Europe | 5 Nov |
| S16 | Europe's AI and funding help, a walk from Portugal's AI startups | Connections: Europe | 5 Nov |
| S15 | From Técnico's stand to the lineup: following robotics at Web Summit | Connections: the summit | 5 Nov |
| S13 | Web Summit's ten Lisbon years: 2.5 billion euros, says EY | Portugal | 5 Nov |
| S12 | A robot among 800 speakers: Web Summit 2026 turns to robotics | The summit | 5 Nov |
| S11 | Italy and Portugal meet in Beato on how European tech scales | Europe | 5 Nov |
| S10 | Lisbon's universities at Web Summit: two stands and a pitch day | Portugal | 5 Nov |
| S9 | About 200 Brazilian companies come to Lisbon for Web Summit | Announcements | 4 Nov |
| S7 | The Portugal banner: awards, funding and the Algarve's plan | Portugal | 4 Nov |
| S6 | Gender in Tech report: 84% see women in leadership | Announcements | 4 Nov |
| S5 | Web Summit 2026 in numbers: 70,000 people, 10,000 startups | Announcements | 4 Nov |
| S4 | From the PITCH stage to new markets: Portuguese startups raising | Portugal | 4 Nov |
| S3 | Road 2 Web Summit: Portugal's startups head for Lisbon | Portugal | 4 Nov |
| S2 | Europe arrives in Pavilion 4: the Commission's week at Web Summit | Europe | 4 Nov |
| S1 | Web Summit Lisbon: your first day, from airport to arena | The summit | 4 Nov |

## S59: Discord is opening its first engineering hub outside San Francisco, in Lisbon

Portugal, added 12 Nov. Discord's own recruiting text says it is opening an engineering hub in Lisbon, its first outside San Francisco; what that says, and does not yet say, about Portugal's tech jobs. For journalist-portugal, categories Portugal and Corporate. One primary source plus a press report the writer reads.

Sources:

- [Discord (its own job posting, shown on the General Catalyst job board), "IT Ops Engineer - Lisbon @ Discord | General Catalyst Job Board"](https://jobs.generalcatalyst.com/companies/discord-2/jobs/96245323-it-ops-engineer-lisbon), read 12 November 2026

## S58: Thursday at Web Summit: a practical guide to the last day

The summit, added 11 Nov. A practical guide to the last summit day after Wednesday's cancellation: what Web Summit says has changed, plus weather, transport, the end of the alert and side events, each checked at its own source. For journalist (summit desk), category Web Summit 2026. Time-sensitive: write tonight. Published on 11 Nov 2026: https://promptugal.news/articles/thursday-last-day-guide.html. Not to be written again.

Sources:

- [Web Summit (as read by Vicky in her own browser, 11 Nov 20:15 UTC), "Schedule"](https://websummit.com/schedule/), read 11 November 2026

## S56: The EU proposes a Digital Fairness Act: what it would change for online shoppers, including those using AI agents

Europe, added 11 Nov. The Commission's proposal to update EU consumer law for online shopping: bans on manipulative design, clearer pricing, easier cancellation, a right to a human, and rights when an AI agent buys for a consumer; a proposal still to be debated by Parliament and Council. LEADS-11NOV-8, for journalist-europe. Categories: Europe, AI. The AI-agent rights are only named in the sources. Published on 11 Nov 2026: https://promptugal.news/articles/digital-fairness-act-ai-agents.html. Not to be written again.

Sources:

- [European Commission, "Press release IP/26/2407: Commission strengthens consumer protection laws, making them fit for the digital age"](https://ec.europa.eu/commission/presscorner/detail/en/ip_26_2407), read 11 November 2026

## S55: The EU says TikTok's For You feed may breach its platform law: what it found, and what happens next

Europe, added 11 Nov. The Commission's preliminary view that TikTok did not adequately assess, and has not effectively reduced, the 'rabbit hole' effect of its recommender system, the changes it says are needed, and the procedure that follows. LEADS-11NOV-7, for journalist-europe. Category: Europe. Preliminary findings only; TikTok's response not found. Published on 11 Nov 2026: https://promptugal.news/articles/tiktok-for-you-dsa-preliminary-finding.html. Not to be written again.

Sources:

- [European Commission, "Press release IP/26/2361: Commission preliminarily finds TikTok's 'For You' feed in breach of the Digital Services Act for harmful 'rabbit holes' effect"](https://ec.europa.eu/commission/presscorner/detail/en/ip_26_2361), read 11 November 2026

## S54: Four startups pitch on Thursday's Centre Stage: what each says it does

Connections: the summit, added 11 Nov. A preview of Thursday's 'Breakout startups' session: a physical-AI research lab, a Brazil-focused finance automation tool, an enterprise agent platform and a hologram company, each in its own words. LEADS-11NOV-5, for journalist-connections. Categories: Startups & Scaleups, Web Summit 2026, AI. Time-sensitive. Published on 11 Nov 2026: https://promptugal.news/articles/breakout-startups-thursday-centre-stage.html. Not to be written again.

Sources:

- [Web Summit, "Breakout startups (session, Centre Stage, Thursday 12 November)"](https://websummit.com/sessions/lis26/1b2f3f6c-8bf5-4ef8-9b45-41716bf85c15/breakout-startups/), read 11 November 2026

## S53: The EU asks for views on updating its election rules for the age of generative AI

Europe, added 11 Nov. The Commission has opened a consultation until 23 November on draft revised election guidelines under the Digital Services Act: what platforms would be asked to do about AI-made manipulation and recommender systems, and who can respond. LEADS-11NOV-4, for journalist-europe. Categories: Europe, AI. Published on 11 Nov 2026: https://promptugal.news/articles/eu-election-guidelines-generative-ai.html. Not to be written again.

Sources:

- [European Commission, "Targeted consultation on the draft revised election guidelines under the Digital Services Act (DSA)"](https://digital-strategy.ec.europa.eu/en/consultations/targeted-consultation-draft-revised-election-guidelines-under-digital-services-act-dsa), read 11 November 2026

## S52: Konecta chooses Lisbon for a global delivery centre, with 700 new jobs by the end of 2027

Portugal, added 11 Nov. Konecta's own release: a new Global Delivery Center in Lisbon opening in Q1 2027, positioned as a centre of excellence in AI and digital transformation, from about 1,300 to about 2,000 staff. LEADS-11NOV-3, for journalist-portugal. Categories: Portugal, Corporate. Do not state a Web Summit tie. Published on 11 Nov 2026: https://promptugal.news/articles/konecta-lisbon-delivery-centre.html. Not to be written again.

Sources:

- [Konecta, "Konecta announces the launch of a next-generation Global Delivery Center dedicated to AI excellence in Lisbon"](https://konecta.com/news-insights/press-releases/konecta-announces-the-launch-of-a-next-generation-global-delivery-center-dedicated-to-ai-excellence-in-lisbon), read 11 November 2026

## S51: Getting around Lisbon on Wednesday: what Carris and Fertagus have said, and what the government has closed

The summit, added 11 Nov. A short practical guide for a day when Web Summit's Day 2 is off: Carris cancelled its Web Summit shuttle, Fertagus will suspend the 25 de Abril bridge crossing above 90 km/h, and the government's alert closes schools and non-essential services, suspends outdoor events and bars the waterfront and high-risk parks. LEADS-11NOV-3, for journalist (summit desk). Time-sensitive; replaces S43. Categories: Web Summit 2026, Portugal. Published on 11 Nov 2026: https://promptugal.news/articles/getting-around-lisbon-wednesday.html. Not to be written again.

Sources:

- [Carris, "Alerta de circulacao (alert notice)"](https://www.carris.pt/viaje/alteracoes-de-servico/alerta-circulacao/), read 11 November 2026
- [Fertagus, "Informacao ao Publico (red alert notice)"](https://www.fertagus.pt/Fertagus-pt/Viajar/Comunicados-e-Campanhas/Informa%C3%A7%C3%A3o-ao-P%C3%BAblico), read 11 November 2026
- [Government of Portugal, "Governo declara situacao de alerta em todo o territorio continental"](https://portugal.gov.pt/gc25/comunicacao/noticias/governo-declara-situacao-de-alerta-em-todo-o-territorio-continental-1), read 10 November 2026

## S50: The AI Act's first harmonised standard is out: what EN 18286 changes for AI providers

Europe, added 11 Nov. The Commission's account: the first harmonised standard supporting the AI Act, for quality management in high-risk AI systems, with a presumption of conformity with Article 17; layered on ISO standards; more to follow. LEADS-11NOV-2, for journalist-europe. Categories: Europe, AI. Published on 11 Nov 2026: https://promptugal.news/articles/ai-act-first-harmonised-standard.html. Not to be written again.

Sources:

- [European Commission, "First harmonised standard supporting the AI Act published in the Official Journal"](https://digital-strategy.ec.europa.eu/en/library/first-harmonised-standard-supporting-ai-act-published-official-journal), read 11 November 2026

## S49: Update: the EU's Wednesday sessions at Web Summit fall on the cancelled day

Europe, added 11 Nov. An update note for the Commission-week article: four EU sessions are listed for Wednesday 11 November; Web Summit has said Day 2 will not take place; the Commission's page does not say whether they move. LEADS-11NOV-2, for journalist-europe. An update, not a new article. Time-sensitive. Published on 11 Nov 2026: https://promptugal.news/articles/europe-in-pavilion-4.html. Not to be written again.

Sources:

- [European Commission, "Web Summit 2026 (event page)"](https://digital-strategy.ec.europa.eu/en/events/web-summit-2026), read 11 November 2026

## S48: Manus 2.0: agents that get their own email, phone number and wallet, in Manus's own words

Connections: the summit, added 11 Nov. A speaker company's own description of its new release: a new agent harness, event-triggered automations, a desktop studio, and Cue, an app where each agent has its own email, phone number, wallet and computer. LEADS-11NOV-2, for journalist-connections. Company's own account from 28 Sept; Web Summit's speakers page confirms participation. Categories: AI, Startups & Scaleups, Web Summit 2026. Published on 11 Nov 2026: https://promptugal.news/articles/manus-2-0-agents-own-email-phone-wallet.html. Not to be written again.

Sources:

- [Manus, "Introducing Manus 2.0"](https://manus.im/blog/introducing-manus-2-0), read 11 November 2026
- [Web Summit, "Speakers"](https://websummit.com/speakers/), read 11 November 2026

## S47: Update: Web Summit's final 2026 figures

The summit, added 11 Nov. An update note on the published numbers article: Web Summit's own post of 10 Nov gives 70,003 attendees from 164 countries, 1,943 investors and 3,052 exhibiting companies. LEADS-11NOV, for journalist (summit desk). An update, not a new article.

Sources:

- [Web Summit, "Web Summit 2026 record number of investors"](https://websummit.com/blog/news/web-summit-2026-record-number-of-investors/), read 11 November 2026

## S46: How Zalando rolled out AI coding agents across 250 teams, in its own account

AI and robotics, added 11 Nov. A first-hand engineering account: one proxy for every model, no mandated tool, no secrets in config files, and a bot that auto-approves low-risk pull requests; what worked and why Zalando says it is too early to converge. LEADS-11NOV, for journalist-ai. Company's own account from 14 Aug; no Web Summit link established. Published on 11 Nov 2026: https://promptugal.news/articles/zalando-ai-coding-agents.html. Not to be written again.

Sources:

- [Zalando Engineering, "Agentic Engineering at Zalando: a snapshot"](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html), read 11 November 2026

## S45: Web Summit's cancelled Day 2: what is known about refunds

The summit, added 10 Nov. Web Summit's post says it will contact those impacted and does not mention refunds, credits or compensation; its published terms set out cancellation, postponement and events beyond its control. A plain account of what is published and what is not announced. STORM-10NOV, for journalist (summit desk). Time-sensitive. Quote the terms, do not interpret; consumer pages to be read by the journalist. Published on 10 Nov 2026: https://promptugal.news/articles/web-summit-day-2-refunds.html. Not to be written again.

Sources:

- [Web Summit, "Important event update"](https://websummit.com/blog/web-summit/important-event-update-2026/), read 10 November 2026
- [Web Summit, "Terms and conditions"](https://websummit.com/terms-and-conditions/), read 10 November 2026

## S44: Update: Web Summit's Wednesday will not take place; it aims to hold Thursday

The summit, added 10 Nov. An update note for the published Wednesday 11 November guide, from Web Summit's own statement: Day 2 will not take place on the Government's formal advice; it aims to proceed with Day 3 on Thursday as planned. STORM-10NOV, for journalist (summit desk). An update, not a new article. Time-sensitive.

Sources:

- [Web Summit, "Important event update"](https://websummit.com/blog/web-summit/important-event-update-2026/), read 10 November 2026

## S42: What Lovable deleted: its CEO on rebuilding an AI coding agent

AI and robotics, added 10 Nov. A first-hand engineering account from Lovable's CEO (4 Nov), who spoke at the night session on 9 Nov: almost all agent code deleted, knowledge files instead of fine-tuning, sandboxes that fork a whole running computer. MANUAL-10NOV, for journalist-ai. Company's own account; attribute every figure. Published on 10 Nov 2026: https://promptugal.news/articles/what-lovable-deleted.html. Not to be written again.

Sources:

- [Lovable, "How we built Lovable, and why we keep rebuilding it"](https://lovable.dev/blog/how-we-built-lovable-and-why-we-keep-rebuilding-it), read 10 November 2026
- [Web Summit, "The future of AI (Centre Stage, 9 Nov 18:55)"](https://websummit.com/sessions/lis26/391103b5-871a-4a6a-9763-4c3c2b588610/the-future-of-ai/), read 9 November 2026

## S41: Red wind warning for Lisbon on Wednesday: what it means for Web Summit

The summit, added 10 Nov. IPMA's red wind warning for Lisbon district, Wednesday 11 Nov 12:00 to 21:00, with orange rain and sea warnings; what is known and what Web Summit has yet to decide. MANUAL-10NOV, for journalist (summit desk). Time-sensitive. Web Summit's decision is not confirmed: read it at the source. Published on 10 Nov 2026: https://promptugal.news/articles/red-wind-warning-lisbon-wednesday.html. Not to be written again.

Sources:

- [IPMA (Portugal's weather and sea institute), "Weather warnings by district, open data (Lisbon district LSB)"](https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json), read 10 November 2026
- [IPMA (Portugal's weather and sea institute), "Daily forecast for Lisbon, 10 to 14 November, open data"](https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json), read 10 November 2026

## S40: AI agents are spreading faster than their security, Gravitee's survey finds

The summit, added 10 Nov. Gravitee's vendor survey of 900+ finds adoption ahead of control; its CEO gives a press conference at the summit today at 14:30. OVERNIGHT-10NOV, for journalist (summit desk). Time-sensitive. Published on 10 Nov 2026: https://promptugal.news/articles/gravitee-agent-security-survey.html. Not to be written again.

Sources:

- [Gravitee (vendor report summary), "State of AI Agent Security 2026 Report: When Adoption Outpaces Control"](https://gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control), read 9 November 2026
- [Web Summit, "Press conference with Gravitee CEO Rory Blundell: Collapsing confidence in agent AI security after six months of reality | Web Summit"](https://websummit.com/sessions/lis26/d3cdbf5f-8f51-48b8-9759-4a2c8dc2c441/press-conference-with-gravitee-ceo-rory-blundell-collapsing-confidence-in-agent-ai-security-after-six-months-of-reality/), read 9 November 2026

## S39: How WPP turns call transcripts into reviewed Jira plans

Connections: the summit, added 10 Nov. A design story in Mastra's account: transcripts to reviewed plans, with client isolation in the integration layer, in internal production at WPP. OVERNIGHT-10NOV, for journalist-connections. Mastra is on the featured list; WPP's participation is not confirmed. Published on 10 Nov 2026: https://promptugal.news/articles/wpp-call-transcripts-to-jira.html. Not to be written again.

Sources:

- [Mastra (vendor case study), "How WPP Built an Agent Platform to Turn Calls Into Project Plans For The World's Biggest Consumer Brands | Mastra Customers"](https://mastra.ai/customers/wpp), read 9 November 2026

## S38: Glovo's restaurant partners meet 80 AI agents on WhatsApp, GetVocal says

Connections: the summit, added 10 Nov. How a delivery platform runs restaurant-partner operations through WhatsApp agents, in GetVocal's account. OVERNIGHT-10NOV, for journalist-connections. GetVocal AI is on the featured list; Glovo's participation is not confirmed. Published on 10 Nov 2026: https://promptugal.news/articles/glovo-restaurant-agents-getvocal.html. Not to be written again.

Sources:

- [GetVocal (vendor case study), "Glovo | GetVocal"](https://www.getvocal.ai/customers/glovo), read 9 November 2026

## S37: What failed when Teamworks built an AI assistant for NFL coaches

AI and robotics, added 10 Nov. An honest build story in Mastra's account: what failed in a routing agent with seven specialists and what was changed. OVERNIGHT-10NOV, for journalist-ai. Published on 10 Nov 2026: https://promptugal.news/articles/teamworks-coaches-agent.html. Not to be written again.

Sources:

- [Mastra (vendor case study), "How Teamworks Built an AI Assistant That Saves NFL Coaches Hours on Game Prep | Mastra Customers"](https://mastra.ai/customers/teamworks), read 9 November 2026

## S36: Portugal on the programme: a masterclass, a meetup and three announcements

Portugal, added 9 Nov. What to plan around for Portugal's startup scene: Startup Portugal's masterclass, the founders-in-Portugal meetup and three press conferences, with the Portugal Stand as base. For journalist-portugal. Links S34 and S35. Published on 9 Nov 2026: https://promptugal.news/articles/portugal-on-the-programme.html. Not to be written again.

Sources:

- [Web Summit, "A guide to Portugal's startup scene [Hosted by Startup Portugal] | Web Summit"](https://websummit.com/sessions/lis26/437ebaa7-ccc4-4e89-a01f-0ae1958e7726/a-guide-to-portugal-s-startup-scene-hosted-by-startup-portugal/), read 9 November 2026
- [Web Summit, "Founders building in Portugal meetup | Web Summit"](https://websummit.com/sessions/lis26/ed1416dc-d0bd-4231-af12-dcd2c9e15c4e/founders-building-in-portugal-meetup/), read 9 November 2026
- [Web Summit, "New Unicorn in Lisbon: Discord Announces Expansion (Press conference) | Web Summit"](https://websummit.com/sessions/lis26/64ee9e86-915d-4051-9d00-6a44a9b8ac54/new-unicorn-in-lisbon-discord-announces-expansion-press-conference/), read 9 November 2026
- [Web Summit, "Press conference: Unicorn Factory Lisboa, Hub 71, Instituto Caldeira & Q Branch launch a Global Program for Scaleups | Web Summit"](https://websummit.com/sessions/lis26/2bb27ace-17f4-4f46-bec9-c32c7beb2aa1/press-conference-unicorn-factory-lisboa-hub-71-instituto-caldeira-q-branch-launch-a-global-program-for-scaleups/), read 9 November 2026
- [Web Summit, "Press conference: Road 2 Web Summit 2026 Winner | Web Summit"](https://websummit.com/sessions/lis26/66c7529f-b060-4e49-b9ba-817ae6db8f0e/press-conference-road-2-web-summit-2026-winner/), read 9 November 2026

## S35: Web Summit's press conferences, day by day: what is announced and when

The summit, added 9 Nov. The week's press conferences on Stage 2, day by day, with times, titles and speakers by role; the agenda lists 24. For journalist (summit desk). Time-sensitive: the first is Tuesday 10 November at 10:30. Published on 9 Nov 2026: https://promptugal.news/articles/press-conferences-day-by-day.html. Not to be written again.

Sources:

- [Web Summit, "Press conference: Web Summit Spotlight heads to Paraíba as part of four-year partnership | Web Summit"](https://websummit.com/sessions/lis26/43576352-a9ec-4bae-9f7a-ea7c66336cea/press-conference-web-summit-spotlight-heads-to-paraiba-as-part-of-four-year-partnership/), read 9 November 2026
- [Web Summit, "Press conference with Web Summit CEO and Founder Paddy Cosgrave | Web Summit"](https://websummit.com/sessions/lis26/dd5600f2-2e3a-4023-a127-d2e8f8521ca0/press-conference-with-web-summit-ceo-and-founder-paddy-cosgrave/), read 9 November 2026
- [Web Summit, "New Unicorn in Lisbon: Discord Announces Expansion (Press conference) | Web Summit"](https://websummit.com/sessions/lis26/64ee9e86-915d-4051-9d00-6a44a9b8ac54/new-unicorn-in-lisbon-discord-announces-expansion-press-conference/), read 9 November 2026
- [Web Summit, "Press conference: Unicorn Factory Lisboa, Hub 71, Instituto Caldeira & Q Branch launch a Global Program for Scaleups | Web Summit"](https://websummit.com/sessions/lis26/2bb27ace-17f4-4f46-bec9-c32c7beb2aa1/press-conference-unicorn-factory-lisboa-hub-71-instituto-caldeira-q-branch-launch-a-global-program-for-scaleups/), read 9 November 2026
- [Web Summit, "Press conference: Road 2 Web Summit 2026 Winner | Web Summit"](https://websummit.com/sessions/lis26/66c7529f-b060-4e49-b9ba-817ae6db8f0e/press-conference-road-2-web-summit-2026-winner/), read 9 November 2026

## S34: Where to find Portugal at Web Summit: Pavilion 1, stand E145

Portugal, added 9 Nov. The Portugal Stand is in Pavilion 1, stand E145, at the entrance, with AICEP's teams there all four days: a short practical guide for Portuguese founders, investors and visitors. For journalist-portugal. One source: AICEP's own page. Published on 9 Nov 2026: https://promptugal.news/articles/where-to-find-portugal.html. Not to be written again.

Sources:

- [AICEP Portugal Global, "AICEP na Web Summit 2026 | Portugal liga-se ao mundo"](https://www.portugalglobal.pt/pt/noticias/2026/novembro/aicep-na-web-summit-2026-portugal-liga-se-ao-mundo/), read 9 November 2026

## S33: Sports tech at Web Summit: IBM's startup challenge ends in Lisbon

The summit, added 9 Nov. IBM's year-long challenge for startups building AI-powered products for sports ends in Lisbon: a showcase on 10 November and an invitation-only prize challenge on 11 November. For the summit desk (journalist). Time-sensitive: the showcase is on 10 November. Published on 9 Nov 2026: https://promptugal.news/articles/ibm-sports-tech-challenge.html. Not to be written again.

Sources:

- [IBM Newsroom (IBM blog), "IBM Sports Tech Startup Challenge culminates at Web Summit Lisbon 2026"](https://newsroom.ibm.com/blog-ibm-sports-tech-startup-challenge-culminates-at-web-summit-lisbon-2026), read 9 November 2026

## S32: Rehab beyond the clinic: three Portuguese startups at Web Summit

Connections: Portugal, added 9 Nov. Braining, UpSpeech and Twin Factory: different technology on the same problem, helping people recover outside the clinic. Not ready: each company is known only from one article's one-line description; waits for the companies' own pages.

Sources:

- [Portugal Startup News, "Full list of 78 startups selected by Startup Portugal for Road 2 Web Summit 2026"](https://portugalstartupnews.com/2026/11/08/full-list-of-78-startups-selected-by-startup-portugal-for-road-2-web-summit-2026/), read 9 November 2026

## S31: Beyond Lisbon: where Road 2 Web Summit's 78 startups come from

Portugal, added 9 Nov. Lisbon has 41 of the 78 startups selected for Road 2 Web Summit; a tour of the other 37, from Porto and Braga to the Azores and Madeira, and what they build. For journalist-portugal. Published on 9 Nov 2026: https://promptugal.news/articles/road-2-web-summit-beyond-lisbon.html. Not to be written again.

Sources:

- [Portugal Startup News, "Full list of 78 startups selected by Startup Portugal for Road 2 Web Summit 2026"](https://portugalstartupnews.com/2026/11/08/full-list-of-78-startups-selected-by-startup-portugal-for-road-2-web-summit-2026/), read 9 November 2026

## S30: Eleven health startups at Web Summit, by the problem they tackle

Connections: the summit, added 8 Nov. The health and wellness startups on Web Summit's featured list, grouped by the problem each says it tackles, from a first look at the list. For journalist-connections. From the first page of 26 only. Published on 8 Nov 2026: https://promptugal.news/articles/health-startups-by-problem.html. Not to be written again.

Sources:

- [Web Summit, "Featured startups at Web Summit | November 9-12, 2026"](https://websummit.com/featured-startups/), read 8 November 2026

## S29: Who builds the parts of an AI agent? Startups at Web Summit

AI and robotics, added 8 Nov. A reader's guide to the AI-agent stack as eight startups on the featured list describe themselves, from frameworks and databases to governance and the products on top. For journalist-ai (AI desk). From the first page of 26 only. Published on 8 Nov 2026: https://promptugal.news/articles/who-builds-the-parts-of-an-ai-agent.html. Not to be written again.

Sources:

- [Web Summit, "Featured startups at Web Summit | November 9-12, 2026"](https://websummit.com/featured-startups/), read 8 November 2026

## S28: Five AI builders on Web Summit's speaker list worth knowing

Connections: the summit, added 8 Nov. A theme-led guide to five AI builders on the speakers page: who they are by role and why a founder in the field might want to hear them. Theme-led (standing answers 19 and 20), for journalist-connections; different from S12, S15 and S16. Published on 8 Nov 2026: https://promptugal.news/articles/five-ai-builders-to-know.html. Not to be written again.

Sources:

- [Web Summit, "Meet Web Summit's 2026 speakers | Web Summit | November 9-12, 2026"](https://websummit.com/speakers/), read 8 November 2026

## S27: A map of Web Summit's buildings, and what each holds

AI and robotics, added 7 Nov. A new page draws the summit's buildings in Parque das Nações from OpenStreetMap and counts the programme's sessions in each; no people on it. A team topic (a site change).

Sources:

- [PrompTugal.news, "The venue map"](https://promptugal.news/summit/venue/index.html), read 7 November 2026

## S26: Two editions a day: PrompTugal.news starts a daily newsletter

AI and robotics, added 7 Nov. A morning edition (what is on today) and an evening edition (what happened and what is next), each a page and a short plain-text email with links. A team topic (a site change).

Sources:

- [PrompTugal.news, "The daily newsletter"](https://promptugal.news/newsletter/index.html), read 7 November 2026

## S25: The sign-in: how editors and agents prove who they are

AI and robotics, added 7 Nov. How PrompTugal.news lets its editors and agents sign in with a key handed over as a QR code, and the limits it states itself: readers need no account. A team topic (Vicky: our team's work is a standing topic), not in the five-part series.

Sources:

- [PrompTugal.news newsroom notes, "The sign-in: a key in a QR code, and what it is for"](https://promptugal.news/newsroom/notes/2026-11-06-the-sign-in/index.html), read 7 November 2026

## S24: Driving to Web Summit? Road closures and drop-off points

The summit, added 6 Nov. Which roads near the venue close from 8 to 12 November, where to be dropped off, and Carris's temporary terminal.

Sources:

- [Junta de Freguesia do Parque das Nações, "Web Summit – Condicionamentos de trânsito entre 9 e 12 de novembro"](https://www.jf-parquedasnacoes.pt/autarquia/noticias/web-summit-condicionamentos-de-transito-entre-9-e-12-de-novembro), read 6 November 2026
- [Executive Digest (SAPO), "Web Summit: Carris reforça transporte com 'shuttle' e passe conjunto com metro e comboios"](https://executivedigest.sapo.pt/web-summit-carris-reforca-transporte-com-shuttle-e-passe-conjunto-com-metro-e-comboios/), read 5 November 2026

## S22: From pineapple waste to fish feed: AgroGrINTech's pilot in Maia

Portugal, added 6 Nov. A Portuguese startup makes a fish feed ingredient from pineapple by-products.

Sources:

- [AICEP Portugal Global, "AgroGrINTech turns pineapple waste into aquafeed ingredient"](https://www.portugalglobal.pt/en/news/2026/novembro/agrogrintech-turns-pineapple-waste-into-aquafeed-ingredient/), read 6 November 2026

## S20: Lisbon's Octo Health launches health tracking in Portugal and the US

Portugal, added 6 Nov. A young Lisbon healthtech goes live in two countries, with testing for over 110 biomarkers.

Sources:

- [Portugal Startup News, "Octo Health launches personalized health tracking platform in Portugal and U.S. after earlier €2.7M raise"](https://portugalstartupnews.com/2026/11/05/octo-health-launches-personalized-health-tracking-platform-in-portugal-and-u-s-after-earlier-e2-7m-raise/), read 6 November 2026

## S19: Brazil comes to Lisbon as Intuitivo heads to Brazil

Connections: announcements, added 5 Nov. About 200 Brazilian companies arrive as a Porto startup expands into Brazil: Lisbon as a bridge both ways.

Sources:

- [Executive Digest (SAPO), "Web Summit: Cerca de 200 empresas brasileiras em Lisboa para captar investimento"](https://executivedigest.sapo.pt/web-summit-cerca-de-200-empresas-brasileiras-em-lisboa-para-captar-investimento/), read 4 November 2026
- [Portugal Startup News, "Intuitivo raises 1.35M euros to expand into Brazil (Portugal Startup News, 23 October 2026)"](https://portugalstartupnews.com/2026/10/23/intuitivo-raises-e1-35m-to-expand-into-brazil-with-a-platform-that-cuts-teachers-workload/), read 4 November 2026

## S18: Tuesday 10 November: Europe on Centre Stage, universities pitching, first-timers meeting

Connections: the summit, added 5 Nov. One day, three ways in, with a note that two of them overlap.

Sources:

- [European Commission (Shaping Europe's digital future), "DigitalEU at Web Summit 2026: supporting businesses and startups to grow and innovate (updated 3 November 2026)"](https://digital-strategy.ec.europa.eu/en/news/digitaleu-web-summit-2026-supporting-businesses-and-startups-grow-and-innovate), read 4 November 2026
- [Web Summit, "Schedule | Web Summit"](https://websummit.com/schedule/), read 4 November 2026
- [Universidade de Lisboa (ULisboa), "ULisboa's Innovation and Entrepreneurship Ecosystem at Web Summit 2026"](https://www.ulisboa.pt/en/noticia/ulisboas-innovation-and-entrepreneurship-ecosystem-web-summit-2026), read 5 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S17: 11 November for startups going abroad: three events to know

Connections: Europe, added 5 Nov. EU funding, the Dutch delegation and an Italy and Portugal event on scaling, for Portuguese startups growing into Europe.

Sources:

- [European Health and Digital Executive Agency (HaDEA), "Web Summit 2026 | HaDEA"](https://hadea.ec.europa.eu/events/web-summit-2026-2026-11-09_en), read 4 November 2026
- [Netherlands Enterprise Agency (RVO), "Web Summit 2026 in Lisbon: Join the Dutch Delegation (RVO)"](https://english.rvo.nl/events/web-summit-2026-lisbon), read 4 November 2026
- [AICEP Portugal Global, "Lisbon event explores Italian-Portuguese tech growth"](https://www.portugalglobal.pt/en/news/2026/novembro/lisbon-event-explores-italian-portuguese-tech-growth/), read 5 November 2026
- [Portugal Startup News, "Granter secures 1.6M euros to expand its AI grant platform (Portugal Startup News, 3 November 2026)"](https://portugalstartupnews.com/2026/11/03/granter-secures-e1-6m-to-expand-its-ai-grant-platform-into-spain-germany-and-italy/), read 4 November 2026
- [Portugal Startup News, "Seamoretech raises 1.1M euros (Portugal Startup News, 2 November 2026)"](https://portugalstartupnews.com/2026/11/02/seamoretech-raises-e1-1m-to-recover-freshwater-and-minerals-from-desalination-waste-plans-spain-launch/), read 4 November 2026

## S16: Europe's AI and funding help, a walk from Portugal's AI startups

Connections: Europe, added 5 Nov. The Commission's AI, data and supercomputer help in Pavilion 4, and the Portuguese AI startups it is made for.

Sources:

- [European Commission (Shaping Europe's digital future), "DigitalEU at Web Summit 2026: supporting businesses and startups to grow and innovate (updated 3 November 2026)"](https://digital-strategy.ec.europa.eu/en/news/digitaleu-web-summit-2026-supporting-businesses-and-startups-grow-and-innovate), read 4 November 2026
- [European Health and Digital Executive Agency (HaDEA), "Web Summit 2026 | HaDEA"](https://hadea.ec.europa.eu/events/web-summit-2026-2026-11-09_en), read 4 November 2026
- [Portugal Startup News, "Granter secures 1.6M euros to expand its AI grant platform (Portugal Startup News, 3 November 2026)"](https://portugalstartupnews.com/2026/11/03/granter-secures-e1-6m-to-expand-its-ai-grant-platform-into-spain-germany-and-italy/), read 4 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S15: From Técnico's stand to the lineup: following robotics at Web Summit

Connections: the summit, added 5 Nov. Robotics on stage and on the floor, linked for anyone following the field. Builds on S12.

Sources:

- [Web Summit, "Meet Web Summit's 2026 speakers | Web Summit | November 9-12, 2026"](https://websummit.com/speakers/), read 5 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S13: Web Summit's ten Lisbon years: 2.5 billion euros, says EY

Portugal, added 5 Nov. What ten editions have meant for Portugal's economy and its startups, in EY's figures as reported.

Sources:

- [Executive Digest (SAPO), "Web Summit: Evento gera 2,5 mil M€ para a economia portuguesa em 10 anos"](https://executivedigest.sapo.pt/web-summit-evento-gera-25-mil-me-para-a-economia-portuguesa-em-10-anos/), read 5 November 2026

## S12: A robot among 800 speakers: Web Summit 2026 turns to robotics

The summit, added 5 Nov. 800 speakers, a lineup led by robotics and AI companies, and a robot listed as a speaker.

Sources:

- [Web Summit, "Meet Web Summit's 2026 speakers | Web Summit | November 9-12, 2026"](https://websummit.com/speakers/), read 5 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S11: Italy and Portugal meet in Beato on how European tech scales

Europe, added 5 Nov. Italian and Portuguese founders and investors talk about growing beyond home markets, on 11 November.

Sources:

- [AICEP Portugal Global, "Lisbon event explores Italian-Portuguese tech growth"](https://www.portugalglobal.pt/en/news/2026/novembro/lisbon-event-explores-italian-portuguese-tech-growth/), read 5 November 2026

## S10: Lisbon's universities at Web Summit: two stands and a pitch day

Portugal, added 5 Nov. ULisboa and Técnico show robots, spin-offs and projects, and nine universities pitch on 10 November. Takes in S8 (Técnico on its own), which is listed here and not again.

Sources:

- [Universidade de Lisboa (ULisboa), "ULisboa's Innovation and Entrepreneurship Ecosystem at Web Summit 2026"](https://www.ulisboa.pt/en/noticia/ulisboas-innovation-and-entrepreneurship-ecosystem-web-summit-2026), read 5 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S9: About 200 Brazilian companies come to Lisbon for Web Summit

Announcements, added 4 Nov. Brazil brings some 200 companies and a pavilion in the MEO Arena to meet investors.

Sources:

- [Executive Digest (SAPO), "Web Summit: Cerca de 200 empresas brasileiras em Lisboa para captar investimento"](https://executivedigest.sapo.pt/web-summit-cerca-de-200-empresas-brasileiras-em-lisboa-para-captar-investimento/), read 4 November 2026

## S7: The Portugal banner: awards, funding and the Algarve's plan

Portugal, added 4 Nov. Short items for the Portugal banner: Unicorn Factory Lisboa's awards, new funding rounds, the Algarve's startup plan.

Sources:

- [Portugal Startup News, "Winners announced for 2026 Entrepreneurship Awards by Unicorn Factory Lisboa (Portugal Startup News)"](https://portugalstartupnews.com/2026/10/27/winners-announced-for-2026-entrepreneurship-awards-by-unicorn-factory-lisboa/), read 4 November 2026
- [Portugal Startup News, "Algarve Evolution aims to support 500 companies (Portugal Startup News, 1 November 2026)"](https://portugalstartupnews.com/2026/11/01/algarve-evolution-aims-to-support-500-companies-and-help-create-150-startups-by-2032-in-push-beyond-tourism/), read 4 November 2026
- [Portugal Startup News, "Granter secures 1.6M euros to expand its AI grant platform (Portugal Startup News, 3 November 2026)"](https://portugalstartupnews.com/2026/11/03/granter-secures-e1-6m-to-expand-its-ai-grant-platform-into-spain-germany-and-italy/), read 4 November 2026
- [Portugal Startup News, "Seamoretech raises 1.1M euros (Portugal Startup News, 2 November 2026)"](https://portugalstartupnews.com/2026/11/02/seamoretech-raises-e1-1m-to-recover-freshwater-and-minerals-from-desalination-waste-plans-spain-launch/), read 4 November 2026
- [Portugal Startup News, "Intuitivo raises 1.35M euros to expand into Brazil (Portugal Startup News, 23 October 2026)"](https://portugalstartupnews.com/2026/10/23/intuitivo-raises-e1-35m-to-expand-into-brazil-with-a-platform-that-cuts-teachers-workload/), read 4 November 2026
- [Instituto Superior Técnico, Universidade de Lisboa, "Técnico leva demonstrações tecnológicas e spin-offs à Web Summit 2026"](https://tecnico.ulisboa.pt/pt/noticias/campus-e-comunidade/tecnico-leva-demonstracoes-tecnologicas-e-spin-offs-a-web-summit-2026/), read 4 November 2026

## S6: Gender in Tech report: 84% see women in leadership

Announcements, added 4 Nov. Web Summit's report finds most people now see women in leadership at work, and is honest about what still needs to change.

Sources:

- [Web Summit, "Women are leading in tech. So why are so many considering leaving? (Web Summit blog)"](https://websummit.com/blog/news/women-are-leading-in-tech-so-why-are-so-many-considering-leaving/), read 4 November 2026

## S5: Web Summit 2026 in numbers: 70,000 people, 10,000 startups

Announcements, added 4 Nov. The size of the week in Web Summit's own figures, and what its survey found about AI at work. Updated 4 and 5 Nov (twice).

Sources:

- [Web Summit, "Web Summit's first state of the industry survey finds tech torn on AI"](https://websummit.com/blog/news/web-summits-first-state-of-the-industry-survey-finds-tech-torn-on-ai/), read 4 November 2026
- [Web Summit, "Tracks | Web Summit"](https://websummit.com/tracks/), read 4 November 2026
- [Web Summit, "How we select our startups | Web Summit"](https://websummit.com/blog/startups-investors/how-we-select-our-startups/), read 4 November 2026
- [Executive Digest (SAPO), "Web Summit: Cerca de 200 empresas brasileiras em Lisboa para captar investimento"](https://executivedigest.sapo.pt/web-summit-cerca-de-200-empresas-brasileiras-em-lisboa-para-captar-investimento/), read 4 November 2026
- [Web Summit, "Meet Web Summit's 2026 speakers | Web Summit | November 9-12, 2026"](https://websummit.com/speakers/), read 5 November 2026
- [Executive Digest (SAPO), "Web Summit: Evento gera 2,5 mil M€ para a economia portuguesa em 10 anos"](https://executivedigest.sapo.pt/web-summit-evento-gera-25-mil-me-para-a-economia-portuguesa-em-10-anos/), read 5 November 2026

## S4: From the PITCH stage to new markets: Portuguese startups raising

Portugal, added 4 Nov. Past PITCH winners and a Porto startup raise money to grow abroad.

Sources:

- [Portugal Startup News, "Granter secures 1.6M euros to expand its AI grant platform (Portugal Startup News, 3 November 2026)"](https://portugalstartupnews.com/2026/11/03/granter-secures-e1-6m-to-expand-its-ai-grant-platform-into-spain-germany-and-italy/), read 4 November 2026
- [Portugal Startup News, "Intuitivo raises 1.35M euros to expand into Brazil (Portugal Startup News, 23 October 2026)"](https://portugalstartupnews.com/2026/10/23/intuitivo-raises-e1-35m-to-expand-into-brazil-with-a-platform-that-cuts-teachers-workload/), read 4 November 2026
- [Portugal Startup News, "Seamoretech raises 1.1M euros (Portugal Startup News, 2 November 2026)"](https://portugalstartupnews.com/2026/11/02/seamoretech-raises-e1-1m-to-recover-freshwater-and-minerals-from-desalination-waste-plans-spain-launch/), read 4 November 2026

## S3: Road 2 Web Summit: Portugal's startups head for Lisbon

Portugal, added 4 Nov. Eleven years of a programme that brings up to 125 Portuguese startups to the summit.

Sources:

- [Tek Notícias (SAPO), "Road 2 Web Summit 2026 já aceita candidaturas de startups portuguesas (Tek Notícias, 14 August 2026)"](https://tek.sapo.pt/extras/site-do-dia/artigos/road-2-web-summit-2026-ja-aceita-candidaturas-de-startups-portuguesas-para-mais-uma-edicao/), read 4 November 2026
- [Startup Portugal, "Road 2 Web Summit | Startup Portugal"](https://startupportugal.com/pt/programs/road-2-web-summit-pt/), read 4 November 2026

## S2: Europe arrives in Pavilion 4: the Commission's week at Web Summit

Europe, added 4 Nov. The European Commission comes to help builders, with talks, masterclasses and funding sessions.

Sources:

- [European Commission (Shaping Europe's digital future), "DigitalEU at Web Summit 2026: supporting businesses and startups to grow and innovate (updated 3 November 2026)"](https://digital-strategy.ec.europa.eu/en/news/digitaleu-web-summit-2026-supporting-businesses-and-startups-grow-and-innovate), read 4 November 2026
- [European Health and Digital Executive Agency (HaDEA), "Web Summit 2026 | HaDEA"](https://hadea.ec.europa.eu/events/web-summit-2026-2026-11-09_en), read 4 November 2026
- [Netherlands Enterprise Agency (RVO), "Web Summit 2026 in Lisbon: Join the Dutch Delegation (RVO)"](https://english.rvo.nl/events/web-summit-2026-lisbon), read 4 November 2026

## S1: Web Summit Lisbon: your first day, from airport to arena

The summit, added 4 Nov. A practical guide: where to collect your wristband, how to get there, what to bring. Updated 4, 5 and 6 Nov with the transport pass, the Carris shuttle and the drop-off points.

Sources:

- [Web Summit, "Venue | Essentials | Web Summit"](https://websummit.com/essentials/venue/), read 4 November 2026
- [Web Summit, "Registration: how, when and where | Web Summit"](https://websummit.com/essentials/registration/), read 4 November 2026
- [Web Summit, "The city: getting around Lisbon | Web Summit"](https://websummit.com/essentials/the-city/), read 4 November 2026
- [Web Summit, "Mobile app | Essentials | Web Summit"](https://websummit.com/essentials/app/), read 4 November 2026
- [Web Summit, "Schedule | Web Summit"](https://websummit.com/schedule/), read 4 November 2026
- [Metropolitano de Lisboa, "Passe de transporte para o Web Summit"](https://www.metrolisboa.pt/2026/11/02/passe-de-transporte-para-web-summit/), read 4 November 2026
- [Executive Digest (SAPO), "Web Summit 2026: Metro de Lisboa prepara reforço de comboios e vigilância para receber 75 mil participantes"](https://executivedigest.sapo.pt/web-summit-2026-metro-de-lisboa-prepara-reforco-de-comboios-e-vigilancia-para-receber-75-mil-participantes/), read 4 November 2026
- [Executive Digest (SAPO), "Web Summit: Carris reforça transporte com 'shuttle' e passe conjunto com metro e comboios"](https://executivedigest.sapo.pt/web-summit-carris-reforca-transporte-com-shuttle-e-passe-conjunto-com-metro-e-comboios/), read 5 November 2026
- [Junta de Freguesia do Parque das Nações, "Web Summit – Condicionamentos de trânsito entre 9 e 12 de novembro"](https://www.jf-parquedasnacoes.pt/autarquia/noticias/web-summit-condicionamentos-de-transito-entre-9-e-12-de-novembro), read 6 November 2026

## Assignments by desk: order and readiness

For the five journalists, in priority order (standing answers 20 and 22, the desk review of 8 November). Each was checked against the articles and drafts at this run.

Ready to write now:

1. S59, Discord is opening its first engineering hub outside San Francisco, in Lisbon: for the Portugal desk (journalist-portugal). Discord says, in its own recruiting text, that it is opening its first engineering hub outside San Francisco in Lisbon; re-read the posting yourself, read the press report (Diario de Noticias, 11 Nov) at its source, give no size, timing or job numbers, and do not cite Web Summit pages; short and plain; categories Portugal and Corporate.

Already published, not to be written again: S58 (https://promptugal.news/articles/thursday-last-day-guide.html); S37 (https://promptugal.news/articles/teamworks-coaches-agent.html); S38 (https://promptugal.news/articles/glovo-restaurant-agents-getvocal.html); S39 (https://promptugal.news/articles/wpp-call-transcripts-to-jira.html); S40 (https://promptugal.news/articles/gravitee-agent-security-survey.html); S42 (https://promptugal.news/articles/what-lovable-deleted.html); S49 (https://promptugal.news/articles/europe-in-pavilion-4.html); S56 (https://promptugal.news/articles/digital-fairness-act-ai-agents.html); S53 (https://promptugal.news/articles/eu-election-guidelines-generative-ai.html); S55 (https://promptugal.news/articles/tiktok-for-you-dsa-preliminary-finding.html); S52 (https://promptugal.news/articles/konecta-lisbon-delivery-centre.html); S54 (https://promptugal.news/articles/breakout-startups-thursday-centre-stage.html); S46 (https://promptugal.news/articles/zalando-ai-coding-agents.html); S48 (https://promptugal.news/articles/manus-2-0-agents-own-email-phone-wallet.html); S50 (https://promptugal.news/articles/ai-act-first-harmonised-standard.html); S51 (https://promptugal.news/articles/getting-around-lisbon-wednesday.html); S45 (https://promptugal.news/articles/web-summit-day-2-refunds.html); S41 (https://promptugal.news/articles/red-wind-warning-lisbon-wednesday.html); S28 (https://promptugal.news/articles/five-ai-builders-to-know.html); S29 (https://promptugal.news/articles/who-builds-the-parts-of-an-ai-agent.html); S30 (https://promptugal.news/articles/health-startups-by-problem.html); S31 (https://promptugal.news/articles/road-2-web-summit-beyond-lisbon.html); S33 (https://promptugal.news/articles/ibm-sports-tech-challenge.html); S34 (https://promptugal.news/articles/where-to-find-portugal.html); S35 (https://promptugal.news/articles/press-conferences-day-by-day.html); S36 (https://promptugal.news/articles/portugal-on-the-programme.html).

Already drafted, not to be written again: S44 (drafted, awaiting review); S47 (published as an update).

No assignment this run: the summit, Europe, AI and connections desks (PagerDuty's production-agents post is held for the rest of the post and a second source). Reasons and the evidence wanted from the researcher are in the latest map.

Held until the researcher captures more: S32 (rehab beyond the clinic) until the three companies' own pages are captured; a Portuguese angle on AI trust and risk until the Humanos country question is settled; fintech startups on the featured list; and the speakers' policy and investment, mobility and devices, and infrastructure and security groups.

## Dropped

Taken off the list on 6 November 2026, at Vicky's word, as duplicates of other candidates:

- S23: Waste into value: AgroGrINTech and Seamoretech, two circular Portuguese startups (duplicates)
- S21: One backer, two fields: 3xP Global's Granter and Octo Health (duplicates)
- S14: Granter and Intuitivo: two PITCH winners, one backer, new markets (duplicates)
