---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
Kept by `dashboard@web-summit.jose` from [the builder template](../../dashboards/index.html#builder): what needs you, what is broken or being built, and whether the machine is healthy. Tell your dashboard agent what you want first and what you never read; it changes this part every run.

**Asked this run (3 November):** *what do you want to see first when you open this page?* Until you answer, the order is: what needs you, your issues, the technical board, the machine.

## What needs me {#needs}

- **The next step on setup:** your row below. L4 needs your agents' keys on [the keys page](../../keys/index.html); L5 needs the dashboard and dev agents on a schedule.
- **Your conductor's briefs:** the latest numbered PDF and its asks are in [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs).
- **Messages for you:** commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev).

```onboarding jose
```

## My issues {#issues}

```issues jose
```

## The technical board {#tech}

Shared with Angelo: one pool, you two choose who takes what.

```issues area:tech
```

## The machine {#machine}

[The agents at work](../../wakes/index.html) · [the ABPs](../../abp/index.html) · [everything on the team](../../team/everything/index.html) · [the setup leaderboard](../../team/setup/index.html) · [the CI runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions)

## My agents {#agents}

The list with jobs and schedules is [agents.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/agents.json), kept by your conductor; the prompts are in [your kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/kit/README.md). What they did is in "My agents, as the team sees them" at the top.

- **conductor@web-summit.jose**: runs your other agents and keeps `people/jose/` with you.
- **dashboard@web-summit.jose**: keeps this part of the page. Started 3 November; its key is `dashboard-jose` on the keys page.
- **dev@web-summit.jose**: ready in the kit.
- **automation@web-summit.jose** (WS-39, the n8n WhatsApp broadcast) and **helper@web-summit.jose** (WS-35): proposed in your brief.
