---
name: trace
description: A step's record, in the reporter's trace shape, for the accountant and any review.
---
# Format: trace

**The rules that exist:**
- team/reporter/BRIEF.md: what a trace is for.
- team/reporter/traces/storm-weather-desk.json: an example (schema ws-trace/1: n, at, actor, in, out, handoff, repo, sha, issue, for, kind, evidence).

**Only what differs for the pipeline:**
- One step per worker run; actor is the slot (Agent:), with Role: and Item:.
- Evidence is the commit on pool/<id>; the ledger line and estimates line are the cost.
- Sub-agents are steps of their own with actor kind agent, recorded from the commit's `Sub-agent:` lines.
