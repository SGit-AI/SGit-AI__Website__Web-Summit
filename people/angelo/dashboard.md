---
title: Angelo's dashboard
summary: The page Angelo reads first. The top is built for Angelo; the rest is kept by Angelo's dashboard agent (dashboard@web-summit.angelo) in five sections: what needs Angelo now, whether everyone is connected, the machine, the technical pool with Jose, and what Angelo's agents are doing.
---
**Your first view is [the command centre](app/index.html)** (your answer, 3 November). This classic page is kept in the same order, as the text version and the fallback: what's pending for you, is everyone connected, the machine, the technical pool with Jose, and your agents. Kept by `dashboard@web-summit.angelo`; tell it what you want first and what you never read.

**My question for you (from last night, still open):** should priority and tags be fields every issue on the board gets, or only something for your own view?

## 1. What's pending for me {#needs}

In the order to do it (07:30 run, Wednesday 4 November).

- **Your key for the site:** Dinis asked this morning that every person adds a key to their browser; until you have one, every page shows a big **Add your key** box. Your conductor issues it in its session and gives you the link ([how](../../agents/index.html#person-key)); Dinis, Jose and Indi have theirs. It is also what lets the dashboard sign what you send (your wish 3, below).
- **Overdue since yesterday:** WS-105 (protect main: only an admin can), WS-33 (repository safe for everyone, with Jose), WS-98 (Meet recording, with Dinis) and WS-100 (the GitHub step for newcomers, with Vicky). They lead [My issues](#issues).
- **Due today:** WS-129 (agents talk through commits only: you and your conductor picked it; Jose's view is in, the rule in CLAUDE.md now), your part of WS-120 (the vaults: Jose's part is done), WS-125's first outline, and most of the technical pool (below), which is due today too: worth splitting with Jose at the 13:00 stand-up.
- **Still open on the agendas** ([13:00 yesterday](../../meetings/2026-11-03-1300/index.html), [18:00 yesterday](../../meetings/2026-11-03-1800/index.html)): WS-09 or WS-124 (you invited Indi, so the GitHub invitations now come from you in practice), WS-125, WS-107, WS-126, WS-129, and your call on WS-96 (whether team-collaboration's invitations count as sending). The 18:00 debrief is waiting for the transcript.
- **From your mentor:** no new note since 16:40 yesterday ([people/angelo/mentor](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/mentor)).

## What I want from my dashboard {#wishlist}

Angelo's ideas, in his words of 3 November (evening), recorded before anything is built. Each says where the command centre is today; the front end (`assets/cc/`) is shared by everyone, so a change there is an issue for the dev agents, not an edit to this page.

1. **A kanban board of cards.** Each task is a card showing its owners, priority, tags, dates and status, and more. *Today:* the command centre's [Team board](app/index.html#board) has status columns with owners and due dates. The board files have no priority or tags yet (urgency is worked out from the due date), so those need new front-matter fields agreed for every issue.
2. **Organise by planned day or by status, and move cards by hand.** *Today:* columns by status only, and no dragging: a status change is an edit to the issue's file. "Planned day" is a new field too, separate from the due date.
3. **Messages and tasks to agents or people, sent securely from the dashboard,** through a vault's append lane. *Today:* the site's feedback pane already seals a message in the browser and appends it to one agent's lane (WS-114). The lane is open to anyone holding the page (WS-119), so a message that asks for an action needs the sender's signature before an agent acts on it. Since 4 November the site gives each person a key in their browser, and the feedback pane signs with it ([the person key](../../agents/index.html#person-key)): the signing half is arriving.

Related ideas to weigh with these: where everyone is at the summit, and card moves sent through the same lane. Both are drafts in this agent's session and not on the board yet.

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
