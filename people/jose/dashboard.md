---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
**Updated Wed 4 Nov, 23:30 UTC by `dashboard@web-summit.jose`; next update Thu 07:30 UTC.** Built for action, at your word (4 November): what needs you as a list to work down, your lanes, and your agents only when something is wrong. [Your command centre](app/index.html) is becoming your first view (below).

## Needs me {#needs}

**From the stand-up of 4 Nov, 14:30** ([the record](../../meetings/2026-11-04-1300/index.html), added by conductor@web-summit.jose):
- ✅ **Approve:** start the accountant? Proposed in [agents.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/agents.json) as a sub-agent of your conductor's daily wake (WS-148's design).
- 🔧 **Do, by Thursday:** your business card: prompt your agent with Indi's prompt from the team chat, so the card carries your name (WS-155).
- 🔧 **Do:** share your contacts (Web Summit app, LinkedIn) for the "who do we know there" maps (WS-24).
- 🔧 **Do, with Angelo:** build and test the observability workflow end to end (WS-37; [the 18:00 sync](../../meetings/2026-11-04-1800/index.html)).
- 🔧 **Do, daily:** your interview with me, in Claude voice mode (what you learned, how your work changed, how it felt), written up as markdown (WS-41).
- ⛔ **Blocked:** WS-37's page views: announcing them waits on the security review by security@web-summit.dinis (asked in 45e4b6e).
- ⛔ **Blocked:** WS-108's QR codes wait on designer@web-summit.dinis, and the link from your brief on conductor@web-summit.dinis (asked in dd8dbcb).
- 🗣️ **Goal:** the pipeline, Portugal mapped first, by Friday or Monday (WS-26, WS-27); 50 active agents across the team.

Soonest first. Each line is one action; done ones drop off at the next update. From your conductor's [brief 7](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-04T1725Z.pdf) and the board.

| Do | What | Due | Takes | Who waits |
|---|---|---|---|---|
| **Do** | **Add your site key** (WS-136): open the file your conductor sent at 02:08, press "Paste my key" ([how](../../agents/index.html#person-key)), check "Unlocked", send one Feedback message | **Overdue:** Wed 18:00 | 2 min | Dinis; WS-120's lanes with Angelo |
| **Say** | **At the 13:00 stand-up:** your watcher's scope (WS-134) and whether a dev agent may change shared site code through a picked issue (WS-34); no decision recorded on Wednesday ([the stand-ups](../../meetings/index.html)) | Thu 13:00 (14:30 if WS-96 moves it) | 1 min | Dinis, Angelo |
| **Approve** | **The observability data vault's key to Dinis's conductor** (WS-154): yes or no, or only its read key | Thu 5 Nov | 1 min | conductor@web-summit.dinis |
| **Approve** | **Three yes or no to your conductor:** drop its 7 test page views; close WS-139 (newsroom.sgit.ai reached); the split with Angelo ([the morning list](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-04-morning.md)) | No deadline given | 5 min | conductor@web-summit.jose, Angelo |
| **Do** | **WS-39, route 3:** import the n8n workflow your dev agent built and fill in the credential, your number and the phone number id yourself ([what to fill in](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/WS-39-findings.md)) | Overdue: Wed 4 Nov | 10 min | dev@web-summit.jose |

**Settled since you last looked:** your watcher has its schedule (since 23:10 UTC, 07:15, 12:15 and 17:15) and reported the day ([its latest](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/watcher/latest.md)); the site's page views are live (WS-37).

## My lanes {#lanes}

What you lead, in your words (4 November): *"technical conversations on agent security with the companies; the live demos (show an agent being attacked, then show it governed); and the voice and language agents lane."* Not yours: the big-name relationships and insurance deals.

| Lane | Issues | Carried by | With |
|---|---|---|---|
| **Agent security conversations** | WS-15 (the message), WS-26 (the targets, Thursday and Friday) | you | Nimay, Indi, Dinis, Silvio |
| **The live demos: attacked, then governed** | WS-18, WS-108 (your two apps, picked), WS-109 | you, conductor@web-summit.jose | Dinis, Nimay, Angelo |
| **Voice and language agents** | WS-61 (the voice memo loop, Sat 7 Nov) | nobody yet | anyone |
| **Automation and the machine** (your agents carry it for you) | WS-39, WS-74 (both picked), WS-37 (page views), WS-134, WS-154 | dev@, conductor@, watcher@web-summit.jose | Angelo, Dinis |

Your first demo piece, live: the "Reach, Mandate, Gap" vault app, made by `vault@web-summit.jose`.

```vault-app jose 3b9y9n9t
```

## My agents: only what is wrong {#agents}

On schedule: conductor, dashboard and dev; the watcher's first scheduled run is Thu 07:15 UTC. The reviewer runs on every push. Needing a look:

- **Your watcher's flags** ([its latest](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/watcher/latest.md)): three pushes without the reviewer's line (one of them mine, from Wednesday morning), one change to build code (45e4b6e) not yet reviewed by security, and three writes outside an agent's folder, each with its record.

- **vault@web-summit.jose:** no schedule; last commit Wed 01:31 UTC. Fine if it runs on demand; say if it should wake on its own.
- **automation@ and helper@web-summit.jose:** ready in [your kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/kit/README.md), not started; start them when you choose (WS-39, WS-35).
- **observability@web-summit.jose:** named on WS-37 and WS-154, not started.

The full list with jobs and schedules: [agents.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/agents.json). The prompts: [your kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/kit/README.md).

## Your command centre first: in progress {#cc}

Your app at [app/](app/index.html) is the interactive view: filters, Today and This week, Kanban, and Ask Claude. Making it your first view, with your designer's pick ([A's layout with B's three counts, Overdue, Quiet and Decide, and run-history ticks per agent](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/README.md)), needs your conductor:

1. **Your conductor** creates `people/jose/app/config.json` (you have none yet) with your decisions list, your lanes as workstreams, and the `llm` block copied from Dinis's, which turns on Ask Claude.
2. **The improvements to the shared engine** (your designer's [proposal](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/proposal-shared-cc.md)) go to its owner as a board issue, so nobody else's app changes without them.
3. **Ask Claude, your part:** a key just for this page at openrouter.ai/settings/keys **with a small credit limit**, pasted only into the command centre's own form ("Save on this device"); never into a chat, a commit or a message, and not on a shared machine. Until WS-117 moves the key to an origin of its own, any script on this site could read it (WS-132), so keep the limit small.

Then this page becomes the short text version.

## My issues {#issues}

The pool you share with Angelo: [the technical board](../../briefs/index.html#issues) (area tech).

```issues jose
```

## The machine {#machine}

[The agents at work](../../wakes/index.html) · [the ABPs](../../abp/index.html) · [everything on the team](../../team/everything/index.html) · [the setup leaderboard](../../team/setup/index.html) · [the CI runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions) · every brief: [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs) · messages for you: commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev)

```onboarding jose
```
