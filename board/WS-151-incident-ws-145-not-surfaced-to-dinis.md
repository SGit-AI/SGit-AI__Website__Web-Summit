---
id: WS-151
title: "Incident: WS-145 (Indi's write access to the newsroom) sat unpicked and buried in Dinis's dashboard list"
area: pm
for: dinis
due: Thu 5 Nov, 13:00
status: open
picked_by: dashboard@web-summit.dinis (investigates), project-manager@web-summit.dinis (reviews)
agents: dashboard@web-summit.dinis owns people/dinis/dashboard.md, the page that should have put it first; project-manager@web-summit.dinis keeps the board's health; conductor@web-summit.dinis opened this and stays out of the investigation.
---
From Dinis, 4 November about 16:40 UTC: *"Can you open an incident to figure out why this high-importance issue (WS-145) was not picked up and shows in that massive list of https://web-summit.sgit.ai/people/dinis/index.html. I think this should be done by one of our agents so that you don't spend your focus here on this."*

**What happened:** WS-145 (add `riskmandate-indi` to SGit-AI/SGit-AI__Website__Newsroom__Web-Summit with write access) was raised by conductor@web-summit.indi at Indi's word around 13:00 on 4 November. Only Dinis or Angelo can do it, it blocks Indi's newsroom desks (WS-141, the newsroom's brief 9, decision 2), and it was also an item on the 13:00 (held 14:30) stand-up. Dinis found it himself, among many rows on his dashboard, hours later.

**The investigation (an incident review, blameless):**

1. **Timeline:** when WS-145 was created; which of Dinis's agents saw it, and when (the dashboard's 12:06 and later wakes, the project manager's runs, the conductor's 12:27 and 14:27 briefs, the mentors); where it appeared on /people/dinis/ and in what position.
2. **Why it was not first:** what rule ranks the dashboard's list (due date, status, who it is for); whether "only Dinis can do it" and "it blocks someone" are signals any ranking uses; how many rows were above it.
3. **Why nobody picked it:** it can only be done by Dinis; was it ever presented to him as a one-click ask (a brief's first ask, a decision card)? The conductor's brief 14 named it inside a combined decision; check whether that was enough.
4. **The fix, proposed (not applied without Dinis's yes):** for example a top block on Dinis's dashboard, "Only you can do this", ranked by who is blocked, capped at five; a gate warning for an issue `for: dinis` that names an action only Dinis can take and is not in the latest brief's asks; the board's health page listing them.
5. **Write-up:** this file, with the timeline, the causes and the proposed fix, by Thursday 13:00; a one-line summary on the stand-up agenda.

Record the findings here; commit `For: conductor@web-summit.dinis`.

**From the reviewer, project-manager@web-summit.dinis (4 November, 16:40 UTC): my own part of the timeline, before the dashboard's findings.**

- WS-145's file was created at **15:16** (`5e2423d`, conductor@web-summit.indi), about two hours after Indi asked. My runs were at 07:50 and 12:50, so no /board-health/ run has read it yet. The next is 17:50.
- Even so, my "Waiting on Dinis" list would not have been certain to pick it up. I build it by hand each run from three things: the due dates, the open stand-up items for Dinis, and the decisions carried over. None of them is the signal this issue carries, "only Dinis (or Angelo) can do it, and it blocks someone". The issue says that in its `agents:` line, as prose.
- **What I will do at 17:50, which is in my own file:** /board-health/ opens with **"Only Dinis can do this"**, at most five rows, ranked by who is blocked, each with the one action and where to do it. WS-145 goes first if it is still open. I will apply the same test on every run: an issue `for: dinis` whose action is a setting, an invitation, a key or a yes that no agent can give.
- **For the fix (item 4), to weigh with the dashboard's findings:** a machine-readable marker would let the dashboard, the conductor's brief and this page rank on the same thing without each re-reading prose. For example, a front-matter field `only: dinis` (or `only: dinis, angelo`) and `blocks: indi`. That changes the board's shape, so it is for Dinis to approve. I will review dashboard@web-summit.dinis's timeline and causes here once they are in, by Thursday 13:00.
