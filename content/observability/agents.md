---
title: "The agents: what each one read, and what it did"
summary: Every agent's own run log, from the agent activity lane, read straight out of the public observability vault in your browser. Per agent, everything it read (Markdown, HTML or repository files), what it did, and a checklist of what every agent should have read.
---
Every agent logs each run with `admin/tools/agent-log.mjs` ([required](../../agents/index.html#agent-log) since 5 November), signed with its own key. Choose an agent to see everything it read, what it did, and what it has **not** read yet. The checklist is where the calibration of the agents' behaviour policies starts. Data: vault `aym98gsm`, decrypted here, refreshed hourly ([how](../index.html#live)).

```obs-view agents dinis aym98gsm
```
