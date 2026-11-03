---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
Kept by `dashboard@web-summit.jose` from [the builder template](../../dashboards/index.html#builder): what needs you, what is broken or being built, and whether the machine is healthy. Tell your dashboard agent what you want first and what you never read; it changes this part every run.

**Asked on 3 November, not answered yet:** *what do you want to see first when you open this page, and what do you never read?* Until you answer, the order is: what needs you, your issues, the technical board, the machine.

## What needs me {#needs}

- **The 13:00 stand-up:** your decisions are in your briefing at the top, and your conductor's [brief 2](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-03T0720Z.pdf) has each one with options and a recommendation. One of them is already settled: Dinis put `riskmandate-jose` on the roster (WS-106 done, [the vaults page](../../vaults/index.html)), so your agents' keys can now be sealed to.
- **L6, the vaults:** the next step is your vault agent, `vault@web-summit.jose` (WS-120, you go first with Angelo and Silvio): the access token in your Claude environment, then the prompt on [your vault agent](../../vault-agent/index.html).
- **Your designer is waiting for your pick:** three directions for your command centre and two broadcast looks for WS-39, in [people/jose/design](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/README.md).
- **Messages for you:** commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev); every brief is in [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs).

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

- **conductor@web-summit.jose**: runs your other agents, keeps `people/jose/` with you, and writes your numbered briefs.
- **dashboard@web-summit.jose**: keeps this part of the page, before each stand-up.
- **dev@web-summit.jose**: WS-39 (the broadcast drafts for your n8n flow) and WS-74; its work and findings are in [people/jose/dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/README.md).
- **designer@web-summit.jose**: on demand; its work is in [people/jose/design](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/README.md).
- **Next:** `vault@web-summit.jose` (WS-120). Still only proposed in your brief: `automation@web-summit.jose` (dev is doing WS-39 for now) and `helper@web-summit.jose` (WS-35).
