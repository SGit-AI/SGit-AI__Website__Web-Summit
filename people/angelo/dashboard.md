---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
**Your first view is [the command centre](app/index.html)** (your answer, 3 November). This classic page is kept in the same order, as the text version and the fallback: what's pending for you, is everyone connected, the machine, the technical pool with Jose, and your agents. Kept by `dashboard@web-summit.angelo`; tell it what you want first and what you never read.

**My question for you:** the kanban and the collaboration board are live in [your app](app/index.html#kanban): what should I take off this classic page now that they are?

## 1. What's pending for me {#needs}

In the order to do it (17:30 run, Wednesday 4 November). Your app now has this as a filter: [Kanban, Needs me now](app/index.html#kanban).

- **The 18:00 stand-up** ([agenda](../../meetings/2026-11-04-1800/index.html)): today's 13:00 moved to 14:30, and its two items for you carry over: may `dev@web-summit.angelo` change shared site code through a board issue it has picked (WS-34), and may Vicky's agents have an inbox in the Feedback pane (WS-64). Dinis's conductor opens the 18:00 deck with open points (urgent, late, logistics), at your signed ask.
- **WS-136 closes at 18:00:** your signed messages have reached Dinis's conductor and Jose's page views, so the step looks done; the issue is still open on the board for the conductors to close.
- **Overdue and due today:** in [My issues](#issues) and the app's Needs me now: WS-105 (protect main), WS-33, WS-98, WS-129, your part of WS-120 and the technical pool.
- **Still open on yesterday's agendas** ([13:00](../../meetings/2026-11-03-1300/index.html), [18:00](../../meetings/2026-11-03-1800/index.html)): WS-09 or WS-124, WS-125, WS-107, WS-126, WS-129, and your call on WS-96.
- **Your conductor's proposal for your profiles** (meet pages, team profiles, LinkedIn): [people/angelo/profiles-proposal.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/profiles-proposal.md).

## My own app: the brief {#wishlist}

Angelo's command centre of his own, in `people/angelo/app/`, so nobody else's view or data changes; others take what they like. The brief was agreed with Angelo on 4 November and handed to `dev@web-summit.angelo`, which keeps it as `people/angelo/app/BRIEF.md` with the code.

- **A kanban of every task:** "My tasks" on by default, "Needs me now" as a filter, filters by picked-by, due, workstream, status and keyword, columns and swim-lanes by any of those, sort by any field. Moving a card is a sealed message to the conductor.
- **Messages sealed from the start,** with their status as icons on the card (red on a possible conflict) and a Messages pane for all of them.
- **A collaboration board** of people and agents, with schedules and the machine.
- **Summit days:** the public schedule, then sealed summaries of people's own calendars.
- **A map each person shares on their own terms,** with a time on every location; the presence agent central, proposed to be `team-collaboration@web-summit.angelo`, once the team agrees.

**Built on 4 November by `dev@web-summit.angelo`:** slice 0 (your own app, the shared one extended), slices 1 and 2 ([the kanban](app/index.html#kanban): cards, My tasks and Needs me now, filters, columns and swim-lanes, sort, bookmarkable views; read-only, no drag on the phone) and slice 5 (the collaboration board, read-only). Next: slice 3, sealed sending, which waits on the lane to your conductor that your vault agent is setting up. The brief is [BRIEF.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/app/BRIEF.md).

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
- **team-collaboration@web-summit.angelo**: the stand-up calendar, a brief, a debrief and follow-ups for every meeting (WS-96), and the daily bottleneck note (WS-97). Runs at 07:40 (the daily note), 12:40 and 17:40 (each stand-up's brief) and 14:15 and 19:15 (its debrief, or when Angelo wakes it), UTC.
- **vault@web-summit.angelo**: your SGit vaults: it published your first vault after an audit and corrected the vault guide from that run (WS-120). Its schedule is proposed, not set yet (09:50 and 15:50 UTC, at your word).
- **dashboard@web-summit.angelo**: keeps this page and your command centre. Joined 3 November with its key on [the keys page](../../keys/index.html); runs 07:30, 12:30 and 17:30 UTC on its scheduled task.

## My issues {#issues}

```issues angelo
```

## My pulse {#pulse}

```pulse angelo
```
