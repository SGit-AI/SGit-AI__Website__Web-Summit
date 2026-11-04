---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
**Your first view is [the command centre](app/index.html)** (your answer, 3 November). This classic page is kept in the same order, as the text version and the fallback: what's pending for you, is everyone connected, the machine, the technical pool with Jose, and your agents. Kept by `dashboard@web-summit.angelo`; tell it what you want first and what you never read.

**How this page is kept (from 4 November, [the protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md#protocol)):** `dashboard@web-summit.angelo` takes its work from your conductor and reports to it in commits; what it needs from you reaches you in your conductor's digest (about 08:00, 13:00 and 18:00 UTC).

## 1. What's pending for me {#needs}

In the order to do it (18:30 run, Wednesday 4 November). Your app has this as a filter: [Kanban, Needs me now](app/index.html#kanban). Your conductor's digest (about 08:00, 13:00 and 18:00 UTC) carries the questions only you can answer.

- **Waiting on your go (tier 3), in your conductor's digest:** the lane to your conductor (it unblocks the app's sealed messages, slice 3, and your vault agent's next step), the signature rule for your conductor, and the presence agent proposed for team-collaboration (everyone's locations).
- **The 18:00 stand-up** ([agenda](../../meetings/2026-11-04-1800/index.html)): WS-34 (may your dev agent change shared site code) and WS-64 (Vicky's inbox) carried from the moved 13:00; team-collaboration debriefs it at 19:15.
- **Overdue and due today:** in [My issues](#issues) and the app's Needs me now: WS-105 (protect main), WS-33, WS-98, WS-129 and your part of WS-120.
- **Settled today:** WS-124 (you send the GitHub invitations, from the-neuronin; WS-100, the long form, is done with Vicky) and WS-136 (your key and signed messages).

**What your agents are on (from your conductor, by priority before Lisbon):** dev: summit days in your app (slice 7), then drafts for WS-64 (booking and "talk to my agent" on the meet pages) and WS-84 (offline pages at the summit); team-collaboration: the stand-up show (WS-150), debriefs and the daily note; helper: the help page (/help/, linked here once it is on the site); vault: waiting on the lane. Jose's agents keep WS-37 and WS-74.

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

- **conductor@web-summit.angelo**: the hub: sends your agents work and takes their reports in commits, keeps `people/angelo/`, and brings you what only you can decide, in a digest about 08:00, 13:00 and 18:00 UTC. Hourly, round the clock.
- **dev@web-summit.angelo**: your own command centre ([the brief](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/app/BRIEF.md)), and drafts for the technical pool. Every two hours, round the clock.
- **team-collaboration@web-summit.angelo**: the stand-ups (calendar, brief, debrief, follow-ups, WS-96), the daily bottleneck note (WS-97) and the stand-up show (WS-150). 07:40, 12:40 and 17:40 UTC, debriefs at 14:15 and 19:15, and its inbox six times a day.
- **vault@web-summit.angelo**: your SGit vaults (WS-120): your first vault published after an audit. 09:50 and 21:50 UTC.
- **helper@web-summit.angelo**: answers setup questions from anyone on the team and keeps the help page (/help/). Every two hours, proposed.
- **dashboard@web-summit.angelo**: keeps this page and your command centre for your conductor, under [the protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md#protocol). Every three hours, round the clock.

All six work through your conductor (the protocol, 4 November): work comes in commits from it, reports go back to it.

## My issues {#issues}

```issues angelo
```

## My pulse {#pulse}

```pulse angelo
```
