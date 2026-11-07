---
title: "How the observability works: lanes, LETS, keys and the browser drain"
summary: The documentation of observability@web-summit.dinis's observability on web-summit.sgit.ai: the senders, the five lanes, the drain as LETS (load, extract, transform, save) with one folder per day and hour and a latest/ folder, the three vaults and which keys are published, the groups, the explorer that reads encrypted files in the browser, the Behind the scenes pane, and Dinis's drain from the browser.
---
Written by observability@web-summit.dinis, 5 November 2026, as it was built, at Dinis Cruz's word: *"remember we need to start documenting when you do this kind of stuff."*

## The flow, end to end {#flow}

```
 a browser on any page             dev.send.sgraph.ai              the drain (hourly, or Dinis's browser)
 assets/obs-dinis.js  ── sealed ──► lanes 1-2 of kuuqr3do ──┐
 an agent, end of run                                       ├─► L load (list, fetch: enum key)
 agent-log.mjs        ── sealed ──► lanes 3-4 of kuuqr3do ──┘   E extract (open: drain key; verify: site and agent keys)
                                                                S save raw: kuuqr3do events/<day>/<hh>/events.jsonl (private)
                                                                T transform: each new hour once, then its day, then latest/
                                                                S save: aym98gsm <day>/<hh>/hour.json, <day>/day.json, latest/*.json
 /observability/ in a browser ◄── ciphertext ── aym98gsm, read with its published read key, decrypted with Web Crypto
```

## LETS: load, extract, transform, save {#lets}

The drain does the analysis **when it drains**, not when someone looks: a page loads one small JSON file that already holds everything for its view.

- **Load:** list every lane with the enum key, fetch in batches of 50.
- **Extract:** open each record with the drain key; verify a page event's signature against `data/person-keys.json` and an agent run's against the agent's own key on `data/keys.json`; a failure is kept and marked, never dropped.
- **Save, raw:** each record goes to the **private** vault under the hour it happened in: `events/<YYYY-MM-DD>/<HH>/events.jsonl` (a page event by its `ts`, a run by its `run`), once (by file id). Each tab's group is kept in `state/sessions.json`.
- **Transform:** only the hours that received new records (and the current hour) are computed again; **a finished hour is computed once**. Then its day is summed from its hour files, and `latest/` from the day files, never from raw rows.
- **Save, public:** to the public vault `aym98gsm`:

| File | What it holds | Who loads it |
|---|---|---|
| `latest/summary.json` | all-time totals per group, every day, the last 48 hours, top pages, the latest agent runs | the home page, the overview |
| `latest/pages.json` | every page: views per group, reads, time, scroll, its days | Pages, a page's view |
| `latest/flows.json` | page to next page within one tab, counted per group | the graph, a page's "came from / went on to" |
| `latest/agents.json` | every agent (and every key on the keys page that never logged): runs, reads by kind, what it read, what it did, its checklist | Agents, an agent's view |
| `latest/team.json` | each person: pages read, views, reads, time, scroll | People, a person's view |
| `latest/widgets.json` | the dashboard, already evaluated: silent agents, checklists, acted without the board, md or html, the read index for "has X read Y" | the dashboard |
| `latest/timeline.json` | every hour so far: views per group, reads, agent runs, team members seen | the timeline |
| `latest/feed.json` | the newest 300 events of the last 12 hours: the team's views and reads (by key), agents' runs, and anonymous traffic **only as per-minute counts** per page and group | the live feed |
| `latest/findings.json` | every signature that failed: when, page or agent, the reason, the key claimed | security events |
| `latest/drains.json` | every drain: when, by whom (the hourly drain, or a person from their browser), how many records | the drains log |
| `latest/runs.json`, `latest/index.json` | the latest 200 runs; which days and hours exist and when each was computed | |
| `<day>/day.json` | the day: totals, its 24 hours per group, pages, the team, the agents' runs | a day's view |
| `<day>/<hh>/hour.json` | one hour: the same, plus its minutes per group | an hour's view |

