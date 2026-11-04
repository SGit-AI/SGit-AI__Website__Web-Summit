---
title: Dinis's dashboard
summary: The page Dinis reads first. The top is built for Dinis (the next stand-up, what happened, Dinis's agents). Below it, kept by dashboard@web-summit.dinis at Dinis's word of 3 November: the decisions blocking Dinis first, then the agents (one click between them), today's milestones, the ecosystem's health, the KPIs, and the OKRs to set.
---
**Flick:** [**Only you**](#only-you) · [**Decide**](#decide) · [**Agents**](#agents) · [Today](#today) · [Health](#health) · [KPIs](#kpis) · [OKRs](#okrs) · [My issues](#issues) · in the command centre: [decisions](app/index.html#waiting) · [agents](app/index.html#agents)

**New, 4 November:** [your lab](lab/index.html), browser experiments from a conversation to an agent policy, and the first, [the policy studio](lab/studio/index.html). (Added by dev@web-summit.dinis.)

Kept by `dashboard@web-summit.dinis`. What Dinis asked for (3 November, 01:30 UTC): *"the status of all my agents, the status of the other agents, the health of the main ecosystem, any key decisions that are blocking for me, the major milestones for the day. And then we look at a bunch of KPIs, and we need to set a bunch of OKRs and KPIs."* Then (3 November): *"I'd like to see both, but you prioritize the decisions blocking me. Also make it easy to flick between one and the other."* So: the decisions first, the agents second, one click between them here and in [your command centre](app/index.html). Every number lives on the page it links to, so nothing here goes stale.

## 1. Decisions blocking me {#blocking}

Ranked by **who is blocked, and whether only you can act**, then the due date; at most five in each list ([WS-151](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/board/WS-151-incident-ws-145-not-surfaced-to-dinis.md), the incident on why WS-145 was buried here). As of 16:35 UTC, Wed 4 Nov.

### Only you can do this {#only-you}

1. **WS-145: give Indi write access to the newsroom repository.** Blocks Indi's newsroom desks (WS-141), and Vicky's, which moved to that repository at 16:16. Under a minute: [SGit-AI/SGit-AI__Website__Newsroom__Web-Summit](https://github.com/SGit-AI/SGit-AI__Website__Newsroom__Web-Summit), *Settings, Collaborators and teams, Add people*, `riskmandate-indi`, **Write**. Angelo is not an admin there (`a6c8a915`), so it is yours alone.
2. **WS-09: Nimay's push access to this repository.** Nimay is still at L1 ([the leaderboard](../../team/setup/index.html)); check the invitation went out to his GitHub account, in this repository's *Collaborators*.
3. **WS-115: the OpenRouter key, one per agent, sealed and signed by you.** Overdue since yesterday; the agents that need a model wait on it.
4. **WS-105: protect `main`** (*Settings, Rules*: pull requests only, merged by you). Overdue since yesterday; nobody is blocked, but every agent with push can still reach `main`.
5. **WS-13: the merch budget.** Due today at 12:00 and still open; your yes of 3 Nov (WS-48) may close it: say so.

### Decide at the 18:00 stand-up {#decide}

Twenty decisions for you on [your 18:00 briefing](../../meetings/2026-11-04-1800/dinis/index.html); nothing at 14:30 was recorded as decided. The five that block the most:

1. **Who records the stand-up decisions** (WS-107): until this is decided, every other decision carries over, which is why there are twenty.
2. **LinkedIn before Lisbon**, who owns it and the first post (WS-126), a day late.
3. **The RiskMandate paragraph**, who writes it, by when (WS-15): tomorrow's outreach needs it.
4. **One priority for this week**, said in one place (from Vicky's pulse).
5. **The newsroom**: Indi's patch and who owns which desk (WS-141); the access itself is item 1 above.

The other fifteen are on [the briefing](../../meetings/2026-11-04-1800/dinis/index.html), including the OKRs ([the draft below](#okrs)).

### Also {#also}

- **Done since yesterday:** the merch yes (WS-48, your words to Silvio, 3 Nov 14:45 UTC: *"Yes to me for the [price withheld]. If you are happy I'm happy."*); your sizes, XL and XL (WS-130); your print set signed off with your key (WS-113).
- **The latest conductor brief:** [the updates](../../updates/index.html). Overdue and at risk: [the board's health](../../board-health/index.html). Everything for you: [my issues](#issues).
- **Your lab:** [people/dinis/lab/](lab/index.html), the first experiment being [the policy studio](lab/studio/index.html) (WS-137).

**→ [Flick to the agents](#agents)**

## 2. Agents: mine, then the team's {#agents}

- **Mine:** [my agents, as the team sees them](#my-agents) (built at the top of this page: each one's job, commits and last run), or as an app: [command centre, agents](app/index.html#agents).
- **The team's:**
  - [The agents at work](../../wakes/index.html): every agent's wakes, newest first.
  - [Everything on the team](../../team/everything/index.html): every person, every agent, its commits and its last run; [the map](../../team/map/index.html) for the picture.
  - [The ABPs](../../abp/index.html): the behaviour policy each agent runs under.
  - Other people's command centres: [Silvio's](../silvio/app/index.html) (the first, the design they all share), [Vicky's](../vicky/app/index.html), [Angelo's](../angelo/app/index.html), [Jose's](../jose/app/index.html), [everyone's](../../team/index.html).

**→ [Flick back to the decisions](#blocking)**

## Today's milestones {#today}

From [the start page](../../start/index.html#what) and [the stand-ups](../../meetings/index.html):

- **13:00 and 18:00 UTC (= Lisbon): the stand-ups.** Read the briefing before each; say *"acknowledge"* after.
- **Today, Wednesday 4 Nov, is the last day of setting up the team.** Everyone to L4 and the agents on their own schedules: [the setup leaderboard](../../team/setup/index.html).
- **Tomorrow, Thursday 5 Nov: the targets**, then the big outreach on Thursday and Friday. **The week:** Saturday 7 Nov the plan, 10 to 12 Nov the summit (our stand day is Thursday 12).

*[↑ decisions](#blocking) · [agents](#agents) · [command centre: decisions](app/index.html#waiting) · [agents](app/index.html#agents)*

## The ecosystem's health {#health}

- **The site:** [the live version and every release](../../admin/versions.html); a release exists only if the gate was green.
- **CI:** [the deploy workflow's runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions) on GitHub.
- **Security:** [the security reviews](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/security/reviews), twice a day, by `security@web-summit.dinis`.
- **The board:** [its health](../../board-health/index.html), meaning what is overdue, unowned or at risk.
- **The people:** [the pulse](../../pulse/index.html), meaning who is blocked and who has gone quiet.
- **The keys and vaults:** [the keys page](../../keys/index.html), [the vaults](../../vaults/index.html).

*[↑ decisions](#blocking) · [agents](#agents) · [command centre: decisions](app/index.html#waiting) · [agents](app/index.html#agents)*

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

*[↑ decisions](#blocking) · [agents](#agents) · [command centre: decisions](app/index.html#waiting) · [agents](app/index.html#agents)*

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

*[↑ decisions](#blocking) · [agents](#agents) · [command centre: decisions](app/index.html#waiting) · [agents](app/index.html#agents)*

## My issues {#issues}

```issues dinis
```
