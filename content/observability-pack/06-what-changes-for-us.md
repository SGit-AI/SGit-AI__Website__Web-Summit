---
title: "Observability pack 6: what changes for us, and the agent lane"
summary: Three differences from the PHP site, at Diniss word of 4 November: the team members signature on each event (known by their key), a public vault with per-person reads for the team, and a third lane where every agent logs what it read and did, with the schemas.
---
## 1. People known by their key {#signed}

When the browser holds a team member's key (`window.WSKeyring`, [WS-136](../briefs/index.html#issues)), the event gains two fields, and the person is declared, not guessed:

| Field | Value |
|---|---|
| `person` | the person's id, `vicky` |
| `sig` | `{ "key": "sha256:<16 hex>", "alg": "ECDSA-P256-SHA256-P1363", "sig": "<base64>", "over": "<the event as JSON, without sig>" }` |

The drain verifies `sig` against `data/person-keys.json` (our `admin/tools/feedback_drain.py` already does exactly this for feedback: `verify()`). An unverified `person` is dropped to anonymous. Remember WS-138: a key the conductor issued can also be used by that conductor.

## 2. A public vault {#public}

At Dinis's word: *"this vault should be public, because it just makes it easy ... this is not about monitoring, this is about management."* So, unlike the PHP site:

- **Per person, per page, per day** for the team (people with a key): published, so anyone on the team can see who has read the newsroom's brief, today's stand-up show, their own brief.
- **Anonymous readers**: counts only, as on the PHP site; city and region never published.
- The drain key stays private; the vault's **read key** is published, so the drained rows of the team are readable by anyone with it. Strip city and region from rows before they are written to the public vault, or keep two vaults (private rows, public rows): the agent proposes, security reviews.

## 3. The agent lane {#agents}

Agents fetch Markdown or HTML without running JavaScript, so page views never see them. Every agent appends one record per run, sealed like the rest, to its own lane on the same vault:

```
{ "type": "web-summit.agent-run/v1", "v": 1,
  "agent": "pm@web-summit.vicky", "session": "<the Claude session id, if known>",
  "run": "2026-11-04T15:30Z", "trigger": "schedule | person | message",
  "read":  [ { "url": "https://promptugal.news/brief/index.md", "as": "md", "bytes": 3120, "status": 200 } ],
  "did":   [ { "commit": "ab64608", "repo": "SGit-AI/SGit-AI__Website__Web-Summit", "subject": "..." },
             { "release": "v0.2.312" } ],
  "tokens": { "input": 48211, "output": 5120 },
  "notes": "one line, optional" }
```

A tool every agent can call at the end of a run: `node admin/tools/agent-log.mjs --agent <me> --read <url,...> --did <sha,...>`, which seals and appends (the token for the agents' lane is public, like the others). What it answers: did Indi's and Vicky's agents read the newsroom's brief (and as Markdown or HTML)? What did the newsroom's first agent read before it built a site that missed the brief? Which agents never read their own section of the agents page?

## The stats page {#stats}

`/stats/` on the team's site, from the public report: traffic per day and page; the team's reads per person (who has read what this week); the agents' runs (who read what, Markdown or HTML, tokens); the newsroom's counts beside it.
