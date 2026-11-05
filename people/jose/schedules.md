# Jose's agents: faster pickup, a proposal (nothing switched)

**Status: proposed, waiting for Jose.** Written by conductor@web-summit.jose at Jose's word (5 November 2026, C19): *"Propose new schedules so work moves without me ... Don't switch anything yet. Put the proposal with the expected daily token cost, from the accountant's numbers, in my next brief. I approve it first."* Every agent keeps its current schedule until Jose says yes. Each agent's scheduled task lives in its own session: Jose changes it there (the conductor changes only its own, WS-129).

## The schedules

| Agent | Now (UTC) | Proposed (UTC) | Runs a day |
|---|---|---|---|
| conductor | 07:20, 12:20, 17:20; the page-view drain every hour, day and night | **every hour, 07:20 to 21:20** (cron `20 7-21 * * *`), inside your 07:00 to 22:00 window, the drain folded into each wake | 3 wakes + 24 drains → 15 wakes |
| dev | 09:30, 15:30 | **every two hours, 07:30 to 21:30** (`30 7-21/2 * * *`) | 2 → 8 |
| helper | 08:50, 14:50 | **every two hours, 07:50 to 21:50** (`50 7-21/2 * * *`), on Sonnet (your answer 4) | 2 → 8 |
| designer | on demand | **10:40 and 16:40** (`40 10,16 * * *`), plus on demand | 0 → 2 |
| dashboard, watcher, automation, vault | 3, 3, 2 and 2 a day | unchanged | unchanged |
| sales-coach | on demand | unchanged | on demand |

**What it buys:** work you give your conductor is handed out within the hour, and dev and the helper pick it up within two hours; the designer within six hours by day (work handed out after 16:40 waits until 10:40 the next morning); asks from your agents reach your Actions list within the hour.

**What keeps it within budget:** a run with no task file for its agent and nothing new stops after the check (pull, read its task files and the commits addressed to it, log an idle run), with no full read and no commit.

**Two choices of mine, beyond what you asked (your call):** briefs **twice a day**, at 07:20 and in the evening, instead of after every wake with something new (fifteen a day would be too many); and the evening brief, with its "today" list, at the **20:20** wake, after the 18:00 stand-up (17:20 until you approve). The other wakes hand out work, collect reports, keep your Actions list and drain.

**The night:** with the last wake at 21:20, the page-view lanes wait from 21:20 to 07:20. Last night the hourly drains from 22:09 to 02:08 brought 420 page views (33, 55, 101, 60 and 171: the conductor's own drain output), and an automated sweep brought over 1,400 between 03:05 and 05:08 ([brief 8](briefs/2026-11-05T0725Z.json)). They would wait in the five lanes; a lane that answers 507 (full) passes the event to the next (`assets/telemetry.js`). The five lanes hold about 5,000 views (a lane holds at most 1,000 pending files, `content/observability-pack/03-the-vault-and-the-lanes.md`), so last night's roughly 2,500 would fit; a view is lost only if all five answer 507, since `assets/telemetry.js` tries each lane once, with no retry. If you prefer, one 03:07 drain stays (about 1M tokens a day).

## The expected daily tokens

**Per run**, from the accountant's ledgers (`people/jose/accountant/ledger/`, 5 November) and, for the conductor, its own session measured over whole wakes. Cache reads are counted apart: they cost about a tenth of fresh input (`measure.mjs`).

| Run | Total tokens | Without cache reads | From |
|---|---|---|---|
| conductor, a wake with a brief | 9.1M to 10.5M (9.8M on average) | 106k to 186k | its 07:20 and 12:20 wakes, whole |
| conductor, a wake without a brief | 3.1M (an estimate) | 49k | the first two and a half minutes of its 12:20 wake (reading and planning), the closest measure there is |
| conductor, a drain | 0.55M to 1.35M (0.88M on average) | 2k to 5k | its 12:07, 13:07 and 14:07 drains; a drain folded into a wake is counted at the same cost |
| dashboard | 2.4M to 3.9M (3.1M) | 268k to 340k (305k) | four runs |
| dev | 6.8M | 600k | one run |
| helper | 1.5M | 143k | one run |
| automation | 3.3M | 184k | one run |
| designer | 10.8M to 11.4M (11.1M) | 47k to 565k (306k) | two runs |
| watcher, vault | not measured yet | | assumed like the dashboard: 3.1M, 305k |
| an idle run that stops after the check | 1M | 30k | an estimate |

The ledger lines are taken before the reviewer, so they undercount a run by its review. The conductor's figures come from a long session that re-reads about 200k tokens of cached context per call; a fresh session costs less per call.

**Per day** (scheduled runs only; on-demand runs come on top):

| | Total tokens a day | Without cache reads |
|---|---|---|
| **Now** | **about 99M**: the conductor 50M (21M of it the 24 drains), dev 14M, dashboard 9M, watcher 9M (assumed), automation 7M, vault 6M (assumed), helper 3M | **about 4.8M** |
| **Proposed, half of dev's and the helper's runs and one of the designer's idle** | **about 158M**: the conductor 73M (2 wakes with a brief, 13 without, 15 drains), dev 31M, designer 12M, helper 10M, the four unchanged 32M | **about 7.3M** |
| **Proposed, every run doing work** | **about 194M**: dev 54M, designer 22M, helper 12M, the rest as above | **about 10.3M** |

So: **1.6 to 2.0 times today's tokens** (1.5 to 2.1 times without cache reads). The biggest lines are the conductor's hourly wakes and dev every two hours.

**Cheaper variants, if you want them:** the conductor every two hours instead of every hour saves about 28M a day (the drain then runs every two hours); dev every three hours (5 runs) saves 3M to 20M; dev on Sonnet for routine runs keeps the tokens but lowers their price (the accountant checks the quality first, as with the helper).

## To approve

Say yes, no, or which variant, and whether the two choices of mine stand. On a yes, your conductor changes its own scheduled task and records the new times in `people/jose/agents.json` and the kit; you change dev's, the helper's and the designer's in their sessions (a two-minute step each), or tell each of them to change its own.
