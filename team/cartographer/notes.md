# Cartographer notes

Written by cartographer@web-summit, a sub-agent in the conductor's wake. Status: third pass, proposed.

## Wake of 2026-11-01T06:28Z: sessions ws26-s41..s80 and side events se19..se29

- HEAD `data/events.json` now has 80 sessions and 29 side events; all are nodes in `data/graph.json`. Companies stay the 88 at HEAD; the ones the researcher is adding now wait for the next wake.
- New links (10, each sourced to the session or event URL): ManageEngine hosts ws26-s49; Replit speaks at ws26-s51; LaunchDarkly speaks at ws26-s52 and ws26-s62; Twilio hosts ws26-s54; Datadog hosts ws26-s65; Cisco Systems (cisco-outshift) hosts ws26-s66 and side event se23 (Cisco showcase, PTW Palace); Trent AI speaks at ws26-s73; European Commission (DG Connect) hosts ws26-s75.
- Speaker organisations in the new sessions not on the company map (candidates for the researcher, not linked): EasyDMARC, iBanFirst, Topsec, Whitespace, Exein, NordVPN, Nisos, Conscium, Scrut Automation, The Hacking Games, Proton, Vivaldi, Serpro, Lenovo, Mindstone, Make, Deque Systems, Exa, Legora, PolyAI, Cognizant, SGF Global, MEO, Defined.ai, Prisma, Eclipse Foundation (Open VSX), The Elders, Council of Europe, European Parliament, SkyDeck Ventures, Stanford HAI, AustriaCard, SENEN GROUP, Inflect. Side-event hosts not on the map: Sanity and Bejamas (se25), Softr (se28), Cybertech Acceleration (se22). Speaker names are not copied into the graph.
- Totals: 5 products, 80 sessions, 29 side events, 175 links (speaks-at 38, hosts 14, could-partner 23, relevant-to 83, competes-with 8, could-buy 9), 88 proposals, 8 clusters, 12 first meetings.
- First meetings (all proposed): Replit in (meet, priority 1, its own talk ws26-s51, 10 Nov 16:00); Elastic out (its decision is not meet; it keeps its proposal and links). Every place now has a start and end time and a stage.

### Clashes (all times 12 Nov unless said; Lisbon, WET)

1. Feedzai ws26-s32 (12:00-12:20, Stage 7) and the cybersecurity meetup ws26-s39 (12:00-12:25, Meetup 1; our guess for Hexamind and 1Password). Still open: one person cannot do both. Proposed: Feedzai at its talk (sourced); Hexamind and 1Password at their stands first, the meetup only if a second person goes. Deque ws26-s55 (12:00) is in the same slot but not on our list.
2. Cisco ws26-s33 (12:10-12:30) overlapped clash 1. Resolved: Cisco now leads with side event se23 (11 Nov 17:30-18:30); its masterclass ws26-s66 (13:00-13:45) is a fallback but overlaps ws26-s40.
3. Delinea ws26-s37 (15:15-15:35, Stage 8) overlaps Airia ws26-s38 (15:25-15:36, Stage 9). Resolved: Delinea leads with ws26-s06 (10 Nov 12:30-13:15).
4. 10 Nov: Startup Portugal ws26-s07 (12:00-12:45) overlaps Delinea ws26-s06 (12:30) and the Lisbon founders meetup ws26-s78 (12:00-12:55). Resolved: Startup Portugal leads with ws26-s40 (12 Nov 13:30-13:55).
5. After these changes the leading places do not overlap except clash 1. 12 Nov runs Emergence 10:15, Primitive 10:50, Feedzai 12:00, Startup Portugal 13:30, Descope 14:00, Airia 15:25.

## Wake of 2026-11-01T04:28Z: the 29 new companies

