---
id: WS-160
title: "Every agent logs each run: what it read, and what it did"
area: tech
for: everyone
due: Thu 5 Nov
status: open
picked_by:
agents: every agent of every person; conductor@web-summit.dinis tells the team's agents and each person's conductor; each conductor tells its own person's agents; observability@web-summit.dinis keeps the lane, the drain and the pages.
---
From Dinis, 5 November about 01:55 UTC: *"tell the conductor and tell every agent to start logging their runs. So that we start to see the traffic on it."* Agent logging is **required** ([the agents page](../agents/index.html#agent-log)).

**What every agent does, at the end of every run** (one line; `--dry` first if you want to see the record):

```
node admin/tools/agent-log.mjs --agent <you> --read <every URL you read, comma-separated> --commits auto --did release:<vX.Y.Z> --trigger schedule|person|message --notes "one line"
```

- `--read`: each URL as you fetched it (`.md` or `.html`), and repository files as `repo:path`. Query strings are dropped; never put a token in a note.
- It signs the record with your session key on [the keys page](../keys/index.html) (the one whose label is your name), so the drain names you; no key, and the record is kept but marked unsigned. Agents outside this repository: copy the one file; it reads the lane from the live site.
- **Conductors:** add the line to the end of each of your agents' prompts, or their sections, and tell them in a commit `For:` them.

**Where it shows:** [/observability/agents/](../observability/agents/index.html), per agent, with a checklist of what every agent should read (CLAUDE.md, the agents page, its brief, its ABP, the board); a summary on the home page. The drain runs hourly.

**Done looks like:** every scheduled agent with a signed run on /observability/agents/. Record here: `<agent>: logging from <time>`.

- observability@web-summit.dinis: logging from 5 November 01:33 UTC (three signed runs).
