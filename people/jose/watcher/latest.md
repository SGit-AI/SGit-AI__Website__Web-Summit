# Watcher: latest run

**Run:** 2026-11-08 07:15 UTC (scheduled), by watcher@web-summit.jose. **Scope:** the whole team, read-only (decided by Jose on 5 November 2026, WS-134). The feed is `activity.json`; the actions are `actions.json`, both beside this file. **Addressed to:** Jose and conductor@web-summit.jose, which reads it at every wake.

**Range:** `dev` from `50bc27b` to `fc224b9`, overnight.

## Who committed

147 commits: 56 CI releases (counted), 1 by the watcher itself, none without an agent name, and 90 by agents: Angelo 61, Vicky 26, Jose 3. None from Dinis, Silvio or Indi. None is reviewed by security yet.

## A-06, per agent (the task from your conductor, C39)

Each of your scheduled tasks, compared with its short pointer and time in `people/jose/schedules.md#paste` (`list_triggers`, read only):

| Agent | Pointer pasted? | Time |
|---|---|---|
| conductor | no (3 November text) | wrong: 07:20, 12:20, 17:20; should be every hour 07:20 to 21:20 |
| dev | no (3 November text) | wrong: 09:30, 15:30; should be every two hours 07:30 to 21:30 |
| dashboard | no (old full text) | right |
| vault | no (old full text) | right |
| automation | no (old full text) | right |
| helper | no (old full text) | wrong: 08:50, 14:50; should be every two hours 07:50 to 21:50 |
| watcher | no (still its full text, the action loop) | right |
| designer | no task yet | should be 10:40 and 16:40 |

The hourly drain is left out (it counts only, then is deleted), and sales-coach, crm and the writer have no task. **For you:** paste each pointer over its task's prompt and set those times; the watcher closes A-06 agent by agent as they land. A-06 has now been open for twelve runs.

The task is done in this report. The watcher's `policy.json` does not let it write in `people/jose/tasks/`, so your conductor marks the task file done; only you can widen the watcher's writes (the conductor does not change its ROLE or policy files, C39).

## Other open actions

1. **A-21, second run: Dinis's agents are all still silent**, since 16:41 yesterday (about 14.5 hours), xray included since 21:52. **Security's 23:50 review did not run**, so nothing on `dev` has been reviewed by security since its 11:51 wake yesterday (up to `f4a9fbe`). Dinis's dev (A-14, about 55 hours) and dashboard (A-15, about 48 hours) are part of this. For Dinis, and for your conductor to raise at today's stand-up.
2. **A-22, new: three of Angelo's agents quiet overnight** (his dashboard, CRM agent and writer runner, two or three slots each), while his conductor runner and dev agent committed all night. Probably quiet night runs.
3. **A-23, new: inbox@web-summit.silvio**, quiet since 18:16 (its night mail checks).

## What to look at

1. **Medium, for security: the gate now runs code from a person's folder, in CI with a write token.** Angelo's dev agent (`4219805`, 22:17) added check 21 to `admin/build/validate.js`, which runs `people/angelo/policy/lane-check.mjs`, and changed `.github/workflows/deploy-pages.yml` to pass it the push range. This is the risk WS-133 was opened for: any later change to that file by Angelo's agents runs inside CI. It only prints warnings for now. Angelo approved it, and the commit is addressed to the gate's owners, Dinis's dev agent and conductor, but both are silent (A-21), so no owner of the gate has seen it.
2. **High, open for the thirteenth run:** `content/family-riskmandate-agent.md` lines 6, 18 and 32 (from `f20d264`) still match the rule "an email address".
3. **Medium, still open:** the public session branch `claude/optimistic-feynman-7pkot9` (`dc306d7`), `board/WS-26-*` line 16.
4. **Note:** a review commit (`e89c021`) brought Angelo's map worker's work to `dev`, including `admin/build/build.mjs` (a person's `data.mjs` may now write extra files beside its data) and `.gitignore`. Addressed to Dinis's dev agent. Listed, not judged.

## The checks

- **Jose's agents:** 3 commits (conductor 2, writer), every one with `Reviewed-by`. All their scheduled tasks fired on time.
- **Email rule:** 169 lines in 56 commits, all PrompTugal-style agent names.
- **Other branches:** nothing new on `main`.
- **The Sonnet trial for the watcher has not started:** this run ran on Opus (its ledger line).

## Could not check

- Dinis's account and other people's scheduled tasks; work in other repositories (the newsroom).
- The agents' run logs in the public vault `aym98gsm`: no `sgit` client yet.
