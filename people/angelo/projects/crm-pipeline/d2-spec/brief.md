---
title: "D2: the client pipeline, spec (B with A's board)"
item: crm-pipeline-d2
project: crm-pipeline
by: crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
role: spec
size: large
go: "Angelo, 13 Nov ~16:50 UTC, in the lead's session: \"B with A's board, go ahead\""
---
# crm-pipeline-d2: spec

Wake routine: not yet named; at your end read "Wake routine:" in people/angelo/projects/crm-pipeline/BRIEF.md on origin/dev; if it names a trig_..., fire it.

Your folder is people/angelo/projects/crm-pipeline/d2-spec/ (where the library says people/angelo/pipeline/{ID}/, read this folder; write spec.md, proposal-dinis.md, STATE.md here). Branch pool/crm-pipeline-d2. Your instruction commit is from crm-pipeline.pm@PrompTugal.angelo.
Read first: the project's BRIEF.md and STATE.md (Angelo's decisions, the overlap check), and the design on origin/pool/crm-pipeline-d1: people/angelo/projects/crm-pipeline/d1-design/design.md and its mocks (read with git show; do not copy them).

## Angelo's decisions (quote them, never improve them)
- The pick: "B with A's board, go ahead". B: the pipeline is the private vault's own app (ws-team-crm-private, app mode; today built from admin/tools/crm_app.html.tpl by admin/tools/crm.mjs app). A's board inside it: stage columns with the loop drawn as a loop on desktop, my list by due date (late, today, next) on a phone, the ten-second add, the record with its history.
- Contacts: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work." No per-record sealing; consent and the deletion path still recorded.
- The plan: nobody reads or writes the vault before this spec; then one agent with its own SG/Send access token, asked of Dinis through Angelo, writes (agents first, browsers later).

## The spec must settle
1. **The vault layout**: d1's pipeline/<company>/record.json + events/*.json (append-only) + pipeline/index.json (derived), links to companies/ and contacts/; the event kinds; how state folds; who rebuilds the index and when. Say what happens if two writers append at once.
2. **The app (B with A's board)**: what changes in crm_app.html.tpl (a Pipeline tab: board, phone list, add, record), sizes and components, the vault host's speed with many small files (WS-170's hang: measure or estimate the file count after a year of use; propose a mitigation, e.g. a monthly compacted events file).
3. **The writer**: one agent (name it, e.g. pipeline@PrompTugal.angelo or the existing crm@PrompTugal.angelo: recommend) with a small tool (append an event, rebuild the index, push); how each team member asks it (a commit, their own agent, Angelo's meetings workflow step 4); how a browser write comes later (WS-189 q4, WS-217's drop box idea): one answer for both.
4. **The first import**: WS-217's sealed follow-up list (Indi's 19, already in our stages): how it moves into pipeline/ and the follow-ups page and record retire. Its record is sealed; Angelo's decision says no sealing: say how that is reconciled (with Indi's and Dinis's agreement).
5. **Security and privacy**: who holds the key (people and their conductors and CRM agents: say it plainly), tokens, consent field, the deletion path (an event "redact" is not deletion: what is removed and how vault history is handled), nothing in this public repository.
6. **Build steps**: each a worker step (role, size, files, done when), smallest useful version first.
7. **proposal-dinis.md**: a draft for Angelo to send or relay (never sent by you): what we ask of Dinis (his go to change crm_app.html.tpl and crm.mjs under the five steps; one SG/Send token for the writer agent; his answer to browser writing), in plain words, under a page.
- **Not:** no change outside d2-spec/; no vault read or write; no message to anyone; no copy of other people's files (point to them).
- **Done when:** spec.md and proposal-dinis.md are on pool/crm-pipeline-d2, every path named exists, the gate prints OK (red only on check 21, lanes: say so and go on), STATE.md says "ready for Angelo's read".
