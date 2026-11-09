# Jose's agents: faster pickup, approved for one day

**Status: approved for one day, 7 November 2026 (Jose, C30), the core schedules only.** Jose's words: *"the core schedules yes, for one day. No optional extras for now (evening brief, 03:07 drain, idle line). Tomorrow tell me the token count; keep or revert at my word, nothing reverts by itself. I'll paste the wake texts from people/jose/schedules.md."* So: the times in the table below, with the texts under [the texts to paste](#paste); the evening brief stays at the 17:20 wake; no 03:07 drain; no idle line added to dev's and the helper's texts. Until the conductor's new wake is in, its hourly drain task only counts (Jose, C30); once the wake carries the drain sentence, the conductor deletes the drain task. The day starts when Jose has pasted; the conductor reports the token count the next morning, and the watcher's one-day trial on Sonnet is compared separately (C30, item 5).

Written as a proposal by conductor@web-summit.jose at Jose's word (5 November 2026, C19): *"Propose new schedules so work moves without me ... Don't switch anything yet. Put the proposal with the expected daily token cost, from the accountant's numbers, in my next brief. I approve it first."* Each agent's scheduled task lives in its own session: Jose pastes there (WS-129).

## The schedules

| Agent | Now (UTC) | Proposed (UTC) | Runs a day |
|---|---|---|---|
| conductor | 07:20, 12:20, 17:20; the page-view lanes every hour, day and night (counted only since 6 November, 00:07, until it has its own token) | **every hour, 07:20 to 21:20** (cron `20 7-21 * * *`), inside your 07:00 to 22:00 window, the drain folded into each wake | 3 wakes + 24 drains → 15 wakes |
| dev | 09:30, 15:30 | **every two hours, 07:30 to 21:30** (`30 7-21/2 * * *`) | 2 → 8 |
| helper | 08:50, 14:50 | **every two hours, 07:50 to 21:50** (`50 7-21/2 * * *`), on Opus (your word, 6 November: it stays on Opus) | 2 → 8 |
| designer | on demand | **10:40 and 16:40** (`40 10,16 * * *`), plus on demand | 0 → 2 |
| dashboard, watcher, automation, vault | 3, 4, 2 and 2 a day (the watcher runs at 07:15, 12:15, 17:15 and 22:15) | unchanged | unchanged |
| sales-coach | on demand | unchanged | on demand |

**What it buys:** work you give your conductor is handed out within the hour, and dev and the helper pick it up within two hours; the designer within six hours by day (work handed out after 16:40 waits until 10:40 the next morning); asks from your agents reach your Actions list within the hour.

**What keeps it within budget:** a run with no task file for its agent and nothing new stops after the check (pull, read its task files and the commits addressed to it, log an idle run), with no full read and no commit.

**Two choices of mine, beyond what you asked (not taken, C30: the evening brief stays at 17:20):** briefs **twice a day**, at 07:20 and in the evening, instead of after every wake with something new (fifteen a day would be too many); and the evening brief, with its "today" list, at the **20:20** wake, after the 18:00 stand-up (17:20 until you approve). The other wakes hand out work, collect reports, keep your Actions list and drain.

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
| watcher | 5.1M to 6.8M (5.9M) | 335k to 363k (349k) | two runs (17:15 and 22:15, 5 November) |
| vault | 2.9M | 14k | one run (17:40, 5 November) |
| an idle run that stops after the check | 1M | 30k | an estimate |

The ledger lines are taken before the reviewer, so they undercount a run by its review. The 17:20 wake of 5 November, with the evening brief and its reviews, measured 19.0M (250k) in its first ten minutes: if the evening brief costs that every day, add about 9M a day to both now and proposed. The conductor's figures come from a long session that re-reads about 200k tokens of cached context per call; a fresh session costs less per call.

**Per day** (scheduled runs only; on-demand runs come on top):

| | Total tokens a day | Without cache reads |
|---|---|---|
| **Now** | **about 113M**: the conductor 50M (21M of it the 24 drains), the watcher 24M (4 runs), dev 14M, dashboard 9M, automation 7M, vault 6M, helper 3M | **about 4.7M** |
| **Proposed, half of dev's and the helper's runs and one of the designer's idle** | **about 172M**: the conductor 73M (2 wakes with a brief, 13 without, 15 drains), dev 31M, designer 12M, helper 10M, the four unchanged 46M | **about 7.2M** |
| **Proposed, every run doing work** | **about 207M**: dev 54M, designer 22M, helper 12M, the rest as above | **about 10.2M** |

So: **1.5 to 1.8 times today's tokens** (1.5 to 2.2 times without cache reads). Corrected on 6 November (C24): the watcher runs four times a day, not three, and its and vault's runs are now measured, not assumed. The biggest lines are the conductor's hourly wakes and dev every two hours.

**Cheaper variants, if you want them:** the conductor every two hours instead of every hour saves about 28M a day (the drain then runs every two hours); dev every three hours (5 runs) saves 3M to 20M; dev on Sonnet for routine runs keeps the tokens but lowers their price (the accountant checks the quality first). The helper stays on Opus (your word, 6 November).