- HEAD `data/companies.json` now has 88 companies; the graph covered 59. Added the 29 new ones (all session speakers' companies): Descope, Persona, Airia, AISLE, Emergence, Trent AI, LaunchDarkly, JetBrains, Sumsub, Feedzai, Proofpoint, Linux Foundation (AAIF), ROOST, NCSC (UK), TestMu AI, SageOx, Neo4j, Directus, RWS Group, LawVu, Factorial, TrustScale, Qualcomm, AICEP, Ledger, Eversec, Data Protection Commission, C4AIL, Crystal Intelligence.
- Each has a session link sourced to the session URL in `data/events.json` (30 links: 28 speaks-at, 2 hosts: Descope ws26-s36, AICEP ws26-s24; Persona has two), product links marked our judgement (50), a proposal echoing the researcher's decision, and a cluster. No new cluster was needed: Airia and Feedzai are in two clusters.
- The script now reads `data/events.json` at HEAD (`git show`), so sessions the curator adds in the working tree wait for the next wake. It also refuses more than 12 first meetings, or a first meeting naming an unknown company, session or side event.
- Totals: 5 products, 40 sessions, 18 side events, 165 links (speaks-at 34, hosts 8, could-partner 23, relevant-to 83, competes-with 8, could-buy 9), 88 proposals, 8 clusters, 12 first meetings.
- First meetings revised (all proposed): in Descope (ws26-s36), Airia (ws26-s38), Emergence (ws26-s26), Feedzai (ws26-s32), Linux Foundation AAIF (ws26-s16): each has a session of its own and sits on agent identity, governance or standards. Out: Cloudflare (Centre Stage CEO, hard to meet, weaker fit), CrowdStrike (its decision is write-about), Mastra, Polygraf AI and KPMG Portugal (no session in our feed, places were guesses). They keep their own proposals. Times added to every place.
- Clash: Feedzai ws26-s32 (12 Nov 12:00) is in the same slot as the cybersecurity meetup ws26-s39 (Hexamind and 1Password places); Cisco ws26-s33 is at 12:10.
- Speaker names appear only in `data/companies.json` and `data/events.json`; the graph names companies, not people.

## First wake (2026-11-01T02:28Z)

## How data/graph.json was built (1 Nov 2026)

- Generated by `team/cartographer/build_graph.mjs` (run with `node team/cartographer/build_graph.mjs` from anywhere; it writes `data/graph.json`). The mappings (links, clusters, first meetings) are written in the script by hand; the script checks that every company id exists in `git show HEAD:data/companies.json`, that every company has at least one link and one cluster, and that every session and side event id exists in `data/events.json`.
- Companies: only the 59 in the committed `data/companies.json` (HEAD). Companies the researcher adds after that commit are not linked yet.
- Sessions and side events: all 40 sessions and 18 side events from `data/events.json` are nodes.
- Company to session: only where a speaker's `org` in `data/events.json` is the company (Cloudflare s01, European Commission s02, CrowdStrike s25, Primitive s29, Cisco Systems s33, Delinea s37), or the session title says "Hosted by" the company (Elastic s05, Delinea s06, Startup Portugal s07). Source: the session URL.
- Company to side event: hosts named in `data/events.json` (IBM se10, Elastic se14, Shakers se06). Source: the event URL.
- Company to product: our judgement, said so in every `why` and `source`. Products are only the five that exist: SGit, The Cyber Boardroom (no website URL in our sources, so `url` is null), RiskMandate Agent Behaviour Policies, SHarness, the SGit newsroom.
- Proposals: one per company, echoing the researcher's decision and priority from `data/companies.json`; all `status: proposed`.
- Clusters: 8 themes; every company is in at least one (Chatplace and KPMG are in two).
- First meetings: 12, all `proposed`. Where a company has no session in our feed, the place says "stand not yet read" or names the official cybersecurity or Portugal founders meetup as the likely place.

## Not confirmed

- No stand locations or startup exhibition days were read; places for Hexamind, Polygraf AI, 1Password, Mastra and KPMG are guesses at where they could be met.
- Speaker companies in `data/companies.json` (Replit, Temporal, Manus AI, You.com, Atlassian, a16z, Neo) have no session in our 40-session feed yet, so they link to products only.
- Session speakers' organisations not on the company map (e.g. Persona, Sumsub, Feedzai, Descope, Airia AI, JetBrains, LaunchDarkly, Neo4j, Emergence, Aisle, TestMu AI, Trent AI, SageOx, Linux Foundation, AICEP) are candidates for the researcher to add; they are not linked because they are not companies on the map.

## Next wake

1. Done this wake: the 29 new companies are linked, and the session-speaker organisations listed above are now on the map (JetBrains, LaunchDarkly, Neo4j, Emergence, Aisle, TestMu AI, Trent AI, SageOx, Linux Foundation, AICEP, Persona, Sumsub, Feedzai, Descope, Airia).
2. Done this wake for ws26-s41..s80: Replit got its talk (ws26-s51). Temporal, Manus AI, You.com, Atlassian, a16z and Neo still have none in our 80-session feed. Link the companies the researcher is adding now once they are at HEAD (many are speaker orgs listed in the 06:28Z section).
3. When the curator reads more sessions, match speakers' organisations again, and give each speaker company with no session its talk.
4. Read stand and exhibition-day data, then replace the "not yet read" places in first_meetings.
5. Owners: once owners are named, record who took which proposal; keep decisions as proposals until then.