`latest/` is the cache: replaced on every drain, so the first file a page reads is always small and current; the dated folders below it are the history, and do not change once their hour is over.

## The vaults and their keys {#vaults}

| Vault | What | Read key |
|---|---|---|
| `kuuqr3do` | **private**: the lanes, the drain key, raw events by the hour, tab state | never published: its read key derives the lanes' enum key, and the drain key is inside |
| `aym98gsm` | **public**: the transformed files above, and the app | published on [the vaults page](../../vaults/index.html) |
| `p96tiql4` | the app, code only (`people/dinis/observability/app/index.htm`) | published |

The three vault keys and the SG/Send access token are sealed, at Dinis's word, to the site keys of the four people who may drain: **Dinis, Jose, Angelo and Silvio** (`people/dinis/observability/sealed/<person>.json`, ws-ecies-1, one file each), so only a browser holding one of those keys opens them. Note (WS-138): the conductor that issued his key holds its private half too.

## The explorer, and Behind the scenes {#explorer}

The pages of this section are one explorer (`assets/obs-view.js`), its state in the URL: `#view=page&path=/start/`, `#view=day&day=2026-11-05`, `#view=hour&day=2026-11-05&hour=14`, `#view=agent&agent=…`, `#view=person&person=…`, `#view=graph`, `&group=readers` to filter. Every page, person, agent, day and hour is a link to its own view; ↗ opens the page itself.

It reads the public vault **lazily**: it computes the HEAD's id from the read key, decrypts the commit, and walks only the folders on the path it needs (`latest/`, then a day or an hour), so a view costs a handful of objects. **Behind the scenes** (the tab on the right) shows each encrypted object fetched, each file decrypted, its size and time, who the browser is by key, and links to open each vault.

**For Dinis, Jose, Angelo and Silvio:** when the browser holds one of their site keys, it opens the sealed vault keys, links each vault opened with its **vault key**, and offers **Drain the lanes now**: it opens the data vault with the SG/Vault library (pinned copy), derives the enum key, lists and fetches the lanes, opens each record with the drain key to show it (your own page views appear), writes them **still sealed** to the data vault's `inbox/` (the file named after the person who drained), pushes, and marks them processed. The hourly drain then opens and verifies them like any other, and they reach the stats.

## What runs {#runs}

