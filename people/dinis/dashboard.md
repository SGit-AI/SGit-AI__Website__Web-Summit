---
title: Dinis's dashboard
summary: The page Dinis reads first. The top is built for Dinis (the next stand-up, what happened, Dinis's agents). Below it, kept by dashboard@web-summit.dinis at Dinis's word of 3 November: the decisions blocking Dinis, today's milestones, the team's agents, the ecosystem's health, the KPIs, and the OKRs to set.
---
**[Your command centre](app/index.html)**: the same data as this page, as an app (the shared engine from Silvio's design).

Kept by `dashboard@web-summit.dinis`. What Dinis asked for (3 November, 01:30 UTC): *"the status of all my agents, the status of the other agents, the health of the main ecosystem, any key decisions that are blocking for me, the major milestones for the day. And then we look at a bunch of KPIs, and we need to set a bunch of OKRs and KPIs."* Your agents' status is in the built part above ([my agents](#my-agents)); the rest follows in that order. Every number lives on the page it links to, so nothing here goes stale.

## Blocking on me {#blocking}

- **The next stand-up:** [your briefing and the agenda](#standup), at the top of this page. The decisions marked for you there are the ones blocking someone.
- **The latest conductor brief:** [the updates](../../updates/index.html), at most three asks, each with a recommendation.
- **What waits on you on the board:** [the board's health](../../board-health/index.html), and the issues that are only yours: WS-09 (everyone's GitHub access), WS-10 (Workspace email), WS-13 (the merch budget), WS-14 (who runs the newsroom), WS-105 (protect `main` in the repository's settings). Full list under [my issues](#issues).

## Today's milestones {#today}

From [the start page](../../start/index.html#what) and [the stand-ups](../../meetings/index.html):

- **13:00 and 18:00 UTC (= Lisbon): the stand-ups.** Read the briefing before each; say *"acknowledge"* after.
- **Now to Wednesday 4 Nov: the team set up.** Everyone to L4 and the agents on their own schedules: [the setup leaderboard](../../team/setup/index.html).
- **The week:** Thursday 5 Nov the targets, Thursday and Friday the big outreach, Saturday 7 Nov the plan, 10 to 12 Nov the summit (our stand day is Thursday 12).

## The team's agents {#team-agents}

- [The agents at work](../../wakes/index.html): every agent's wakes, newest first.
- [Everything on the team](../../team/everything/index.html): every person, every agent, its commits and its last run; [the map](../../team/map/index.html) for the picture.
- [The ABPs](../../abp/index.html): the behaviour policy each agent runs under.
- Other people's command centres: [Silvio's](../silvio/app/index.html) (the first person's app), [Vicky's](../vicky/index.html), [Angelo's](../angelo/index.html).

## The ecosystem's health {#health}

- **The site:** [the live version and every release](../../admin/versions.html); a release exists only if the gate was green.
- **CI:** [the deploy workflow's runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions) on GitHub.
- **Security:** [the security reviews](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/security/reviews), twice a day, by `security@web-summit.dinis`.
- **The board:** [its health](../../board-health/index.html), meaning what is overdue, unowned or at risk.
- **The people:** [the pulse](../../pulse/index.html), meaning who is blocked and who has gone quiet.
- **The keys and vaults:** [the keys page](../../keys/index.html), [the vaults](../../vaults/index.html).

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

## My issues {#issues}

```issues dinis
```
