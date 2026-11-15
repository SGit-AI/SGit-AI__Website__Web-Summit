# crm-pipeline: state

For the digest: handed over for the team to pick up (HANDOVER.md) while Angelo is away until Friday; open: vault (simpler) or Twenty; nothing built, nothing sent to Dinis; cost so far 10.45 USD, 225,203 output tokens.

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
1. **d1 design** (large, DONE 15:56, pool/crm-pipeline-d1 55cd0a2: recommends A, a Pipeline tab on /crm/, written by agents first until browsers can write; one pipeline record per company with append-only event files and a derived index): the ten-second add on a phone, the stage board, the record and its history, how it sits on the vault, security and privacy; two or three options with mocks at 390 and 1280 px; a recommendation. Then Angelo's pick (point to him).
2. **d2 spec** (large, DONE 16:48, pool/crm-pipeline-d2 55ffdbf: monthly append-only log per writer + derived index (about 30 files a year), Pipeline tab as a module like the Mail tab, writer crm@PrompTugal.angelo, sealed drops for agents now and browsers later, Indi's 19 by reseal with her yes, seven build steps; proposal-dinis.md drafted, not sent): the record layout, who writes stage changes and how, the agents' API, the tier-3 asks to Dinis as one proposal.
3. d3 build (large), then a cold-reader check; a proposal to the team only through Angelo.

## Waiting on Angelo (tier 3; none blocks the design)
1. Reading or writing the private vault: DECIDED by Angelo, 13 Nov ~15:55 UTC, to the recommendation "nobody touches the vault before the spec; then one agent with its own access token, asked of Dinis through Angelo, as the only writer": "Yes, go ahead". The token ask itself still goes through Angelo when the spec is ready.
2. A contact's details: DECIDED by Angelo, 13 Nov ~16:00 UTC: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work." So contact details sit in the record, readable by everyone with the vault key; no per-record sealing. The spec still records consent and the deletion path. Note for the spec: the vault key is also sealed to each person's conductor and to CRM agents (WS-170), so "the team" includes their agents; the spec says so plainly.
3. Changing Dinis's /crm/ and admin/tools/crm* (if the pick puts the UI there): the five steps, For: conductor@web-summit.dinis, with Angelo's go.
3b. Replying to followups@web-summit.indi (WS-217): DONE 13 Nov ~16:55 UTC (replies/ws-217-followups.md); GO from Angelo, 13 Nov ~16:50 UTC: "Yes, reply to Indi's agent after the spec". When d2's spec is in: one commit For: followups@web-summit.indi (and conductor@web-summit.indi), saying the pipeline takes the list over and how, per the spec.
4. Proposing it to the team (Dinis replied "yes ... we can then all use it"): through Angelo, after the pick.

## Decided by Angelo
- 13 Nov, point 1 (the plan, the vault approach above): "Yes, go ahead".
- 13 Nov, Indi's agent: "Yes, reply to Indi's agent after the spec".
- 13 Nov, point 2 (contact details): team-wide, no sealing: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work."

## The pick
- 13 Nov ~16:50 UTC, Angelo: "B with A's board, go ahead" (to the lead's recommendation: B, the private vault's own app, with A's board: stage columns with the loop on desktop, my list by due date on a phone, the ten-second add; agents write the event files first, until browsers can).

## Angelo's leaning (before the pick)
- 13 Nov ~16:35 UTC, on the three options as outlined (A a page under /crm/, B the vault's own app, C agent-first): "I like option B, but let's see if the worker has better ideas." The pick waits for d1's design.md.

## Decided by default (Angelo can reverse)
- The design brief asks for three options, not two, and for made-up people labelled as such in every mock (privacy).

## Overlap check (13 Nov ~16:25 UTC, at Angelo's ask: "can you check nobody is working on this?")
Swept dev's commits (5 days), the board, branches, the CRM's tools and Silvio's folder. Nobody else builds a pipeline. One adjacent, live piece, pointed at us:
- **WS-217, Indi's followups@web-summit.indi (c0ebf5d, today 16:14):** Indi's 19 people to follow up as one sealed record in the private CRM (each with category, stage in our stages, owner, note; filed by conductor@web-summit.indi, 0ff930d) and a read-only page /crm/follow-ups/. Its item 3: "when its design is picked, the list moves into it, and this page and record are retired." It needs the same browser-write answer from Dinis (a drop box, WS-189 q4). It seals per record, unlike Angelo's point 2 decision: the spec reconciles.
- WS-189 (Silvio's stand desk) and WS-172 (CRM editors/outreach/inbox agents): no change since 12 Nov, no stage board. WS-205 "the pipeline" is the agents' work trace, not sales.
For the spec: WS-217's record shape is the first import; its page is a view to keep or retire.

## For conductor.b@ (from d1's STATE)
- check 21 (lanes): crm-pipeline.pm@ and design@ have no entry in people/angelo/policy/lanes.json; recommend people/angelo/projects/crm-pipeline/** through policy@.
- d1's PNGs are about 4 MB in a public repository: keep for the pick, trim after the spec (decided by default).

## Who can write the CRM today (checked 13 Nov ~17:30 UTC, at Angelo's question: "I think each member of the team needs to have at least 1 agent that can write to the CRM app, and I thought we all already had that in place, isn't that the case?")
- **The key (to read and to make changes): yes, everyone.** data/sealed/agents/ on dev: Angelo (conductor@, crm@web-summit.angelo), Dinis (crm@, inbox@web-summit.dinis), Jose (conductor@, crm@), Silvio (conductor@, crm@, dev@, inbox@, vault@), Vicky (conductor@, inbox@), Indi (conductor@web-summit.indi, two keys).
- **The access token (to push a change to the vault): no record of any issued.** Dinis's rule (5 Nov): one SG/Send token per agent. Asked for crm-angelo, conductor-angelo, vault-angelo (5 Nov), crm-jose (6 Nov), conductor-jose, vault-jose (7 Nov), reminded 8 Nov; nothing on dev says issued; people/angelo/inbox/STATE.md still "waits for crm-angelo's own SG/Send token". A token lives only in an environment, so Dinis or each person would know if one was set without a commit.
- **New, 17:20 UTC (3efb5e1, followups@web-summit.indi):** a browser drop box for Indi's list (assets/crm-seal.js, admin/tools/crm_followups.mjs): the browser seals and signs a save, drops it with a public write-only token, Indi's conductor drains it with its own token. The same shape as our spec's sealed drops: reuse, not a second one.
- Consequence for the spec (decided by default, Angelo can reverse): if each person's agent gets a token, each writes its own monthly log (the spec's log-per-writer already allows it); the ask to Dinis becomes one token per person's CRM agent, not one writer.

## Angelo's own contacts (asked 13 Nov ~18:10 UTC: "Now, how do I share securely my contact lists and notes for the team to pick up? Can we use Indi's approach?")
- Correction to "Who can write": conductor@web-summit.indi has its own SG/Send token (people/indi/followups/filed-2026-11-13.md: "pushed with the conductor's own token", 0ff930d). Angelo's agents still have none on record.
- Indi's approach (WS-217): an agent in a session took her list, kept only name, public role/company, connected date, category, stage, owner, followed up, note, LinkedIn (no email, no phone), sealed it with crm.mjs seal to the six people and crm-dinis (public keys only, no secret), handed the sealed file session to session (never through this repository) to conductor@web-summit.indi, which filed it in the vault with its own token; /crm/follow-ups/ opens it in a team member's browser. The page opens one fixed record (assets/crm-follow-ups.js, RECORD).
- Recommended for Angelo: the same, as a second record (actions/<date>-angelo-follow-ups.sealed.json): a fresh session for his list only (he uploads; nothing committed), sealing to the same audience; filed by an agent with a token (Indi's conductor or Dinis's crm agent: tier 3, reaches their agents); the page taught to open more than one record (followups@'s file: ask it). Waiting on Angelo's go.
- 13 Nov ~18:20 UTC: Angelo uploaded his own files in this session (the Web Summit app's export, his LinkedIn connections, one email from a company) with: "Ok, so these are all my newly made connections" and named his two priorities (a company as an alternative to OpenRouter, for Dinis; a researcher looking for partners in secure AI infrastructure). Decided by default (Angelo can reverse): sealed here by the lead, not a worker, so his contacts reach no other session; email addresses and phone numbers left out, as Indi did.
- Sealed 18:27 UTC with admin/tools/crm.mjs seal (public keys only): record id 2026-11-13-angelo-follow-ups, 53 contacts (2 priority), each with name, company, role, connected date, source, category, stage, owner angelo, note; audience dinis, silvio, angelo, jose, vicky, indi, agent crm-dinis; sealed file sha256 00b7bbc1301a82f0..., outside the repository, in this session's scratchpad only. The readable copies were deleted after sealing. Nothing about these contacts is in any commit.
- crm.mjs writes sealed_by: conductor@web-summit.dinis whatever the caller (line 63, hard-coded); the lead set it to itself in the envelope (outside the ciphertext). A note for Dinis's agents later.
- Waiting on Angelo: (a) who files it in the vault (recommend conductor@web-summit.indi, which has a token and filed Indi's), and how the sealed file reaches it (recommend: Angelo receives it and hands it over); (b) asking followups@web-summit.indi to let /crm/follow-ups/ open a second record.

## Handover (Angelo, 13 Nov ~18:00 UTC: "As I'm going to switch off for a few days, until Friday, can you publish the CRM design in the repo for someone else in the team to pick it up?")
- d1, d2 and r1 merged onto project/crm-pipeline; HANDOVER.md written for the team; asked conductor.b@ to bring the branch onto dev. Point 1 (vault or Twenty) left open for Dinis and Angelo; the lead starts nothing new until Angelo is back or the team picks it up.

## r1 review (done 17:44, pool/crm-pipeline-r1 a032d23)
- Recommends option 2: the vault, simpler: one SG/Send token per person's CRM agent (six), each writing its own log; browsers through WS-217's drop box (3efb5e1); a stop point Angelo sets, after which Twenty cloud (Frankfurt, AGPLv3, official MCP, 9 USD a user a month) replaces the vault for the pipeline only. Not recommended: HubSpot free (2 users), a Google Sheet (stopgap only), a git repo (deletion fights erasure).
- Its questions: option 2 or Twenty, with what stop point; one list of asks to Dinis (six tokens, the drop box token, browser writing, deletion from history, vault region, speed); a stopgap for this week's contacts (recommends sealed per-person records, not a Sheet).

## On hold (Angelo, 13 Nov ~17:35 UTC: "Before we lock in a solution based on what's available, can we review what would be the best way to handle this private CRM?")
- The note to Dinis, build steps 1 and 2, and the spec's writer choice wait for r1's review.

## Open steps
- d1 design: done (see plan). d2 spec: brief d2-spec/brief.md; bravo.large.worker@ started 16:44 UTC (session_01Xp7gj3S9pPpQaeXjfZXSbb), claim crm-pipeline-d2.
