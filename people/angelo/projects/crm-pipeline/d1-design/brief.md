---
title: "D1: the client pipeline on the private CRM (design)"
item: crm-pipeline-d1
project: crm-pipeline
by: crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
role: design
size: large
go: "Angelo, 13 Nov, to conductor.b@: \"can you spawn a pm for this, and give it the first task of coming up with a good design for this?\""
---
# crm-pipeline-d1: design

Wake routine: not yet named; at your end read "Wake routine:" in people/angelo/projects/crm-pipeline/BRIEF.md on origin/dev; if it names a trig_..., fire it.

Your folder is people/angelo/projects/crm-pipeline/d1-design/ (where the library says people/angelo/pipeline/{ID}/, read this folder; write design.md, mock/, STATE.md here). Branch pool/crm-pipeline-d1. Your instruction commit is from crm-pipeline.pm@PrompTugal.angelo (where the library says conductor.b@, read the lead).
The project: people/angelo/projects/crm-pipeline/BRIEF.md (Angelo's and Dinis's words) and STATE.md (sections 1 and 2: the private CRM today and what to reuse, already surveyed; build on it, do not redo it).

## Angelo's words
- To the team, 13 Nov: "I think we need a client funnel pipeline, where we can transition contacts from the different stages of: "to contact", "to followup", "in conversation", "call booked", "proposal", "won", "parked". The to-followup / in-conversation / call booked is a loop until won or parked. All of that plus owners. I think it should go on top of our private CRM, with a secured UI we can all access."
- Dinis's reply: "yes we need a CRM for that and if you can build it, we can then all use it to commit our contacts there"

## What a team member must grasp in five seconds
On the board: what is mine, what is due today or late, where every company sits. After a conversation at a stand: "I can log this in ten seconds on my phone, one-handed."

## Brief
1. Look first, at 390 and 1280 px in Playwright after node admin/build/build.mjs: /crm/ and the vault app (admin/tools/crm_app.html.tpl), Angelo's command centre (people/angelo/app/), the site's look. Say in design.md what to keep (palette, type: no new palette). Read, as material: board/WS-170, WS-172, WS-173, WS-175, WS-178, WS-189 (Silvio's stand desk: the flow and its open questions), people/angelo/meetings/README.md, WS-96. Never read the private vault (tier 3) and never change Dinis's or Silvio's files.
2. Design these parts, for each option:
   - **the ten-second add** on a phone after a conversation: person, company (find or new), stage, owner (default: me), one note, next follow-up date (quick picks: tomorrow, next week); voice or a photo of a card only as an idea, flagged for consent.
   - **the board**: one column per stage, cards by owner, due today and late first; the loop (to follow up, in conversation, call booked) shown as a loop, won and parked as ends; filter "mine"; on a phone, a stage at a time or a list by due date.
   - **the record**: contact, company, stage history (who moved it, when, from, to), notes, follow-ups; one tap to move a stage or snooze a follow-up.
   - **on the vault**: the record layout (a new pipeline record per company or per contact, or the stage on thread.json; stage changes as append-only event files so two people never clash), who holds the key, how a change is written (browser, an agent, or both) and by whom, how agents add and read records (e.g. after Angelo's meetings workflow), the derived board index.
   - **security and privacy**: contacts are personal data: who can read (the team only; per-record sealing for contact details or not: WS-189 q3), consent noted on the record, nothing in this public repository, the exit and deletion path (a person asks to be removed: what is deleted where, vault history included), the access tokens it needs.
3. Three different options (not three skins of one), for example: A, a pipeline view inside /crm/ on our site, unlocked by the person's site key (the existing bridge); B, the pipeline as the private vault's own app (SG/Vault app mode); C, agent-first: each person tells their agent, which writes the vault, and the UI is a read-mostly board. Better options welcome. Each: what it does well and badly, what it needs from Dinis or tier 3, effort to build.
4. Mocks: static HTML in d1-design/mock/<a|b|c>/ fed by sample-pipeline.json of **made-up people and companies, labelled "made-up" in the mock** (no real visitor, contact, note or team member's private detail; team members only by first name as owners). Screenshots at 390 and 1280 px (deviceScaleFactor 2) of the add, the board and the record.
5. design.md: one phone screen first (the recommendation and why, two screenshots); then each option; then what the spec needs (record JSON shapes, files in the vault, components, the questions for Dinis as a list: tier 3, for the lead).
- **Not:** no change outside d1-design/; no vault read or write; nothing published; no message to anyone.
- **Done when:** design.md, the three mocks and their screenshots are on pool/crm-pipeline-d1, the gate prints OK (if it is red only on check 21, lanes, say so and go on), STATE.md says "ready for Angelo's pick", and you fired the wake routine if one is named.
