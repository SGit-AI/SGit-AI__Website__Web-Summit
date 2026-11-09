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
- conductor@web-summit.angelo: logging from 5 November 02:24 UTC (signed, sha256:f34e311a93db5ddb).
- dev@web-summit.angelo: logging from 5 November 02:45 UTC (signed with its session key, sha256:b478b82a3a9995eb).
- team-collaboration@web-summit.angelo: logging from 5 November 03:50 UTC (signed with its session key, sha256:c1cb85a164aa1852).
- conductor@web-summit.jose: logging from 5 November 02:50 UTC (signed, sha256:006ceb9a9e3febbe). Its finding: in a Claude Code cloud session the line needs NODE_USE_ENV_PROXY=1 (WS-162).
- dev@, dashboard@, watcher@, automation@, helper@, vault@web-summit.jose: the line is at the end of each of their scheduled-task prompts from 5 November 02:51 UTC (people/jose/kit/README.md); each logs from its next run (watcher 07:15, dashboard 07:30, helper 08:50, dev 09:30, automation 10:10, vault 11:40 UTC). conductor@web-summit.jose records "logging from" for each once its first signed run shows. designer@web-summit.jose runs only when Jose opens it, and logs then (--trigger person). conductor@web-summit.jose's hourly telemetry drain (WS-37) logs each run too, from its next run (its scheduled-task prompt updated).
- dashboard@web-summit.angelo: logging from 5 November 03:45 UTC (signed with its session key, sha256:c525afa927190f36).
- dev@web-summit.dinis: logging from 5 November 03:50 UTC (signed, sha256:923ad1ba99178970).
- vault@web-summit.angelo: logging from 5 November 09:56 UTC (signed with its session key, sha256:70e1da6fbebb0006).
- helper@web-summit.angelo: logging from 5 November 10:58 UTC (signed with its session key, sha256:03b03f13ea2a1d09).
- crm@web-summit.angelo: logging from 5 November 16:54 UTC (signed with its session key, sha256:1dad30b8b20a218c).
- dev@web-summit.silvio: logging from 9 November 03:26 UTC (signed with its session key, sha256:a7a1c86520bc850e); the line is at the end of its 3-hourly wake's prompt.
- **Silvio's other scheduled agents, for conductor@web-summit.silvio** (9 November, from dev@web-summit.silvio): a scheduled task's prompt can be changed only from the session it posts into, so each agent adds the line to its own wake, or the conductor tells each one with a message. Who runs on a schedule (3-hourly wakes since 8 November, and the older ones): conductor, crm, video, design, dashboard, outreach, inbox (mail check and the 9 and 11 November follow-ups) and procurement (dashboard). Each has a key on the keys page to sign with, **except outreach@web-summit.silvio**, whose runs would be logged unsigned until it publishes one. The line: `NODE_USE_ENV_PROXY=1 node admin/tools/agent-log.mjs --agent <name> --read <URLs and repo:paths read> --commits auto --trigger schedule --notes "one line"`.
