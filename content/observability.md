---
title: "Observability: who reads what, and what the agents read and did"
summary: The second observability on web-summit.sgit.ai, run by observability@web-summit.dinis beside Jose's (WS-37), for experiments; a read event that tells a view from a read; and the agent activity lane every agent logs to at the end of each run. The vaults, the lanes, the records, the drain, and what is next.
---
Built by **observability@web-summit.dinis** on 5 November 2026, at Dinis Cruz's word: *"this is not about monitoring, this is about information management"* ([the brief](../brief-observability/index.html)). It sits **beside** the page views Jose's agents built and run ([WS-37](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/observability/README.md), vault `1ssnjy23`), so Dinis can experiment without touching theirs. Same design, from [the observability pack](../observability-pack/index.html).

## What runs {#runs}

| Part | Where | What it does |
|---|---|---|
| **The data vault** | `kuuqr3do` on dev.send.sgraph.ai, **private** | the drain key (`identity/private/`), five lanes, `drain/<date>.jsonl`, `reports/latest.json` |
| **The app vault** | `p96tiql4`, code only | the view over the data vault (next) |
| **The page sender** | `assets/obs-dinis.js`, `assets/obs-dinis.json`, on every page | a **view** when a page loads, and a **read** the first time the tab is hidden or closed: seconds the page was visible and the deepest scroll, in percent |
| **The agent lane** | `admin/tools/agent-log.mjs` | one record per agent run: what it read (Markdown or HTML), what it did; signed with the agent's own key |
| **The drain** | `admin/tools/obs_drain.py`, run by observability@web-summit.dinis | list, fetch, open, verify, append, report, push, then mark processed |

## The lanes {#lanes}

| # | Lane | Written by |
|---|---|---|
| 1 | web-summit.sgit.ai page views | `assets/obs-dinis.js` |
| 2 | the same, when lane 1 is full (507) | `assets/obs-dinis.js` |
| 3 | agent runs | `admin/tools/agent-log.mjs` |
| 4 | the same, when lane 3 is full | `admin/tools/agent-log.mjs` |
| 5 | web-summit.newsroom.sgit.ai page views | reserved, for the newsroom's sender |

The append tokens and the drain's public key are in `assets/obs-dinis.json`, public on purpose: a token can only write to its lane and the key can only encrypt. The vault key, the enum key and the drain's private key never enter this repository.

## People, by their key {#people}

A team member whose browser holds their site key ([WS-136](../briefs/index.html#issues)) signs both events; the drain verifies the signature against `data/person-keys.json`, so a row says "Vicky read the newsroom brief for 4 minutes, to the end", not a guess. Anyone without a key stays anonymous and is counted only. A signature from a key a conductor issued can also have come from that conductor's session (WS-138).

## Agents, by their own run logs {#agents}

Required of every agent from 5 November ([the agents page](../agents/index.html#agent-log)). One record per run:

```
{ "type": "web-summit.agent-run/v1", "v": 1, "agent": "pm@web-summit.vicky", "session": "<Claude session id>",
  "run": "2026-11-05T09:30Z", "trigger": "schedule", "repo": "SGit-AI/SGit-AI__Website__Web-Summit",
  "read": [ { "url": "https://web-summit.sgit.ai/brief-vicky/index.md", "as": "md", "bytes": 5120 },
            { "url": "repo:board/WS-153-vicky-s-vault-keys-to-the-conductor-over-the-inbox.md", "as": "md" } ],
  "did":  [ { "commit": "ab64608", "subject": "..." }, { "release": "v0.2.430" } ],
  "tokens": { "input": 48211, "output": 5120 }, "notes": "one line",
  "sig": { "key": "sha256:<the agent's signing fingerprint>", "alg": "ECDSA-P256-SHA256-P1363", "sig": "...", "over": "..." } }
```

The drain accepts the signature only from an active key on [the keys page](../keys/index.html) whose label is that agent; anything else is kept and counted, marked unsigned, with the reason. What it will answer: did Indi's and Vicky's agents read the newsroom brief, and as Markdown or HTML? Which agents never read their own section of the agents page? Which act without having read the board?

## Privacy {#privacy}

No IP address, no cookie, no user-agent string (automation is recorded by class: `webdriver`, `headless`, a crawler's name). Do Not Track, Global Privacy Control and the footer's **Pause** switch stop this sender too. Time visible and scroll depth are measured in the browser and sent once per page per tab. An agent record carries URLs without their query strings, commit ids and counts: nothing private. Per-person reads are for the team only, for people with a key; nobody outside the team is ever named.

## Next {#next}

1. `/stats/`: per page, per person, per agent, from a public copy of the report (counts and the team's named reads; no anonymous rows).
2. The app in vault `p96tiql4`, linked read-only by the data vault.
3. The newsroom's sender (lane 5), as a patch for newsroom@web-summit.dinis.
4. The calibration loop: from the agent runs, findings per agent for Dinis and the mentors.
5. The security review by security@web-summit.dinis of the sender, the lane and the drain.
