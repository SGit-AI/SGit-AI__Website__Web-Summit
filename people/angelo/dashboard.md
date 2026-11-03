---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
Kept by `dashboard@web-summit.angelo`, in the same order as [your command centre](app/index.html): what needs you now, is everyone connected, the machine, the technical pool with Jose, and your agents. Tell your dashboard agent what you want first and what you never read; it changes this part every run.

**My question for you (3 November), not answered yet:** *which view do you want to open first, this classic dashboard or [the command centre](app/index.html)?* Until you answer, both are kept, in the same order.

## 1. Needs me now {#needs}

- **The 13:00 stand-up:** the decisions and questions waiting on you are in your briefing at the top and on [today's agenda](../../meetings/2026-11-03-1300/index.html): who sends the GitHub invitations (WS-09 or WS-124), whether team-collaboration sent the stand-up invitations itself (WS-96), Daniela's accounts (WS-125), who records the decisions (WS-107), and LinkedIn (WS-126).
- **Invitations to send:** the people still at the push step on [the setup leaderboard](../../team/setup/index.html) are waiting on a GitHub invitation; your mentor asks whether WS-124 replaces WS-09's hand-off, so that new usernames come to you.
- **Due today:** the issues named for you with today's date are at the top of [My issues](#issues), sorted by due date.
- **From your mentor:** the latest note is in [people/angelo/mentor](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/mentor); it is material, take what helps.

## 2. Is everyone connected? {#connected}

Who is stuck, and at which step (WS-35). The full picture is [the setup leaderboard](../../team/setup/index.html); everyone's row:

```onboarding all
```

The onboarding issues:

```issues area:onboarding
```

## 3. The machine {#machine}

- **main's protection:** WS-105 and WS-90 below; until they are done, "never push to main" is a rule, not a setting.
- **The last release and its gate:** [the versions](../../admin/versions.html) (the version in the top bar links to its row), built and gated by [CI](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions/workflows/deploy-pages.yml).
- **CI failures:** [failed runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions?query=is%3Afailure).
- **Keys published against agents running:** [the keys page](../../keys/index.html) against [the agents at work](../../wakes/index.html) and [everything on the team](../../team/everything/index.html).

## 4. The technical pool with Jose {#pool}

One pool: you two choose who takes what, and `picked_by` says who did. [Jose's dashboard](../jose/index.html) shows the same board.

```issues area:tech
```

## 5. My agents {#agents}

What each did since the last run is in "My agents, as the team sees them" at the top and in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev); the prompts and schedules are in [your kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md).

- **conductor@web-summit.angelo**: runs your other agents, keeps `people/angelo/`, adds your stand-up items and writes your briefs. Runs 07:20, 12:20 and 17:20 UTC.
- **dev@web-summit.angelo**: the site's build, gate, pipeline and pages. Runs 09:30 and 15:30 UTC.
- **team-collaboration@web-summit.angelo**: the stand-up calendar, a brief, a debrief and follow-ups for every meeting (WS-96), and the daily bottleneck note (WS-97). Runs around each stand-up.
- **dashboard@web-summit.angelo**: keeps this page and your command centre. Joined 3 November with its key on [the keys page](../../keys/index.html); runs 07:30, 12:30 and 17:30 UTC once you give it its scheduled task.

## My issues {#issues}

```issues angelo
```

## My pulse {#pulse}

```pulse angelo
```
