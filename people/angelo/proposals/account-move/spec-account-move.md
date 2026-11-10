---
title: "Moving Angelo's agents to his second account: which ones, and the hand-over"
by: desk.conductor@PrompTugal.angelo
written: 2026-11-10
status: a plan for Angelo's review, revised at his word the same morning (the pool on B, named by the phonetic alphabet); nothing moves until he answers its questions and sets up the account
asked_by: Angelo, 10 November about 11:40 UTC ("I have a new account where I can transfer workload to, like other in the team have done, can you get updates and prepare a handover process for me?")
model: Dinis's account move (PrompTugal newsroom, board/the-account-move.md and board/guidance/2026-11-06-account-b.md, 6 November)
---
# Moving Angelo's agents to account B

**Why.** To spread the load across two subscriptions, as Dinis did on 6 November. His first wave halved the load on his main account without slowing any agent or lowering its model.

## Angelo's direction (10 November, about 11:50 UTC)

*"In the new account we should lean in to the on-demand, single-session, worker agents approach."* Then: *"Let's give the worker agents names following the expanded alphabet of alpha bravo charlie etc."*

So account B does **not** take the old workstream agents one by one. It is where **the worker pool** (approved 9 November, people/angelo/proposals/worker-pool/) is born:
- **Generic workers**, each a fresh single session per run. No workstream, no key, no memory but the repository.
- **Each run**, a worker takes the highest backlog item nobody holds (`pool-claim.mjs`, which already accepts any `<name>@PrompTugal.angelo`), works it, leaves its state with the item, and ends.
- **Named by the phonetic alphabet:** `alpha@PrompTugal.angelo`, `bravo@`, `charlie@`, `delta@`, `echo@`, `foxtrot@`, and on through `zulu@` as the pool grows. They replace the pool spec's `worker.1@` to `worker.4@`.
- **Three to skip, to avoid confusion:** **india** (Indi is a person on the team), **xray** (RiskMandate X-ray) and **alpha** (a Web Summit pass type). *Recommendation: skip india and xray; keep alpha, which reads clearly as the first worker.*
- **On demand:** a worker that finds nothing it may take ends at once, cheaply. Two ways to run them on B:
  - **(a)** each worker's task has a slow fallback (every two hours, staggered) **plus** Angelo's Run now when something is urgent;
  - **(b)** no schedule: Run now only.

  The desk cannot fire tasks on B, so with (b) nothing moves unless Angelo taps. *Recommendation: (a).*
- **The old workstream agents** on this account (dev.map@, dev.work@, dev.app@, dev.venues@, dev.links@, dev.abp@, research@, social-media@, vault.kms@) are **retired as the pool takes their rows**. The pool spec's section 7 gives the order: paused first, archived later, never moved.
- **Specialists stay where they are.** The desk, runner.conductor@, dev@ and dashboard@ (the reviewers), the writer (with Angelo), and vault@ and crm@ (sealed tokens). The workers' rows name dev@ or dashboard@ as Reviewer.

The list and waves below are the general rule, kept for the long sessions (wave 2). For the fresh-session work, the pool replaces wave 1.

## What decides who can move

An agent can move if it works through **the repository** only: commits, the backlog, its STATE file. It must stay if it uses **this account's session tools**, which do not reach across accounts:
- reading or firing this account's scheduled tasks, or creating sessions: the desk;
- an SG/Send token or vault keys sealed to its current session key: vault@ and crm@. Moving them means re-sealing (tier 3) and a security review.

**The one new thing for us: the push check.** Every worker acts on a desk commit only if `people/angelo/tools/pushed-by.mjs` says it was pushed from Angelo's GitHub logins: `riskmandate-angelo` or `the-neuronin` (line 15). If account B's GitHub connection uses one of these logins, nothing changes. If it uses a **new** login, that login must be added to the list first (dev@'s change, tier 3, Angelo's word). Otherwise every moved agent's own commits, and anything the desk routes through them, read as NOT-ANGELO.

## The list

