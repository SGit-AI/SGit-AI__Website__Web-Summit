# Watcher: latest run

**Run:** 2026-11-07 17:15 UTC (scheduled), by watcher@web-summit.jose. **Scope:** the whole team, read-only (decided by Jose on 5 November 2026, WS-134). The feed is `activity.json`; the actions are `actions.json`, both beside this file. **Addressed to:** Jose and conductor@web-summit.jose, which reads it at every wake.

**Range:** `dev` from `641fbc1` to `2c16db2`.

## Who committed

141 commits: 56 CI releases (counted), 1 by the watcher itself, none without an agent name, and 84 by agents: Angelo 44, Vicky 16, Dinis 14, Silvio 5, Jose 4, Indi 1. None is reviewed by security yet (last review `f4a9fbe`, 11:50; next 23:50).

## Open actions (re-checked every run)

1. **A-06, open for the tenth run, waiting on you:** the hourly drain counts only, but the conductor's wake, dev, dashboard and vault prompts are still the old text, and the one-day schedules you approved (C30) are not set. Automation's prompt also lacks the one-door step, and mine the measure step (I measure anyway). Everything to paste is in `people/jose/schedules.md`.
2. **A-14, seventh run: dev@web-summit.dinis.** No commit in about 41 hours. For conductor@web-summit.dinis.
3. **A-15, sixth run: dashboard@web-summit.dinis.** No commit in about 34 hours. For conductor@web-summit.dinis.

Closed: A-20 (Silvio's inbox agent committed at 17:12).

Late by one slot, re-checked at 22:15: conductor@web-summit.indi (12:20), Angelo's CRM agent (15:50), sgit@web-summit.dinis (16:50), procurement@web-summit.silvio (12:30).

## What to look at

1. **High, open for the eleventh run:** `content/family-riskmandate-agent.md` lines 6, 18 and 32 (from `f20d264`) still match the rule "an email address".
2. **Medium, still open:** the public session branch `claude/optimistic-feynman-7pkot9` (`dc306d7`), `board/WS-26-*` line 16.
3. **Note: Angelo's worker agents now work on five `workers/*` branches** (dev.links, dev.map, dev.venues, research, vault.kms), not on `dev`. Their own commits hold only agent names (no real address, key or token) and add only `people/angelo/` files, except one on `workers/vault.kms` that levels the branch with `dev`. The other agents' commits on `workers/dev.venues` are copies of `dev` commits. `workers/vault.kms` carries a proposed KMS policy patch (`6f8238a`) in Angelo's proposals folder, not applied.
4. **Note:** 133 email-rule lines in 33 commits on `dev`, all PrompTugal-style agent names. Writes outside the lane: Angelo's helper (`content/help.md`), Silvio's outreach agent (three board files). Listed, not judged.

## The checks

- **Jose's agents:** 4 commits (dashboard, dev 3), every one with `Reviewed-by`. All their scheduled tasks fired on time.
- **Other branches:** nothing new on `main`.
- **The Sonnet trial for the watcher has not started:** this run still ran on Opus (its ledger line).

## Could not check

- Scheduled tasks in other people's accounts; work in other repositories (the newsroom).
- The agents' run logs in the public vault `aym98gsm`: no `sgit` client yet.
