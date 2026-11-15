---
title: "The team's client pipeline on the private CRM: handover, for anyone in the team to pick up"
by: crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
for: the team (Dinis, Silvio, Indi, Jose, Vicky) and their agents
go: "Angelo, 13 Nov ~18:00 UTC: \"As I'm going to switch off for a few days, until Friday, can you publish the CRM design in the repo for someone else in the team to pick it up?\""
status: open for pick-up; Angelo is away until Friday
---
# The client pipeline: handover

**What it is.** One place where the team records each new connection: who, which company, notes, stage, owner, next follow-up and when. Stages: to contact, to follow up, in conversation, call booked, proposal, won, parked. To follow up, in conversation and call booked loop until won or parked. On the team's private CRM, behind a secured view the team, and only the team, can open.

**Why.** Angelo to the team (13 Nov): "Can we align on how we're going to manage our new connections, notes, status and follow-ups? I think we need a client funnel pipeline [...] I think it should go on top of our private CRM, with a secured UI we can all access." Dinis: "yes we need a CRM for that and if you can build it, we can then all use it to commit our contacts there".

## Where things stand (one screen)
- **Designed:** three options with phone and desktop mocks (made-up people only). Angelo picked **B with A's board**: a Pipeline tab inside the private CRM vault's own app, with A's board: stage columns with the loop drawn as a loop on desktop, my list by due date on a phone, a ten-second add, each company's history.
- **Specified:** how it is stored in the vault (an append-only monthly log per writer, plus a summary file the board reads; about 30 files a year), the tab, the writer, Indi's 19 follow-ups as the first import, security, deletion, seven build steps.
- **Reviewed:** before locking in, Angelo asked for an open review of the best way to run the private CRM. It recommends **keeping the vault, simpler**: one SG/Send access token per person's CRM agent, browsers saving through the drop box Indi's agent built (WS-217, 3efb5e1). Runner-up: **Twenty**, hosted in Frankfurt (open source, an official MCP connector, about 9 USD a user a month).
- **Not decided:** vault (with a stop point) or Twenty. Angelo had not chosen before leaving. Nothing is built; nothing is in the vault; nothing has been sent to Dinis.

## Angelo's decisions so far (his words)
- The plan: nobody reads or writes the vault before the spec; agents write first, browsers later: "Yes, go ahead".
- Contacts: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work." (No per-record sealing; consent and the deletion path still recorded.)
- The pick: "B with A's board, go ahead".
- Writers: "I think each member of the team needs to have at least 1 agent that can write to the CRM app".
- Indi's list: "Yes, reply to Indi's agent after the spec" (done: replies/ws-217-followups.md).

## The files (all in this folder)
| What | Path |
|---|---|
| The brief (Angelo's and Dinis's words) | BRIEF.md |
| The project's memory | STATE.md |
| Who ran what, and its cost | runs.md |
| The design: three options, mocks and screenshots | d1-design/design.md, d1-design/mock/ |
| The spec and a draft note for Dinis (not sent) | d2-spec/spec.md, d2-spec/proposal-dinis.md |
| The open review of how to run the CRM | r1-review/review.md |
| The reply to Indi's follow-ups agent (WS-217) | replies/ws-217-followups.md |

## What is needed, and from whom
1. **The choice: vault or Twenty.** The review recommends the vault, with a stop point: if tokens and browser writing are not in place by an agreed date, the pipeline moves to Twenty, with an export kept in the vault. Dinis (the CRM's owner) and Angelo (back Friday) decide.
2. **From Dinis, if the vault:** one SG/Send access token per person's CRM agent (asked since 5 Nov on WS-170, none recorded as issued), the drop box's token, an answer on browser writing (WS-189 question 4), whether a contact can be deleted from a vault's history, and his go to add the tab to admin/tools/crm_app.html.tpl and admin/tools/crm.mjs (his files). The draft note (d2-spec/proposal-dinis.md) asks for one token for one writer: update it to one per person's CRM agent, as r1-review/review.md's "What changes" says.
3. **Build steps 1 and 2 need nobody:** the writing tool on made-up data (people/angelo/tools/pipeline.mjs, new) and the tab's screens as a read-only preview on made-up data (assets/crm-pipeline.js, new). See d2-spec/spec.md section 6.
4. **This week's contacts, meanwhile:** the review advises against a shared Sheet; Indi's sealed follow-up list (WS-217, /crm/follow-ups/) already works for her 19.

## Rules for whoever picks it up
- This repository is public: no contact detail, private note, real visitor's name or screenshot, in mocks too (made-up people, labelled).
- Real records live only in the private vault, written by an agent with its own SG/Send token (Dinis's rule, 5 Nov), never a person's.
- admin/tools/crm*, /crm/ and the vault are Dinis's: change them only with his go.
- To pick it up: say so in a commit For: conductor.b@PrompTugal.angelo (Angelo's agents will see it), then work in your own folder or on a board issue.
