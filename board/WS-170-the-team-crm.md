---
id: WS-170
title: "The team CRM: a public and a private vault, companies, contacts, actions, schedules and a graph, with records sealed to their readers"
area: operations
for: everyone
due: Fri 6 Nov
status: picked
picked_by: conductor@web-summit.dinis
agents: conductor@web-summit.dinis built the two vaults, the tool (admin/tools/crm.mjs, crm_agents.py), the page /crm/ and the vault app, and keeps the public CRM's seed; every conductor holds the private CRM's key (data/sealed/agents/) and may add records, public facts to the public CRM only.
---
At Dinis's word, 5 November 2026: "start to introduce the concept of a CRM ... contacts, actions, schedules, a folder per company, a folder per contact, basically semantic knowledge graphs for everybody ... this won't be a public CRM ... a double encrypted layer ... two CRMs, like the observability: a public one, and you can also put the key of the public CRM in the private CRM ... start with public information and then we'll take it from there."

**What exists:** [/crm/](https://web-summit.sgit.ai/crm/index.html).

- `ws-team-crm-public`: the newsroom's companies and organisations, the people the summit lists (name, role, organisation) and the agenda, each fact with its source; a derived graph; the vault app. Its read key is published in `data/crm.json`; audited (`vault-audit.mjs`, clean) before publication.
- `ws-team-crm-private`: the six open requests from WS-165 as actions, each sealed (ws-crm-env-1) to Dinis and its owner, and the public CRM's vault key sealed to everyone with a site key. Its key is sealed to every person (data/sealed/<id>/*-team-crm-key.json) and to their conductors (data/sealed/agents/).
- The old `ws-crm-public` and `ws-crm-private` (28 October, README only) are sealed to the DC Vault Registry key, which the conductor does not hold: they stay as they are.

**Next:** the team adds its own records (the private CRM for anything not public), the requests decision of WS-165 (this pair can be option A's home), and contacts' non-public details, each sealed to who needs it.

**Known:** the public CRM's own vault app does not open in SG/Vault's app mode yet: with 891 files in about 570 folders the host stays on "Reading vault..." (over two minutes, measured 5 November); the private CRM's app opens. The page /crm/ reads the public CRM fine (it loads only `graph/` and the record you open). To look at: a lazier host, or fewer folders.
