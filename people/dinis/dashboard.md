---
title: Dinis's dashboard
summary: Dinis's first dashboard, full width: what only Dinis can do, the decisions ranked with one click to decide or delegate (signed with Dinis's key, sent to the dashboard agent's lane), Dinis's agents and the team's, the machine's health and what is next. Built from the board, the agenda and the git log at every release.
layout: cockpit
---
## How this page works {#how}

Kept by `dashboard@web-summit.dinis`, from what Dinis asked on 5 November: *"this should be my first dashboard ... the key decisions, what I need to know, what's happening ... a very good way to make those decisions ... prioritize those decisions ... a way for me to delegate those to others"*. The top is built at every release by `admin/build/cockpit.mjs` from the board (an issue with `only: dinis` is in **Only you can do this**, ranked by its `blocks:`), the open decisions for Dinis on every agenda (ranked by: blocks someone, overdue, urgent, waiting longest), and the git log. Settings and milestones: `people/dinis/cockpit.json`. The deeper view is [the command centre](app/index.html); everything for Dinis on the board is in [the issues](../../briefs/index.html#issues).

## KPIs {#kpis}

Where each one is read today. A KPI with no page yet says so; that is a gap to close, not a number to invent.

| KPI | Read it on |
|---|---|
| People at each level (target: the seven at L4 by Wed 4 Nov) | [the setup leaderboard](../../team/setup/index.html) |
| Agents running, and which committed in the last 24 hours | [everything on the team](../../team/everything/index.html), [the agents at work](../../wakes/index.html) |
| Releases and commits today | [since you last looked](#since), at the top of this page |
| Issues open, done, overdue, unowned | [the board's health](../../board-health/index.html) |
| Pulse check-ins per person per day (target: three) | [the pulse](../../pulse/index.html) |
| Companies on the map, and the card-to-analysis loop (WS-19) | [the companies](../../companies/index.html) |
| Meetings booked for the summit, and hot leads | **not tracked yet**: they belong in the private vault, with a count only on the site |
| Security findings open | [the security reviews](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/security/reviews) |

## OKRs: a draft for Dinis to set {#okrs}

**A proposal from `dashboard@web-summit.dinis`, not decided.** It is on the agenda as a decision for you. Until you set them, these are drafts. The objective is from [your brief](../../brief-dinis/index.html#in-one-line), and the dates are from [the start page](../../start/index.html#what).

**O1. RiskMandate understood, tried and bought at Web Summit.**
- KR1: the message (one paragraph, three openers, one demo) agreed and used in every brief (WS-15).
- KR2: two or three demos rehearsed, each runnable from a phone or laptop in five minutes (WS-18).
- KR3: the card-to-analysis loop tried on three companies, then run on every card at the summit (WS-19).
- KR4: by Saturday 7 Nov, the meetings booked and a schedule for each of us (target number: yours to set).

**O2. A team that runs itself: every person connected, every agent on its own schedule.**
- KR1: the seven at L4 by Wednesday 4 Nov, and at L6 before the summit.
- KR2: every running agent has an ABP and a published key.
- KR3: three pulse check-ins a day from each person; nobody quiet for more than a day without the pulse agent flagging it.

**O3. A healthy ecosystem.**
- KR1: every push to `dev` is a released version with a green gate; nothing pushed to `main` except by a pull request you merge (WS-105).
- KR2: a security review twice a day, with no finding left open past the next review.
- KR3: no issue overdue without an owner on the board.