| Part | Where | What it does |
|---|---|---|
| **The data vault** | `kuuqr3do` on dev.send.sgraph.ai, **private** ([why](#groups)) | the drain key (`identity/private/`), five lanes, `drain/<date>.jsonl`, `reports/latest.json` |
| **The public vault** | `aym98gsm`, **read key published** | `data/public.json` (counts per group, the team's named reads, the agents' runs) and the app; written by the drain, read by [the vault page](../observability/vault/index.html) |
| **The app vault** | `p96tiql4`, code only, **read key published** | the app (`index.html`), from `people/dinis/observability/app/` |
| **The page sender** | `assets/obs-dinis.js`, `assets/obs-dinis.json`, on every page | a **view** when a page loads, and a **read** the first time the tab is hidden or closed: seconds the page was visible and the deepest scroll, in percent |
| **The agent lane** | `admin/tools/agent-log.mjs` | one record per agent run: what it read (Markdown or HTML), what it did; signed with the agent's own key |
| **The drain** | `admin/tools/obs_drain.py`, hourly, run by observability@web-summit.dinis | list, fetch, open, verify, append, report, push, mark processed; then publish `data/public.json` and the app to the public vault |

## The lanes {#lanes}

| # | Lane | Written by |
|---|---|---|
| 1 | web-summit.sgit.ai page views | `assets/obs-dinis.js` |
| 2 | the same, when lane 1 is full (507) | `assets/obs-dinis.js` |
| 3 | agent runs | `admin/tools/agent-log.mjs` |
| 4 | the same, when lane 3 is full | `admin/tools/agent-log.mjs` |
| 5 | promptugal.news page views | reserved, for the newsroom's sender |

The append tokens and the drain's public key are in `assets/obs-dinis.json`, public on purpose: a token can only write to its lane and the key can only encrypt. The vault key, the enum key and the drain's private key never enter this repository.

## People, by their key {#people}

A team member whose browser holds their site key ([WS-136](../../briefs/index.html#issues)) signs both events; the drain verifies the signature against `data/person-keys.json`, so a row says "Vicky read the newsroom brief for 4 minutes, to the end", not a guess. Anyone without a key stays anonymous and is counted only. A signature from a key a conductor issued can also have come from that conductor's session (WS-138).

## Agents, by their own run logs {#agents}

Required of every agent from 5 November ([the agents page](../../agents/index.html#agent-log)). One record per run:

```
{ "type": "web-summit.agent-run/v1", "v": 1, "agent": "pm@web-summit.vicky", "session": "<Claude session id>",
  "run": "2026-11-05T09:30Z", "trigger": "schedule", "repo": "SGit-AI/SGit-AI__Website__Web-Summit",
  "read": [ { "url": "https://web-summit.sgit.ai/brief-vicky/index.md", "as": "md", "bytes": 5120 },
            { "url": "repo:board/WS-153-vicky-s-vault-keys-to-the-conductor-over-the-inbox.md", "as": "md" } ],
  "did":  [ { "commit": "ab64608", "subject": "..." }, { "release": "v0.2.430" } ],
  "tokens": { "input": 48211, "output": 5120 }, "notes": "one line",
  "sig": { "key": "sha256:<the agent's signing fingerprint>", "alg": "ECDSA-P256-SHA256-P1363", "sig": "...", "over": "..." } }
```

The drain accepts the signature only from an active key on [the keys page](../../keys/index.html) whose label is that agent; anything else is kept and counted, marked unsigned, with the reason. What it will answer: did Indi's and Vicky's agents read the newsroom brief, and as Markdown or HTML? Which agents never read their own section of the agents page? Which act without having read the board?

## Privacy {#privacy}

No IP address, no cookie, no user-agent string (automation is recorded by class: `webdriver`, `headless`, a crawler's name). Do Not Track, Global Privacy Control and the footer's **Pause** switch stop this sender too. Time visible and scroll depth are measured in the browser and sent once per page per tab. An agent record carries URLs without their query strings, commit ids and counts: nothing private. Per-person reads are for the team only, for people with a key; nobody outside the team is ever named.

## Who is who: the four groups {#groups}

Each tab is put in one group, from **declared** signals first, then **inferred** ones (the PHP newsroom's rules):

| Group | Declared | Inferred |
|---|---|---|
| **Crawlers** | the browser names a crawler (`googlebot`, `bingbot`, `bot`) | more than 40 pages in one tab |
| **Synthetic** | `navigator.webdriver` or a headless browser: our own agents' checks, and this agent's test traffic | a `UTC` time zone or a POSIX language: browsers in cloud containers |
| **The team** | a signature from a site key on `data/person-keys.json` | (never inferred) |
| **Readers** | | everyone else |

**Why the private vault stays private:** its read key would also give out the lanes' enum key (derived from it) and the drain key kept inside it, so anyone could empty the lanes or read raw rows of anonymous readers. So the drain publishes what is meant to be public into a second vault, and only that vault's read key is on this page.

## Next {#next}

1. Where and how to present it (a section on the home page, the stand-up show, each person's dashboard): Dinis to decide.
2. A page per agent: its runs, what it read, what it never read.
3. The newsroom's sender (lane 5), as a patch for newsroom@web-summit.dinis.
4. The calibration loop: from the agent runs, findings per agent for Dinis and the mentors.
5. The security review by security@web-summit.dinis of the sender, the lane and the drain.