| Agent | Session | Key or token | Move? | Why |
|---|---|---|---|---|
| dev.abp@ | fresh each run | none | **wave 1** | the restart's demos; repository only |
| research@ | fresh each run | none | **wave 1** | repository and the public web only |
| runner.writer@ | fresh each run | none | **wave 1** | reads the newsroom, writes one STATE file |
| dev.map@, dev.work@, dev.app@, dev.venues@, dev.links@, social-media@ | fresh each run | none | **wave 1, paused** | recreated on B **paused**, enabled when there is work |
| vault.kms@ | fresh each run | none | wave 1, paused | its reviewer vault@ stays on A, which is fine: they talk by commits |
| dashboard@ | long session | session key | **wave 2** | needs a hand-over debrief and a new key; it reviews the map and app workers |
| dev@ | long session | session key | **wave 2** | the reviewer of most workers and the snapshot refresher; moves after wave 1 runs clean |
| writer@ | long session, with Angelo | newsroom signing key | wave 2 | Angelo opens it on B when he next writes; a new key published on both sites' keys pages |
| policy@, helper@, team-collaboration@ | long sessions | session keys | wave 2 or retire | light; after the restart team-collaboration@ and helper@ may simply be retired |
| runner.conductor@ | fresh each run | none | **stays** | it reports to the desk and to Angelo's phone on this account |
| **the desk** (this session) | long session | none | **stays** | it reads and fires this account's tasks; it cannot see account B's |
| vault@, crm@ | long sessions | sealed tokens | **stays** | re-sealing is tier 3 and needs Dinis's security review |

Fresh-session workers are the easy part: same prompt, a new scheduled task on B, the old one paused. The worker pool (approved 9 November, people/angelo/proposals/worker-pool/) could be **born on B** instead of moving the old workers one by one.

## Once, before the first agent (Angelo, in account B)

1. **GitHub:** connect GitHub, with push to `SGit-AI/SGit-AI__Website__Web-Summit`. Push to the newsroom (`PrompTugal/PrompTugal__News__Website`) only for writer@ and dev.venues@'s newsroom work. **Tell the desk which GitHub login it uses** (see the push check above).
2. **An environment** like this account's "PrompTugal.angelo shared": no secrets for wave 1. Network as here; the setup script the same, if there is one. You enter variables by name in the app, never in a chat.
3. **Tell the desk** it is ready. The desk records account B in the backlog and in agents.json (`account: "B"`).

## Per agent (wave 1: fresh-session workers)

1. **The desk** writes the agent's task for B in `people/angelo/proposals/account-move/tasks/<agent>.md`, from its current task: its name, its cron, its model and the prompt **word for word**, plus "you are on account B: talk only through commits; nothing changes in your job".
2. **Angelo, in account B:** "Create a scheduled task" with that name, cron, model and prompt, paused or enabled as the file says. He can also start a session on B and paste the file, and that session creates the task if B's safety check allows it.
3. **Angelo, in this account:** pauses the old task (same name) at https://claude.ai/code/routines.
4. **The desk**, next time Angelo asks for updates: checks the agent's first commit from B (gate OK; pushed-by says ANGELO) and records it in `people/angelo/conductor/wakes.md` and the backlog's banner.

**Done when:** its first run on B commits and passes the gate, pushed-by says ANGELO, and the old task is paused.

## Per agent (wave 2: long sessions with a key)

As CLAUDE.md's hand-over and Dinis's plan:
1. The old session writes its **hand-over debrief** (`people/angelo/<area>/handover-<date>.md`: what it holds, what is open, what it knows).
2. The desk writes its first prompt for B.
3. Angelo starts the session on B with it, and creates its task.
4. The new session makes **its own session key** and publishes the public half in `data/keys.json`, the old entry marked superseded.
5. Angelo pauses, then archives, the old session.

## What it changes for Angelo

- The desk stays here. Your digests and decisions work as now: everything still meets in the repository.
- **Wakes:** the desk cannot fire account B's tasks, so "Run now" for a moved agent is yours, in account B.
- **Two accounts' limits:** wave 1 is most of today's scheduled work (dev.abp, research and the workers).

## Questions for Angelo

1. Which **GitHub login** will account B use? (The push check, above.)
2. **How many workers to start:** *recommendation: four, alpha, bravo, charlie and delta, three on the larger model and delta on the smaller; more when the backlog needs it.*
3. **Names to skip:** india and xray, as recommended? Or the full alphabet?
4. **Run (a)**, a slow fallback plus Run now, or **(b)**, Run now only?
5. **The first rows for the pool**, after the restart: the RiskMandate demos (dev.abp@'s work: more scenarios, the shared scenario file for the apps, the approve button), research@'s rows and the map's remaining items. Each row gets its Files, Brief, Reviewer, Model and Done when (pool spec section 3) before a worker may take it.
