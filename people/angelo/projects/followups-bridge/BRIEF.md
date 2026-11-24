---
title: "Project: the follow-ups bridge on the team CRM (followups-bridge)"
lead: followups-bridge.pm@PrompTugal.angelo
started: 2026-11-24, by conductor.b@PrompTugal.angelo at Angelo's word
status: running
budget: none; the running cost (dollars and tokens) in STATE.md's "For the digest:" line
---
**Wake routine:** trig_01AVamZUMw45sJAxPkJZnq3k. It fires only when a worker fires it (no backstop schedule). Put "Wake routine: trig_01AVamZUMw45sJAxPkJZnq3k" in every worker's brief.md.

# The follow-ups bridge

**Angelo, 24 November 2026, in the conductor.b@ session:**
- "I suspect right now we have a conflict between building a fully fledged, agentic CRM tool and acting on the follow-ups as quickly a possible to avoid wasting time and opportunities. What Dinis is building in the new site feel like the ideal, future tool, and I am worried it won't be usable soon, or soon enough. So I'm wondering if we should work on the current, limited CRM with the goal of building visibility and actionability and then, when the new CRM is ready we can migrate data to the new tool."
- "Regarding the leads, the first worry I want to address is to miss context on who/what has already been followed up as I don't want to double follow-up or follow-up with the wrong approach. I'm happy to develop the current CRM enough to allow centralizing all contacts and logging actions taken with context and notes. With that, I can ask every team member to make sure they snapshot the situation there."
- "Go ahead, I'm happy to expand on Indi's work without asking as he's clearly not currently and going to work on it since there has been no activity since the 16th."
- Earlier the same day: "we've been given the good to go to join efforts with Dinis on the CRM work."

## Goal (a bridge, time-boxed, explicitly temporary)
The team's existing follow-up list (/crm/follow-ups/, WS-217, Indi's) becomes the one place for every Web Summit contact and every action already taken, so nobody follows up twice or with the wrong approach:
1. **Every contact in one place**, with source (who met them, where) and owner.
2. **An action log per contact**, append-only: who, when, channel (email, LinkedIn, call, in person), a one-line summary and notes.
3. **Last touch at a glance** on every row, and an **"in progress by X"** marker.
4. **Stage** (Angelo's seven: to contact, to follow up, in conversation, call booked, proposal, won, parked; the middle three loop until won or parked) and **next step with a date**; views "mine", "due this week", "by stage".
5. **Bulk import** from a spreadsheet (CSV or Excel) with a template, so each team member uploads their contacts and past follow-ups in about 15 minutes (the "snapshot").
6. **Reliable saving**: entries filed regularly and automatically, and two people saving never overwrite each other (today: whole-list saves, the newest wins, filed only when conductor@web-summit.indi drains, quiet since 16 Nov).

Fixed scope: nothing beyond these six. Anything else waits for Dinis's CRM tool site.

## The one design rule
Fields and records map one to one onto Dinis's CRM tool site's records (`crm.org/1`, `crm.person/1`, `crm.lead/1`, `crm.link/1` in AgentiCCells/AgentiCCells__Cell__Email, branch work/crm.dev.a, crm/model/crm.mjs), plus an action-log record proposed for it, so the later move is a script. Where the stage lists differ (his: new, contacted, talking, proposal, won, parked), say how they map.

## Done when
A team member can open /crm/follow-ups/ with their key, upload their spreadsheet, see every contact with its owner, stage, last touch and log, add a log entry, and see everyone's entries within an hour, without clashing; Angelo's 35 and Indi's 19 are in it; Angelo has read and accepted it.

## Start from (read; all material)
- The page and its tools: content/crm-follow-ups.md, assets/crm-follow-ups.js, assets/crm-seal.js, assets/crm-follow-ups.json, admin/tools/crm_followups.mjs (the drain and collector), admin/tools/crm.mjs (seal), people/indi/followups/README.md, board/WS-217-the-follow-up-list-in-the-private-crm.md. These are Indi's agents' and Dinis's (crm.mjs) files: Angelo's word above covers changing Indi's; every change outside people/angelo/ carries an `Outside:` trailer and a commit `For: conductor@web-summit.indi` so he knows; crm.mjs and the private vault's layout are Dinis's (tier 3 to change).
- The team CRM: board/WS-170, 172, 173, 189 (question 4, browser writing), 178.
- Earlier work, reuse not repeat: people/angelo/projects/crm-pipeline/ (d1 design, d2 spec, r1 review, HANDOVER.md); people/indi/crm-pipeline/design-01-start.md.
- Dinis's CRM tool site: the branch above, crm/README.md and crm/notes/.
- Angelo's 35 contacts were added through the page on 23 Nov; the save is probably waiting in the drop box (vault 5xsk56gw), unfiled.

## Tier 3, Angelo's own word each time
Reading or writing the private CRM vault or the drop box, and any key or SG/Send access token for it (today the private CRM's key is sealed to conductors on account A, data/sealed/agents/; filing needs an agent with its own token, Dinis's rule of 5 Nov); changes to crm.mjs, the vault layout or /crm/ beyond the follow-ups page; anything that reaches a team member or Dinis (the snapshot ask to the team, the note to Dinis: drafted here, sent by Angelo); contact details in any repository (never: names and roles only, as the page enforces).
