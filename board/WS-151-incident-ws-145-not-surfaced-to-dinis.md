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