<a id="paste"></a>
## The stored prompts to paste (A-06)

**Approved for one day (C30); the texts made short (C39).** Each agent's full wake steps now live once, in its own section of the kit, under "Each wake" (people/jose/kit/README.md); what you paste below is a short pointer to them, so a change to an agent's steps is a commit to the kit, not a new paste. Paste each pointer over the stored prompt of the agent's scheduled task and set the time shown in bold, in one sitting. The core schedules only (C30): no idle line for dev and the helper, no 03:07 drain. Leave the hourly drain task alone: it only counts until then, and the conductor deletes it once its wake (which carries the drain sentence in the kit) is in. sales-coach, crm and writer@PrompTugal.jose have no wake. Your watcher's A-06 compares the stored prompts with these pointers (C39).

**conductor@web-summit.jose wake**: set the time to **every hour, 07:20 to 21:20** (`20 7-21 * * *`). What changes: the stored prompt is the 3 November text; this adds the watcher's reports, your transcripts and interview (and no pulse questions at each wake), the one door (task files, your Actions list, the evening "today" list), the accountant at 07:20, measuring, the reviewer before release.sh, the run log, and the page-view lanes at every wake (the last sentence).

```
Scheduled wake: conductor@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**conductor@web-summit.jose hourly drain** (:07): **nothing for you to paste.** The conductor changed this task's stored prompt to the count-only text below on 7 November (C30: it only counts until the new schedule is in) and deletes the task once its new wake carries the drain sentence.

```
Hourly drain: conductor@web-summit.jose. In /home/user/SGit-AI__Website__Web-Summit, pull dev (git fetch origin dev and rebase, nothing else). Until an SG/Send access token of the conductor's own is sealed to its key (Dinis, 5 November 2026: no agent pushes a vault with its person's token), run `python3 -I admin/tools/telemetry_drain.py --dry` (it lists and counts the five page-view lanes; it pushes nothing and marks nothing processed); once it has its own token, run the drain without --dry (it drains into ws-observability-data, pushes the vault, then marks processed). Commit nothing to the repository for a drain. Then log this run (WS-160): `NODE_USE_ENV_PROXY=1 node admin/tools/agent-log.mjs --agent conductor@web-summit.jose --read repo:people/jose/observability/README.md --trigger schedule --notes "hourly run: N pending, M drained"`. Report in one line: pending and drained, totals. If it fails, say exactly where, mark nothing processed by hand, and tell Jose in your next brief. (Jose, 7 November 2026, C30: this task only counts until the conductor's new hourly wake carries the drain sentence; then the conductor deletes it.)
```

**dev@web-summit.jose wake**: set the time to **every two hours, 07:30 to 21:30** (`30 7-21/2 * * *`); now 09:30, 15:30. What changes: the stored prompt is the 3 November text; this adds its task files first (one door), measuring, the reviewer before release.sh, and the run log.

```
Scheduled wake: dev@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**dashboard@web-summit.jose wake**: time unchanged (07:30, 12:30, 17:30). What changes: the stored prompt has the reviewer; this adds its task files first (one door), measuring and the run log.

```
Scheduled wake: dashboard@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**vault@web-summit.jose wake**: time unchanged (11:40, 17:40). What changes: this adds the one door (report back to the conductor), Dinis's token rule (no drain with your token; count until its own), and the run log.

```
Scheduled wake: vault@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**automation@web-summit.jose wake**: time unchanged (10:10, 16:10). What changes: only the one door (its task files first).

```
Scheduled wake: automation@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**helper@web-summit.jose wake**: set the time to **every two hours, 07:50 to 21:50** (`50 7-21/2 * * *`); now 08:50, 14:50. Close its Gmail task first: done (C30). What changes: only the one door (its task files first). It stays on Opus.

```
Scheduled wake: helper@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**watcher@web-summit.jose wake**: time unchanged (07:15, 12:15, 17:15, 22:15); switch it to Sonnet in its own session for the one-day trial (C30). What changes: only the measure step. Its stored prompt is newer than the kit (the action loop and the 22:15 run, at your word on 5 November), so the kit now records it, with "measure this wake (people/jose/accountant/ROLE.md, step 1)," put back before "run the reviewer".

```
Scheduled wake: watcher@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

**designer@web-summit.jose**: a new scheduled task at **10:40 and 16:40** (`40 10,16 * * *`) with this prompt (its own text has always stopped early when it has no task; that is not the idle line you declined, which was an addition to dev's and the helper's).

```
Scheduled wake: designer@web-summit.jose. Pull dev, read people/jose/kit/README.md (the shared sections and your own section) and do only the Each wake steps in your section; the start prompt there is for a new session only.
```

## After the day

The next morning's brief gives the token count for the day from the ledgers (the accountant), against about 113M a day before and about 207M expected: with no idle line, dev's and the helper's runs all do their full work, so the upper estimate is the one to compare with. Jose keeps or reverts at his word; nothing reverts by itself (C30). The watcher's Sonnet trial is compared separately.
