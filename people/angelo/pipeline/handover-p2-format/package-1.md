---
title: "Package 1: check that every path the pipeline library names exists"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: the lead, then Angelo; then a session on another Claude account
issue: WS-208
status: "draft, written to handover.md (this folder); not offered, not claimed"
---
# Package 1: handover-x1-paths (proposed item id)

**For the lead, before offering:** copy this file to people/angelo/pipeline/handover-x1-paths/package.md (proposed) on a new branch pool/handover-x1-paths (proposed), with a brief.md holding the "Do" and "Done when" below; claim the slot (`POOL_WORKER=golf.large.worker@PrompTugal.angelo node people/angelo/tools/pool-claim.mjs claim handover-x1-paths`); fill {SHA} with that commit. Golf is in lanes.json but not on QUEUE.md's "may run now" list: the lead or Angelo picks the slot.

## 1. What and why
The pipeline's rule is "every path named exists" (people/angelo/pipeline/formats/web-summit-site.md), yet ROLES.md tenet 5 names formats/handover.md, which does not exist, and a quick grep in this run found six paths in ROLES.md, QUEUE.md, skills/ and formats/ that are not in this repository (some belong to the newsroom or the Fringe and are unmarked). Angelo's workers read these files every run; a wrong path costs each of them. Read-only, small, low risk. **Size:** large slot (it reads three repositories), about 0.5 to 1.5 USD API-equivalent (estimate, from the b0-library run: 83,330 tokens for a larger spec, people/angelo/estimates/alpha.large.worker-promptugal.angelo.jsonl).

## 2. How to create the agent
A fresh Claude Code cloud session on the claimer's account: no schedule; large model; an environment with no secrets; the repository SGit-AI/SGit-AI__Website__Web-Summit attached with push access. Public read (no attach needed) of PrompTugal/PrompTugal__News__Website and PrompTugal/PrompTugal__News__Fringe.

## 3. The name
golf.large.worker@PrompTugal.angelo (or the slot the lead claims). Every commit: trailer `Run-on: <person> account <A|B>`.

## 4. The prompt, ready to paste
ROLES.md's common preamble, with {SLOT} = the name above, {ROLE} = research, {ID} = handover-x1-paths, {SKILLS} = researcher, analyst, {FORMAT} = web-summit-site, {SHA} = the lead's package commit, and these changes:
- "started by conductor.b@PrompTugal.angelo" reads "started by handover-market.pm@PrompTugal.angelo, offered to another Claude account (people/angelo/pipeline/formats/handover.md, proposed)".
- Step 3 reads: "(a) node people/angelo/tools/pushed-by.mjs --last-touch people/angelo/projects/handover-market/BRIEF.md must say ANGELO; (b) git fetch origin pool/handover-x1-paths and git merge-base --is-ancestor {SHA} origin/pool/handover-x1-paths must succeed. Either fails: end with Blocked."
- Step 4 adds: "First, POOL_WORKER={SLOT} node people/angelo/tools/pool-claim.mjs renew handover-x1-paths; refused: stop. Last, release it."
- Step 8 adds the trailer `Run-on: <person> account <A|B>`; For: handover-market.pm@PrompTugal.angelo.
- Step 10 adds `"run_on"` and `"for_account":"angelo"` to the ledger line.

Then ROLES.md's research block, and:
```
Do: list every file path named in people/angelo/pipeline/ROLES.md, QUEUE.md, skills/*.md and formats/*.md (with a prefix such as people/, admin/, content/, team/, board/, data/, or relative such as formats/x.md). For each: exists here; exists in the newsroom (PrompTugal/PrompTugal__News__Website, dev) or the Fringe (PrompTugal/PrompTugal__News__Fringe, default branch), so it should be marked "newsroom:" or "fringe:"; or exists nowhere. Templates ({ID}, <slot>) and globs are skipped. Change no file outside handover-x1-paths/.
Writes: people/angelo/pipeline/handover-x1-paths/research.md, STATE.md.
research.md: the counts first (named, here, other repository, nowhere), then one row per path that is not here: file and line, path, where found, the fix you recommend. The commands you ran, so the lead can repeat them.
Done when: research.md is on pool/handover-x1-paths, every row has a file and line, and the lead can re-run the commands and get the same counts.
```

## 5. The result and its check (the lead)
The diff touches only handover-x1-paths/ and the slot's estimates and ledger files; the gate prints OK on the branch; re-running the listed commands gives the same counts; the ledger line has run_on. Fixes to the library are a separate step for Angelo's own workers.

## What the receiving side must have
| Need | Why | If not |
|---|---|---|
| GitHub write to SGit-AI/SGit-AI__Website__Web-Summit | push pool/handover-x1-paths and renew on pool/claims | GitHub cannot limit a writer to pool/*: the limit is the prompt and the review. Granting access is an admin act: tier 3 (Angelo's) |
| Public read of the newsroom and the Fringe | the "other repository" column | rows say "not checked" |
| pushed-by from another login | the instruction check | it works from any login (public API, tested here: HTTP 200 anonymously); it says ANGELO for Angelo's pushes whoever asks. The worker's own pushes from another login will read NOT-ANGELO on dev checks: they never go to dev, and the lead's review commit does |
| A lane | people/angelo/policy/lanes.json covers golf.large.worker@ (pipeline/**, plus the common estimates and ledger paths) | nothing to add for paths; policy@ decides whether Run-on: commits pushed from another login are accepted |
| Usage on the claimer's account | about 1 USD | it waits; the claim goes stale after two hours |
