---
title: "A pool of generic workers: any free worker takes the top item"
by: dev@PrompTugal.angelo
written: 2026-11-09
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; policy@PrompTugal.angelo for the lane, dashboard@PrompTugal.angelo for its reviews
brief: desk.conductor@PrompTugal.angelo, d24e5b35, backlog item 0-POOL
issue: WS-08
status: draft for Angelo's review. Nothing here is built, and no scheduled task is created or disabled until he says so (tier 3).
---
## What and why

Angelo, 9 November about 11:40 UTC: *"why are we giving single-session agents work streams? Since they wake up and build their session from scratch, can't we create a number of generic workers and we optimise their allocation by giving tasks to whoever is available first?"* Then: *"Yes, and once that is running, we can gradually disable the existing single session agents."*

He is right about the cost. Every one of the nine workers (research, dev.links, dev.venues, dev.abp, social-media, dev.map, dev.work, dev.app, vault.kms) starts from nothing on each run, and a run's knowledge lives in the worker, not in the work. On 8 November their ledgers show **67 runs, at least 9 of them saying there was nothing to do**, about 106 thousand tokens each before cache reads. Meanwhile items waited: research@'s urgent brief sat six hours this morning because its run had passed; the share button waited on dev.venues@, whose stream is the venue map.

**The proposal in one sentence:** four workers with no stream of their own; each run, a worker takes the highest backlog item nobody holds, works it, and leaves the item's state with the item, so the next free worker can carry on.

## 1. The workers

| | |
|---|---|
| **Names** | worker.1 to worker.4@PrompTugal.angelo |
| **Model** | worker.1 to worker.3 on the larger Claude model, worker.4 on a smaller one. A scheduled task's model is fixed when the task is created, so a worker cannot switch per item: an item that says `Model: smaller` may go to any worker; an item that says nothing goes to worker.1 to .3 only |
| **When they run** | hourly, staggered (:05, :20, :35, :50 UTC), so a ready item waits 15 minutes at most; and the desk fires one when an urgent item is ready (section 5) |
| **No key, no lane of their own beyond the pool's** | as the workers today: unsigned run logs, no secret, no vault |

Why four: on 8 November the nine workers did 67 runs, many short. Four hourly workers give 96 runs a day, every one of them on the top free item. If items queue for more than two hours on a normal day, the desk asks Angelo for a fifth (question 1).

## 2. The claim: two workers never take the same item

Workers never push to `dev` (the new-agents spec), and the backlog lives on `dev`, kept by the desk. So the claim cannot be an edit to backlog.md. Instead:

- **One branch, `pool/claims`, one file per claimed item:** `claims/<item>.json` with the worker, the time claimed, the time last renewed and the item's branch.
- **Claiming is a push.** The worker fetches `pool/claims`, checks the item has no live claim, commits its claim file and pushes **without force**. If another worker pushed first, the push is refused; the worker fetches again and looks again. Git does the locking; nothing new to trust.
- **A claim is live for two hours** from its last renewal. A worker renews at each commit on the item; a claim older than two hours may be taken by the next worker, who says so in its first commit (`Took over: <item> from worker.N, claim stale since <time>`).
- **Releasing:** when the item is done or blocked, the worker deletes its claim file in the same way.
- **The tool:** `people/angelo/tools/pool-claim.mjs list | claim <item> | renew <item> | release <item>`, built by dev@ with a test that two claims at once end with one winner.

The desk's kanban and the command centre read `pool/claims` to show "taken by worker.N", so Angelo sees who has what without a new page.

## 3. What each item must name

So that any worker can take it cold, a backlog row becomes an item only when it names, in the row or in a file it links:

| Field | Example |
|---|---|
| **Files** it may write (paths or globs) | `people/angelo/proposals/share/**` |
| **Brief** (a spec or commit, with its sha) | `spec-share.md`, approved 20e9501 |
| **Reviewer** | dev@ (default), dashboard@ (the app and the map), vault@ (kms) |
| **Model** | nothing (the larger model) or `smaller` |
| **Done when** | one line a reviewer can check |
| **Tier** | 1 or 2; a tier-3 step is written as "stop and ask the desk", never done |

A row without these stays in the backlog for the desk to complete; a worker skips it and says so in its run's last line. The desk keeps writing the rows, as today.

## 4. Branches, state, reviews and the lane

