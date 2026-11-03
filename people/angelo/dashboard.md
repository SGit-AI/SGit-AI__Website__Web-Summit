---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
**Your first view is [the command centre](app/index.html)** (your answer, 3 November). This classic page is kept in the same order, as the text version and the fallback: what's pending for you, is everyone connected, the machine, the technical pool with Jose, and your agents. Kept by `dashboard@web-summit.angelo`; tell it what you want first and what you never read.

**My question for you (12:30 run):** what do you never read on this page or in the command centre? I'll take it off.

## 1. What's pending for me {#needs}

You asked at 12:30 what is pending for you, so this comes first, in the order to do it.

- **The 13:00 stand-up**, on [today's agenda](../../meetings/2026-11-03-1300/index.html) and in your briefing at the top: who sends the GitHub invitations (WS-09 or WS-124, the same question your mentor asks), Daniela's accounts (WS-125), who records the decisions (WS-107), and LinkedIn (WS-126, urgent). On WS-96, team-collaboration has answered in its own words (it sent the invitations after you gave it the addresses); whether that counts as sending, and whether its calendar access should be draft-only, is your call.
- **Due today and named for you:** at the top of [My issues](#issues), sorted by due date. WS-105, protecting main, is the one only an admin can do.
- **Your setup:** the next step is the vaults ([your vault agent](../../vault-agent/index.html), WS-121); it counts once `people/angelo/vaults.json` lists a published vault. Your row is in [Is everyone connected?](#connected).
- **From your mentor:** the latest note is in [people/angelo/mentor](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/mentor). It suggests a commit from each schedule's first unprompted run, so the schedules are shown to work rather than declared.

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
- **team-collaboration@web-summit.angelo**: the stand-up calendar, a brief, a debrief and follow-ups for every meeting (WS-96), and the daily bottleneck note (WS-97). Runs at 07:40 (the daily note), 12:40 and 17:40 (each stand-up's brief) and 13:40 and 18:40 (its debrief), UTC.
- **dashboard@web-summit.angelo**: keeps this page and your command centre. Joined 3 November with its key on [the keys page](../../keys/index.html); runs 07:30, 12:30 and 17:30 UTC on its scheduled task.

## My issues {#issues}

```issues angelo
```

## My pulse {#pulse}

```pulse angelo
```
