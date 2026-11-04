---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
Kept by `dashboard@web-summit.jose` from [the builder template](../../dashboards/index.html#builder): what needs you, what is broken or being built, and whether the machine is healthy. Tell your dashboard agent what you want first and what you never read; it changes this part every run.

**Asked on 3 November, not answered yet:** *what do you want to see first when you open this page, and what do you never read?* Until you answer, the order is: what needs you, your issues, the technical board, the machine. You also have [a command centre](app/index.html), the same things as an app; say if you want it as your first view.

## What needs me {#needs}

You are at L6, fully wired. Your conductor's latest is [brief 7](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-04T1725Z.pdf) (17:25), with options and a recommendation for each:

- **Say at 18:00:** your watcher's scope (WS-134) and whether a dev agent may change shared site code through a picked issue (WS-34). Neither was reached at 13:00.
- **Do, by 18:00: your site key (WS-136):** open the file your conductor sent at 02:08 and press "Paste my key" ([how](../../agents/index.html#person-key)); your For-you panel should say "Unlocked". Then send one message from the Feedback pane. Your mentor (15:41) asks the same: it opens WS-120's lanes with Angelo.
- **Approve: drop your conductor's 7 test page views** from the data vault, so "Jose read X" only ever means you did.
- **Still open from brief 6:** your watcher has not committed since 01:11, so check its scheduled task (cron 15 7,12,17 * * *) in its session; and WS-139 (newsroom.sgit.ai, reached by two of your agents) is still open, waiting for your word to close it. The split with Angelo also still waits for your word ([the morning list](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-04-morning.md)).

**What happened:** the site's page views are live (WS-37): every page sends its view, sealed, to the append lanes of your data vault (not with Do Not Track, Global Privacy Control or Pause on); the other vault holds the app's code. Your conductor drains the lanes on an hourly scheduled task, the first at 18:07. How it works: [people/jose/observability](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/observability/README.md).

- **WS-39, route 3 is built:** your dev agent made an n8n workflow you can import, inactive until you fill in the number and credential yourself; what to fill in is at the top of [WS-39-findings.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/WS-39-findings.md).
- **Turn on Ask Claude in [your command centre](app/index.html#ask)** (Jose, 4 November: yes, as Dinis has it). Three steps:
  1. **Your conductor** creates `people/jose/app/config.json` (you have none yet) with an `llm` block copied from Dinis's (OpenRouter, Sonnet 5.5 by default), and releases.
  2. **You** make a key just for this page at openrouter.ai/settings/keys, **with a small credit limit**.
  3. **You** paste it only into the command centre's own form ("Save on this device"): it stays in that browser and goes only to openrouter.ai. Never into a chat, a commit or a message, and not on a shared machine; Settings removes it.

  Until WS-117 moves the key to an origin of its own, any script on this site could read it (WS-132), so keep the limit small and disable the key if in doubt.

Messages for you: commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev); every brief is in [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs).

```onboarding jose
```

## What I lead, and what I don't {#lead}

In your words (4 November): *"I'll lead: technical conversations on agent security with the companies; the live demos (show an agent being attacked, then show it governed); and the voice and language agents lane. I'm not doing: relationships with the big-name companies, insurance deals."*

- **Agent security conversations with the companies:** the targets come Thursday (WS-26); the message to open with is WS-15.
- **The live demos, attacked then governed:** WS-18 (the demos we run at the summit), WS-108 (your two apps as the stand demos) and WS-109 ("the grant, not the prompt" as the one demo).
- **Voice and language agents:** WS-61 (the voice memo to follow-up loop) is the nearest issue on [the board](../../briefs/index.html#issues).
- **Not yours:** the big-name relationships and insurance deals; items about them stay off this page unless they need you.

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
- **vault@web-summit.jose**: creates and manages your SGit vaults (WS-120); your first, the "Reach, Mandate, Gap" vault app, is on [the vaults page](../../vaults/index.html).
- **reviewer@web-summit.jose**: reviews every push by your agents before it goes out, and may hold them ([its role](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/reviewer/ROLE.md)); started 4 November at your word.
- **watcher@web-summit.jose**: read-only, reports who committed and what to look at; its scope is your 18:00 decision.
- Still only proposed in your brief: `automation@web-summit.jose` (dev is doing WS-39 for now) and `helper@web-summit.jose` (WS-35).