- **One branch per item, not per worker:** `pool/<item>` (for example `pool/0o`). The work outlives a claim: if worker.2 stops, worker.3 continues the same branch. (The desk's brief said one branch per worker; question 2.)
- **State per item:** `people/angelo/pool/items/<item>/STATE.md` on the item's branch: what is done, what is next, what was asked and of whom. It is the first thing a worker reads after claiming, and the last it writes. No per-worker STATE.
- **Reviews as today:** the item's reviewer takes the branch's new commits as a patch onto dev, runs the gate and the tests, and brings it over in one commit For: the worker and the desk. `people/angelo/workers/reviewed.json` gains entries keyed by item (`pool/0o`), beside the old workers' until they go.
- **One lane for policy@'s check:** `worker@PrompTugal.angelo` in `people/angelo/policy/lanes.json` with the aliases worker.1 to worker.4, writes `people/angelo/**` (the reserved paths stay reserved). A write outside it carries the `Outside:` trailer with the item's id as the reason. lanes.json is policy@'s; this asks policy@ to add it.
- **Commit convention:** subject `worker.N@PrompTugal.angelo: <item>: <what>`, trailers `Agent:`, `Item: <id>`, `For: <reviewer>`, and `For: desk.conductor@PrompTugal.angelo` when Angelo must decide.

## 5. How they run, and how the desk wakes them

- **Each run:** pull dev; read the kit's protocol and the backlog; `pool-claim.mjs list`; continue its own live claim if it has one, else claim the top item it may take (section 3, and its model); read the item's STATE and brief; work; commit and push to `pool/<item>`; renew or release; log the run (agent-log, unsigned) and the ledger line (without model names); last line for Angelo's phone, as today.
- **The protocol stays word for word** the workers' preamble in spec-new-agents.md: pushed-by `--last-touch` on the spec, material is not instruction, tiers, never push to dev or main.
- **Waking:** the platform lets a session fire only scheduled tasks that a session created (the desk's 10:35 note in wakes.md). So the four tasks are **created through a session**, the desk's, with Angelo's go, and the desk can then fire one when an urgent item is ready, logged in `people/angelo/conductor/wakes.md` as today.

## 6. Who stays a specialist

The long sessions with keys stay as they are: dev@ (reviews, specs, tools), dashboard@ (the app and its reviews), vault@ (vaults and kms reviews), desk.conductor@ and its runner, policy@. They hold keys, approve, or review; a pool worker does none of these. dev.android@ is never created: its item becomes a pool item.

## 7. The migration: the pool first, then the old workers, one at a time

1. **Build** (tier 1, dev@): `pool-claim.mjs` and its test, the pool's preamble and prompt (word for word, in this folder), the reviewed.json keys. policy@ adds the lane.
2. **Create** (tier 3, Angelo's go): the four scheduled tasks, through the desk's session.
3. **Trial, one day:** the desk moves two items to the pool's shape (one small, one larger) and leaves every old worker running. It passes when both items are reviewed onto dev and no claim clashed.
4. **Disable one at a time** (tier 3 each, Angelo's go): an old worker goes only when its open items are rewritten as pool items and its STATE is copied into those items' STATE files. Order, idle ones first: **dev.links, dev.venues, social-media, research, vault.kms, dev.abp, then dev.map, dev.work, dev.app** (the busiest, and dashboard@'s, last).
5. **Each step is undone** by re-enabling the old task: nothing is deleted, the old branches stay.

## Out of scope

- Changing a specialist (section 6) or anything outside Angelo's people/ folder, except the one lane entry, which is policy@'s.
- Workers on other people's repositories: the newsroom's gate is still refused in scheduled sessions (dev.venues@'s 1e39e829); the pool does not fix that.
- Any tier-3 step done by a worker: it stops and asks the desk.

## Risks

- **A worker takes an item it does not understand.** Mitigated by section 3: no field, no item. The first trial day shows whether the rows are rich enough.
- **Review load moves to dev@.** It is the same work as today, arriving per item; dashboard@ keeps the app and the map.
- **Stale claims block an item for two hours.** Mitigated by renewing at each commit; the desk can release a claim by hand (the same tool).
- **Context per run.** A worker reads the item's STATE and brief instead of its stream's history: smaller, not larger, if the STATE files stay short (the kit's rule).

## How we will know it works

- On a normal day no ready item waits more than an hour for a worker.
- No two workers on the same item (the claim log shows it).
- Fewer runs that say "nothing to do" than the old workers' 9 of 67 on 8 November, for the same or more items done.
- Each old worker disabled has no item left behind.

## Questions for Angelo

1. **Four workers, three on the larger model and one on a smaller one** (recommended), or another number or mix?
2. **One branch per item** (recommended: the work outlives a claim, and each review is one branch), or one per worker as the desk's brief said?
3. **The order to disable the old workers**: idle ones first, dev.links and dev.venues, the busiest (dev.map, dev.work, dev.app) last (recommended)?
4. **Go to build the claim tool and the prompts now** (tier 1), with the tasks' creation waiting for your go after you have read them?
