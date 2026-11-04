---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
**Your first view is [the command centre](app/index.html)** (your answer, 3 November). This classic page is kept in the same order, as the text version and the fallback: what's pending for you, is everyone connected, the machine, the technical pool with Jose, and your agents. Kept by `dashboard@web-summit.angelo`; tell it what you want first and what you never read.

**My questions for you (the app brief, below):** what "My tasks" means (picked by you and your agents, or naming you), who may see locations, which extra panes go in, and whether to take the map's freshness question to Dinis.

## 1. What's pending for me {#needs}

In the order to do it (12:30 run, Wednesday 4 November).

- **The 13:00 stand-up** ([agenda](../../meetings/2026-11-04-1300/index.html)): may `dev@web-summit.angelo` change shared site code through a board issue it has picked (WS-34, your conductor's item), and may Vicky's agents have an inbox in the Feedback pane (WS-64).
- **WS-136, due 18:00:** you added your site key this morning (thank you, says your mentor); the last step is one signed message from the Feedback pane. A lane to your own conductor is being set up by your vault agent; the lane the pane offers today already completes the step.
- **Overdue and due today:** at the top of [My issues](#issues): WS-105 (protect main), WS-33 and WS-98 since yesterday; WS-129, your part of WS-120 and most of the technical pool today.
- **Still open on yesterday's agendas** ([13:00](../../meetings/2026-11-03-1300/index.html), [18:00](../../meetings/2026-11-03-1800/index.html)): WS-09 or WS-124, WS-125, WS-107, WS-126, WS-129, and your call on WS-96.
- **From your mentor (11:41):** no question today ([people/angelo/mentor](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/mentor)).

## My own app: the brief in progress {#wishlist}

Angelo is shaping, with this agent, a command centre of his own in `people/angelo/app/` (its own `data.mjs`, `app.js` and `app.css`, which the build uses in place of the shared ones), so nobody else's view or data changes; others take what they like. Agreed so far (4 November):

- **A kanban of every task**, "My tasks" selected by default; filters and columns or swim-lanes by status, due date, picked-by and workstream. The target owner (`for`) is shown but never filtered on or changed.
- **Moving a card is a message to the conductor**, which makes the change as usual; no new process. Each message carries the old value, so a conflict is asked about, not overwritten.
- **Every message is sealed from the start**: to the recipient's public key, signed with Angelo's person key, through the recipient's append lane. When a key or a lane is missing, the app says which and how to get it.
- **A collaboration board** of everyone, people and agents, with links, roles and work in progress, and messages to anyone from it.
- **A map that follows what people declare**: a world map outside the venue, a Web Summit zones map inside, nothing when nobody shares. Each person chooses on the map, touch first: off, free text, a zone (picked or from GPS), or precise GPS, and changes it any time.

Open: what "My tasks" means; how locations stay fresh when an append lane is read only on an agent's run (a question for Dinis); who may see locations; and whether the brief adds the panes "Needs me now", "Sent and inbox", "Summit days" and "The machine". The brief goes to `dev@web-summit.angelo` once Angelo has answered.

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
