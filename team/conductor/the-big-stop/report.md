# THE BIG STOP: the report (as of 10 November 2026, 00:15 UTC)

Order: Dinis, 9 November, about 23:30 UTC. *"Stop all work (unless it is critical) until we realign on our strategy."* Compiled by conductor@web-summit.dinis from each conductor's own stop report.

## The timeline

| UTC | What |
|---|---|
| ~23:30 | Dinis gives the order in the main conductor's session |
| 23:35:07-08 | Account A: the main conductor pauses 6 of 7 scheduled wakes (Android, PrompTugal conductor, security@, accountant@, observability@, security.repos@) |
| 23:35:20 | The main conductor slows its own wake from hourly to every 2 hours |
| 23:36 | The order is on every board: the team site (a commit addressed to every conductor), PrompTugal's guidance, the iOS `briefs/`, Indi's conductor's lane |
| 23:36 | mobile@ stops (all committed, 7f59d91); security.repos@ records where it stopped |
| 23:37 | conductor.android tells its 13 sessions to stop (all already idle since 18:57); it stops itself at 23:41 |
| 23:40 | conductor@PrompTugal.dinis files its stop report |
| 23:49:31-35 | Account B: conductor.b@ reads the order at its 23:48 wake and pauses 12 scheduled agents in 4 seconds; slows itself to every 2 hours |
| 00:03 | The iOS conductor reads its brief at its 00:02 wake and pauses its :00 wake |

## Time to stop

| Where | Order seen | Everything paused | Time from the order |
|---|---|---|---|
| Account A (main conductor) | 23:30 | 23:35:08 | **5 min** |
| Android | 23:35:48 | 23:41 | 11 min (already idle) |
| Account B (conductor.b@) | 23:48 | 23:49:35 | **19 min** |
| iOS conductor (account B) | 00:02 | 00:03 | **33 min** |

The pausing itself takes seconds. **The delay is the wake cadence:** a conductor that only reads the board at its next wake hears the order up to an hour later, and account B cannot be messaged from account A.

## Before and after

| | Before (23:30) | After (00:15) |
|---|---|---|
| Account A scheduled wakes | 7 (about 58 runs a day) | **1** (the main conductor, every 2 h: 12 a day) |
| Account B scheduled agents | 12 agents + conductor.b@ hourly + the iOS conductor hourly | **1** (conductor.b@, every 2 h) |
| Conductors running on a schedule | 5 (main, Android, PrompTugal, conductor.b@, iOS) | **2: one per account** (main on A, conductor.b@ on B) |
| Agents working on demand | many | gamma-ray@web-summit.dinis, with Dinis (by design) |
| Account B spend | ~13 USD an hour through the evening (conductor.b@'s ledger) | to be measured at the next ledger |

## What was not stopped, and why

- **Builds already queued:** iOS release #140, which carries the fix for the public app's failed 0.4.57 upload. The order let queued builds finish.
- **Apple's review** of the news app 0.4.24 (build 205): not ours to stop.
- **Dependabot** on the Android repository: GitHub's scheduler. Dinis can pause it in Settings.
- **An "@inbox session run" scheduled task on account B** (session_01494ENweZLCHUFJvzSn6qbR, next fire 01:49 UTC): neither the iOS conductor's nor clearly conductor.b@'s. **Dinis to say whose it is;** conductor.b@ to pause it if no one claims it.
- **The other people's teams** run on their own accounts and are theirs to stop or keep. After the order, Angelo's agents (dev@, dashboard@, writer@, desk.conductor@) and Vicky's (conductor@, researcher@, OVERNIGHT-10NOV, "started by hand") kept committing until at least 00:08. That is within the rule (each person may override); their conductors have not yet filed stop reports.

## Lessons

1. **A stop needs a path into each account that does not wait for a wake.** Either a person says "stop" in that account's conductor session, or every agent's wake reads a HOLD file first (PrompTugal's `board/HOLD.md` already does this). conductor@PrompTugal.dinis proposed both.
2. **One conductor per account** is enough to restart anything; the rota of five gave speed, at the price of five wakes an hour.
3. **Pausing beats deleting:** every wake was disabled, not deleted, so each person can switch one back in one call.

Stop reports:
- PrompTugal: `board/team/conductor/stop-report-2026-11-09.md` and `board/team/conductor.b/stop-report-2026-11-09.md`;
- iOS: `briefs/2026-11-09__the-big-stop/stop-report.md`;
- Android: `board/stop-report-2026-11-09.md`.
