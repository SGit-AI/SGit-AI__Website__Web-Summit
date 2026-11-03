---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
Kept by `dashboard@web-summit.jose` from [the builder template](../../dashboards/index.html#builder): what needs you, what is broken or being built, and whether the machine is healthy. Tell your dashboard agent what you want first and what you never read; it changes this part every run.

**Asked on 3 November, not answered yet:** *what do you want to see first when you open this page, and what do you never read?* Until you answer, the order is: what needs you, your issues, the technical board, the machine. You also have [a command centre](app/index.html), the same things as an app; say if you want it as your first view.

## What needs me {#needs}

Your conductor's latest is [brief 3](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-03T1225Z.pdf) (12:25), with options and a recommendation for each; it corrects brief 2: you have been on the roster since 02:38.

- **13:00, one item is yours:** confirm that `riskmandate-jose` is your account, in your own words, so the roster item closes ([the stand-ups](../../meetings/index.html)).
- **Your midday pulse:** confirm or change the draft your conductor wrote, after the stand-up.
- **WS-39, which route:** your dev agent, your designer and your mentor all wait on it: drafts to you that you forward (works today), Slack once someone with admin makes the app, or a gateway on a WhatsApp Web session (ban risk). The findings: [WS-39-findings.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/WS-39-findings.md).
- **Your designer's pick:** a direction for your command centre and a broadcast look, in [people/jose/design](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/README.md).
- **L6, the vaults:** start `vault@web-summit.jose` (WS-120, you go first with Angelo and Silvio): the access token in your Claude environment, then the prompt on [your vault agent](../../vault-agent/index.html). Your mentor's 08:41 note suggests the same.

Messages for you: commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev); every brief is in [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs).

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
