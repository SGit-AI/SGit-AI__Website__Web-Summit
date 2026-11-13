# crm-pipeline: state

For the digest: design step started (large worker, three options with phone and desktop mocks, made-up people only); nothing for Angelo until the pick; 4 questions waiting (tier 3, none blocking yet); cost so far 0 USD (the lead's own session not counted by the platform per step).

Lead: crm-pipeline.pm@PrompTugal.angelo (started 13 Nov 2026 by conductor.b@ at Angelo's word: "can you spawn a pm for this, and give it the first task of coming up with a good design for this?"). Wake routine: not yet in BRIEF.md (conductor.b@'s next commit); workers read it from BRIEF.md on origin/dev at their end.

## Goal (BRIEF.md)
One place the whole team records each new connection (who, company, notes, stage, owner, next follow-up and when), stages to contact / to follow up / in conversation / call booked / proposal / won / parked (the middle three loop until won or parked), on the team's private CRM vault, behind a secured UI the team, and only the team, can open. Done when: Angelo says so.

## 1. The private CRM today (WS-170, read only: board and admin/tools/crm.mjs header; the vault itself not read, tier 3)
- Two vaults on dev.send.sgraph.ai (conductor@web-summit.dinis owns them): `ws-team-crm-public` (public facts, read key in data/crm.json) and `ws-team-crm-private` (the team's records).
- One layout: companies/<slug>/company.json (+ notes.md), contacts/<slug>/contact.json, actions/<date>-<slug>.json, schedules/<date>/<slug>.json, companies/<c>/comms/<thread>/thread.json (WS-173: subject, owner, state, next_step, updated_at, updated_by), graph/ (derived), schemas/, and a vault app (index.html from admin/tools/crm_app.html.tpl).
- Keys: the private vault key is sealed to every person's site key and to their conductors (data/sealed/), checked by seal.mjs --verify (WS-178). It opens in the browser on /crm/ (the "dance": the page unseals for the embedded vault app).
- Layer 2 (per-record sealing, ws-crm-env-1) is paused at Dinis's word (5 Nov): "let's pause for now the double encryption and just use the fact that agents have the vault key." Whoever holds the private key reads and writes everything.
- Writing needs an SG/Send access token, one per agent (Dinis, 5 Nov: "everybody should have they own SG Send access token"); several asked for (crm-angelo, crm-jose...) and, as far as WS-170 shows, not issued. Browser writing is unsolved (WS-189 q4: sg.auth.check() said valid: false).
- WS-189 (Silvio's stand desk writing to the private CRM) is the nearest live work: its four questions to Dinis are open, q3 (how a visitor's contact is kept: sealed to interviewer and Dinis, or kept out) included.

## 2. What the pipeline can reuse
- The vault and its layout; thread.json already has owner, state and next_step: the stage could be a thread's state, or a new record kind. The design says which.
- The /crm/ page, the vault app and its unseal bridge (Dinis's agents' files: material, the five steps, For: their owners, tier 3 for us to change).
- Person site keys (data/person-keys.json) as who-is-on-the-team; the roster data/team.json for owners.
- Silvio's desk flow (WS-189), Silvio's 50 ranked companies (people/silvio/outreach/), Angelo's meetings workflow (people/angelo/meetings/README.md), WS-96 follow-ups: the design looks at these so we build one list, not a second.

## 3. Plan (steps; each a fresh worker)
1. **d1 design** (large, running): the ten-second add on a phone, the stage board, the record and its history, how it sits on the vault, security and privacy; two or three options with mocks at 390 and 1280 px; a recommendation. Then Angelo's pick (point to him).
2. d2 spec (large): the record layout, who writes stage changes and how, the agents' API, the tier-3 asks to Dinis as one proposal.
3. d3 build (large), then a cold-reader check; a proposal to the team only through Angelo.

## Waiting on Angelo (tier 3; none blocks the design)
1. Reading or writing the private vault: DECIDED by Angelo, 13 Nov ~15:55 UTC, to the recommendation "nobody touches the vault before the spec; then one agent with its own access token, asked of Dinis through Angelo, as the only writer": "Yes, go ahead". The token ask itself still goes through Angelo when the spec is ready.
2. A contact's details: DECIDED by Angelo, 13 Nov ~16:00 UTC: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work." So contact details sit in the record, readable by everyone with the vault key; no per-record sealing. The spec still records consent and the deletion path. Note for the spec: the vault key is also sealed to each person's conductor and to CRM agents (WS-170), so "the team" includes their agents; the spec says so plainly.
3. Changing Dinis's /crm/ and admin/tools/crm* (if the pick puts the UI there): the five steps, For: conductor@web-summit.dinis, with Angelo's go.
3b. Replying to followups@web-summit.indi (WS-217) that the pipeline takes its list over: reaches Indi's agents, so Angelo's go (recommended: yes, one commit For: followups@web-summit.indi, after the pick).
4. Proposing it to the team (Dinis replied "yes ... we can then all use it"): through Angelo, after the pick.

## Decided by Angelo
- 13 Nov, point 1 (the plan, the vault approach above): "Yes, go ahead".
- 13 Nov, point 2 (contact details): team-wide, no sealing: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work."

## Angelo's leaning (not yet the pick)
- 13 Nov ~16:35 UTC, on the three options as outlined (A a page under /crm/, B the vault's own app, C agent-first): "I like option B, but let's see if the worker has better ideas." The pick waits for d1's design.md.

## Decided by default (Angelo can reverse)
- The design brief asks for three options, not two, and for made-up people labelled as such in every mock (privacy).

## Overlap check (13 Nov ~16:25 UTC, at Angelo's ask: "can you check nobody is working on this?")
Swept dev's commits (5 days), the board, branches, the CRM's tools and Silvio's folder. Nobody else builds a pipeline. One adjacent, live piece, pointed at us:
- **WS-217, Indi's followups@web-summit.indi (c0ebf5d, today 16:14):** Indi's 19 people to follow up as one sealed record in the private CRM (each with category, stage in our stages, owner, note; filed by conductor@web-summit.indi, 0ff930d) and a read-only page /crm/follow-ups/. Its item 3: "when its design is picked, the list moves into it, and this page and record are retired." It needs the same browser-write answer from Dinis (a drop box, WS-189 q4). It seals per record, unlike Angelo's point 2 decision: the spec reconciles.
- WS-189 (Silvio's stand desk) and WS-172 (CRM editors/outreach/inbox agents): no change since 12 Nov, no stage board. WS-205 "the pipeline" is the agents' work trace, not sales.
For the spec: WS-217's record shape is the first import; its page is a view to keep or retire.

## Open steps
- d1 design: brief d1-design/brief.md; alpha.large.worker@ started 15:48 UTC (session_01Xp7gj55asnnL4CtJpYBcNS), claim crm-pipeline-d1. Note: pushed-by.mjs reads dev only; the worker checks my push on project/crm-pipeline through the activity API instead.
