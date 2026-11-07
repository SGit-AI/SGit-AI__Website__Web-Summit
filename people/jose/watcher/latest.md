# Watcher: latest run

**Run:** 2026-11-07 12:15 UTC (scheduled), by watcher@web-summit.jose. **Scope:** the whole team, read-only (decided by Jose on 5 November 2026, WS-134). The feed is `activity.json`; the actions are `actions.json`, both beside this file. **Addressed to:** Jose and conductor@web-summit.jose, which reads it at every wake.

**Range:** `dev` from `6ad2db9` to `641fbc1`.

## Who committed

186 commits: 68 CI releases (counted), 1 by the watcher itself, none without an agent name, and 117 by agents: Angelo 57, Vicky 31, Dinis 15, Jose 9, Silvio 3, Indi 2. Security's 11:50 review (`f4a9fbe`) covers 105 of them.

## Open actions (re-checked every run)

1. **A-06, open for the ninth run: progress.** Your conductor changed the hourly drain's stored prompt to count only (11:27, C30), so it no longer pushes a vault. Still for you: the conductor's wake, dev, dashboard and vault prompts are the old text (automation's also lacks the one-door step, and the watcher's own lacks the measure step, which it does anyway), and the one-day schedules you approved (C30) are not set yet. The texts and times are in `people/jose/schedules.md`.
2. **A-14, sixth run: dev@web-summit.dinis.** No commit in about 36 hours. For conductor@web-summit.dinis.
3. **A-15, fifth run: dashboard@web-summit.dinis.** Nothing since 07:11 yesterday. For conductor@web-summit.dinis.
4. **A-20, new: inbox@web-summit.silvio**, quiet again since 04:20 (four mail-check slots). For conductor@web-summit.silvio: have it log its runs.

Closed: A-18 (Angelo's writer runner: its work shows under the writer's name, 7 commits this morning) and A-19 (Angelo's dashboard agent, 10:29).

## What to look at

1. **High, open for the tenth run:** `content/family-riskmandate-agent.md` lines 6, 18 and 32 (from `f20d264`) still match the rule "an email address".
2. **Medium, still open:** the public session branch `claude/optimistic-feynman-7pkot9` (`dc306d7`), `board/WS-26-*` line 16.
3. **Note: new branches outside `claude/*`.** Angelo's worker agents push to `workers/dev.map` (2 commits) and `workers/vault.kms` (1 commit), not to `dev`. They touch only `people/angelo/` files and match no rule, but CLAUDE.md says agents push to `dev` only. For Angelo's conductor to confirm.
4. **Fixed:** the vault audit now treats PrompTugal-style agent names as names, not addresses (`326b690`), the gap raised on 6 November. Its two phone-rule matches (lines 41 and 42) are its own self-test samples.
5. **Info:** you approved a one-day trial of the watcher on Sonnet (C30). You switch the model in this session; this run still ran on Opus (its ledger line), so the trial has not started. The accountant compares it tomorrow morning.

## The checks

- **Jose's agents:** 9 commits (conductor 5, dashboard, helper, dev, vault), every one with `Reviewed-by`. All their scheduled tasks fired on time.
- **Email rule:** 183 lines in 60 commits, all PrompTugal-style agent names; none is a real mail domain.
- **Other branches:** nothing new on `main`; the two `workers/*` branches above.

## Could not check

- Scheduled tasks in other people's accounts; work in other repositories (the newsroom).
- The agents' run logs in the public vault `aym98gsm`: no `sgit` client yet.
