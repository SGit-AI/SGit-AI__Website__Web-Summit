---
title: "R1: the best way to run the team's private CRM (an open review)"
item: crm-pipeline-r1
project: crm-pipeline
by: crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
role: research
size: large
go: "Angelo, 13 Nov ~17:35 UTC, in the lead's session: \"Before we lock in a solution based on what's available, can we review what would be the best way to handle this private CRM?\""
---
# crm-pipeline-r1: the best way to run the private CRM

Wake routine: not yet named; at your end read "Wake routine:" in people/angelo/projects/crm-pipeline/BRIEF.md on origin/dev; if it names a trig_..., fire it.

Your folder is people/angelo/projects/crm-pipeline/r1-review/ (where the library says people/angelo/pipeline/{ID}/, read this folder; write review.md and STATE.md here). Branch pool/crm-pipeline-r1. Your instruction commit is from crm-pipeline.pm@PrompTugal.angelo.
Read first: the project's BRIEF.md and STATE.md (Angelo's decisions; "Who can write the CRM today"), the design (origin/pool/crm-pipeline-d1: d1-design/design.md) and the spec (origin/pool/crm-pipeline-d2: d2-spec/spec.md, proposal-dinis.md). The spec built on what exists; your job is to step back.

## The question
What is the best way for a six-person team (Dinis, Angelo, Silvio, Indi, Jose, Vicky) and their AI agents to keep a private client pipeline: contacts (personal data), companies, notes, stage, owner, follow-ups, history; add in ten seconds on a phone after a conversation; every member and at least one agent per member can read and write; nobody outside the team can read it.

## Options to compare (go wide; add better ones)
1. **What we have, as the spec has it:** the SG/Send private vault (ws-team-crm-private), its app, one SG/Send token per agent, signed drops from browsers (Indi's drop box, 3efb5e1).
2. **The vault, but simpler:** e.g. one shared writer/drainer for everyone, or tokens per person, not per agent.
3. **A hosted CRM with an API** (e.g. HubSpot free, Attio, Pipedrive, folk): pipelines built in, phone apps, agents through the API or MCP; data with a third party.
4. **A self-hosted open-source CRM** (e.g. Twenty, EspoCRM, SuiteCRM): our server, our data, someone to run it.
5. **The team's workspace tools** (the team uses Google Workspace: WS-124): a shared Sheet or similar, with agents through the API; low build.
6. **A private git repository** of JSON records (agents already speak git), with a small app; encrypted at rest or not.
Anything else that beats these.

## Judge each on (a table, then words)
- Security and privacy: who can read (the team and named agents only), encryption at rest and in transit, where data lives (EU/GDPR: contacts are personal data), consent and deletion (true deletion, including history and backups), audit of who changed what.
- Agents: how an agent reads and writes (API, MCP connector, git, CLI), what secret each needs, least privilege.
- People: the ten-second add on a phone, the board, offline, learning curve for six people.
- Effort and time to first use: build, run, maintain; who must do what (Dinis, each person); cost per month.
- Fit with the team: Angelo asked for it "on top of our private CRM"; Dinis replied "if you can build it, we can then all use it to commit our contacts there"; SG/Send and vaults are the team's own products (Dinis's), so using them is also showing them. Weigh this honestly, both ways.
- Lock-in and exit: export, moving later.

## Write review.md
One phone screen first: the recommendation, the runner-up and why, in plain words. Then the table, then each option (what it does well and badly, what it needs, risks), then "what changes in our design and spec" if the recommendation is not option 1, then questions for Angelo and Dinis (tier 3, as questions). Sources: one line per claim about a product (URL, date read UTC); prices and features from the vendor's own pages today; mark what you could not confirm.
- **Not:** no account opened anywhere, no sign-up, no trial, no message to anyone, no vault read or write, no change outside r1-review/. No automated reading of websummit.com.
- **Done when:** review.md is on pool/crm-pipeline-r1, every product claim has a source, the gate prints OK (red only on check 21, lanes: say so and go on), STATE.md says "ready for Angelo's read".
