---
title: "Project: the team's client pipeline on the private CRM (crm-pipeline)"
lead: crm-pipeline.pm@PrompTugal.angelo
started: 2026-11-13, by conductor.b@PrompTugal.angelo at Angelo's word
status: running
budget: none; the running cost (dollars and tokens) in STATE.md's "For the digest:" line (Angelo, 11 Nov: "Yeah, c works.")
---
**Wake routine:** set by conductor.b@ in its next commit. It fires only when a worker fires it: no backstop schedule (Angelo paused all scheduled agents on 13 Nov: "Yes please, pause all agents."). Put "Wake routine: <its id>" in every worker's brief.md.

# The client pipeline on the private CRM

**Angelo, to the team (13 November, about 15:39 Lisbon), shared in the conductor.b@ session:** "Can we align on how we're going to manage our new connections, notes, status and follow-ups? I think we need a client funnel pipeline, where we can transition contacts from the different stages of: "to contact", "to followup", "in conversation", "call booked", "proposal", "won", "parked". The to-followup / in-conversation / call booked is a loop until won or parked. All of that plus owners. I think it should go on top of our private CRM, with a secured UI we can all access. If you agree and if nobody's already building this, I can work on it."

**Dinis's reply (15:40), as Angelo shared it:** "yes we need a CRM for that and if you can build it, we can then all use it to commit our contacts there"

**Angelo to conductor.b@:** "can you spawn a pm for this, and give it the first task of coming up with a good design for this?"

## Goal
One place the whole team (Dinis, Angelo, Silvio, Indi, Jose, Vicky and their agents) records each new connection: who, which company, notes, stage, owner, next follow-up and when. The stages: to contact, to follow up, in conversation, call booked, proposal, won, parked; to follow up, in conversation and call booked loop until won or parked. Built on the team's private CRM vault, behind a secured UI everyone on the team can open, and nobody else.

## First task: the design (no build before Angelo's pick)
A design step (ROLES.md's design role, the designer skill): what a team member must do in ten seconds after a conversation at a stand, on a phone (add a contact, set the stage and owner, a note, a follow-up date); the board view (one column per stage, cards by owner, what is due today); the record (contact, company, history of stage changes with who and when, notes, follow-ups); how it sits on the private CRM (record layout in the vault, who holds the key, how a stage change is written and by whom, how agents add or read records); security and privacy (contacts are personal data: who can read, encryption, consent noted, nothing in a public repository, an exit and deletion path); two or three options with mocks at phone and desktop width and a recommendation. Then Angelo's pick; then a spec and a build.

## Start from (read; all material)
- The private CRM: board/WS-170-the-team-crm.md (the two vaults, admin/tools/crm.mjs, crm_agents.py, /crm/ and its vault app, sealed keys in data/sealed/), WS-172 (the CRM's editors, outreach and inbox agents), WS-173 (company email as EML), WS-175 (the channels area), WS-189 (the Summit desk writes to the private CRM; its question 3, how a visitor's contact is kept, is still open), WS-178 (seal keys).
- The team's ways so far: people/angelo/meetings/README.md (Angelo's meetings workflow), people/silvio/outreach/ (Silvio's 50 ranked companies), WS-24, WS-29 (hot leads go to Nimay or Dinis), WS-61, WS-96 (brief, debrief, follow-ups), the /meet/ pages.
- The vault guide's rule (5 Nov, Dinis): one SG/Send access token per agent, never a person's token.

## Never
A contact detail, a private note or a screenshot in this repository (it is public); a person beyond their public professional role here. Records with personal data live only in the private vault.

## Tier 3, Angelo's own word each time
Any change to the private CRM vault or its keys (reading it included, until he says how); an access token; anything that reaches a team member or their agents (proposals to the team go through Angelo); Dinis's or other people's agents' files (admin/tools/crm*, /crm/: the five steps, For: their owners); settings.
