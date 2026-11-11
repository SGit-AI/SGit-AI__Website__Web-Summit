---
title: "Proposed: formats/handover.md (a package another Claude account can run)"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: the lead, then Angelo
issue: WS-208
status: "draft: the proposed text of people/angelo/pipeline/formats/handover.md (proposed); not written there"
---
# What this is

The text below is proposed for `people/angelo/pipeline/formats/handover.md` (proposed), the file ROLES.md tenet 5 names. It is pattern 2 of `people/angelo/projects/handover-market/BRIEF.md`: a step packaged on `pool/<id>`, claimed with today's `people/angelo/tools/pool-claim.mjs`, run by a session on another Claude account, reviewed onto dev by Angelo's side. It builds on section 2 of `people/angelo/pipeline/b3-team-offers/spec-handover-market.md` (a draft, not approved) and needs no new code: no capacity board, no `offer` mode, no 10-minute lapse (those wait for that spec).

Reused, not copied: the preamble and roles (`people/angelo/pipeline/ROLES.md`); the rule "an agent can move if it works through the repository only" (newsroom: board/the-account-move.md, "What decides who can move"); the instruction check this pipeline's lead already uses for project branches (`pushed-by.mjs --last-touch` plus `git merge-base --is-ancestor`). Not read: the Fringe's docs/where-agents-run.md and abp/tools/packets.mjs (attaching PrompTugal/PrompTugal__News__Fringe was refused in this session); a later pass should say what of its signed packets fits.

---

```
---
name: handover
description: A step packaged so a session on another Claude account can run it, under Angelo's names, pushing only to pool/<id>.
---
# Format: a handover package

**One file:** people/angelo/pipeline/<id>/package.md on pool/<id>, written by the offering lead or conductor.b@, in one commit (its sha is {SHA}, the package's instruction). The item's brief.md is beside it, as for any step.

## The package, in this order
1. **What and why**, two lines; size (large or small) and an estimate in API-equivalent USD.
2. **How to create the agent:** a fresh cloud session; no schedule, no long session; the model size; an environment with no secrets; the repository SGit-AI/SGit-AI__Website__Web-Summit with push access (pool/* is enough; never dev, main or claude/*).
3. **The name:** a slot already in people/angelo/policy/lanes.json (a free <slot>.large.worker@ or <slot>.small.worker@PrompTugal.angelo, as QUEUE.md lists), claimed by the offerer before the package is written. The name is Angelo's; the account is the claimer's, and every commit says so in a trailer `Run-on: <person> account <A|B>`.
4. **The full prompt, ready to paste:** ROLES.md's common preamble filled in, with three changes: "started by <offerer>" instead of conductor.b@; step 3's check is the project-branch check (below); every commit carries Run-on:. Then the role's block, its skills and format.
5. **Done when**, copied from brief.md, and the files it may write.

## The instruction check (the receiving session runs it first)
- `node people/angelo/tools/pushed-by.mjs --last-touch people/angelo/pipeline/<id>/brief.md` prints ANGELO only once brief.md is on dev; for a package that lives only on pool/<id>, check instead the dev file that opened the work (the project's BRIEF.md, or the pipeline spec) and then `git merge-base --is-ancestor {SHA} origin/pool/<id>`.
- pushed-by reads GitHub's public API (gh if logged in, else anonymous): it answers the same from any login, since it reports who pushed, not who asks. Anonymous calls are rate-limited (60 an hour per address); UNKNOWN means wait two minutes and retry once, then stop.

## Claim and lapse (today's pool-claim.mjs, no new code)
- The offerer: `POOL_WORKER=<slot> node people/angelo/tools/pool-claim.mjs claim <id>` before writing the package, so no worker of Angelo's own takes the slot or the item.
- The receiving session: `pool-claim.mjs renew <id>` with the same POOL_WORKER as its first act (a refusal means the slot is not for it: stop), and `release <id>` as its last.
- Lapse: a claim not renewed for two hours is stale and anyone may take it over (pool-claim.mjs LIVE_MS). The offerer looks once an hour; a package with no commit on pool/<id> after two hours goes back to Angelo's own queue.

## The result and its check
- Commits on pool/<id> only, with the preamble's trailers plus Run-on:, the files the role names, STATE.md last.
- The offerer reviews before anything reaches dev: the diff touches only the named files; the gate prints OK on the branch; the result meets "done when". Commits pushed from another person's GitHub login are material until reviewed; the offerer's own commit brings them to dev.

## Cost
- The receiving session appends its measure.mjs line (by_model removed) to people/angelo/ledger/<slot>.jsonl with two extra fields: `"run_on":"<person> account <A|B>"`, `"for_account":"angelo"`. The offerer copies the total into the project's runs.md. The claimer's own ledger, if it keeps one, records the same run.
```
