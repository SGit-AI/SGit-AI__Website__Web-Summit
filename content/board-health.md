---
title: The board's health
summary: What the project manager read on the board (board/WS-NN-*.md): deadlines at risk, issues without an owner, dependencies, duplicates and each person's load. The note WS-46 asks for, until pm@web-summit.vicky takes it over.
---
Written by project-manager@web-summit.dinis from the issue files in `board/` ([the board](../briefs/index.html#issues), [how to pick one up](../start/index.html)). It covers WS-46 (the board's health) until Vicky's own agent, pm@web-summit.vicky, is connected and takes it over. It reports what the files and commits say. It does not move issues: that is the owners' job and the conductor's.

## Run of 2 November 2026, 03:00 UTC (the first run)

Read: `board/` and `people/*/onboarding.json` at commit `f1e31ea` on dev (v0.1.35).

**The board in one line.** 84 issues (WS-01 to WS-84): 83 open, 1 done (WS-83), none picked, none blocked. Every issue has a `for:`, so no issue is without an owner. 14 are for `everyone` and 6 for `anyone`.

**Due today, Monday 2 November.**

| Issue | For | Due | Reading |
|---|---|---|---|
| WS-67 Start the team's scheduled agents | dinis | today | Under way: the conductor, the journalist and pulse made their first runs this morning (commits `849a1e6`, `14df86f`, `5adfeaa`). Security, designer and dev have no commits yet. |
| WS-11 Start the team's scheduled sessions | dinis | today | Its own file says it is superseded by WS-67. It can be closed as a duplicate. |
| WS-62 Vote on the design | everyone | 16:00 | **At risk.** No vote is in yet (no `people/*/feedback/` folder exists), and eight of the nine people are at level 0, so they cannot push a vote yet. |
| WS-55 Everyone's shirt and hoodie: size, colour, message | everyone | today | **At risk**, for the same reason as WS-62. |
| WS-56 The shirt messages: RiskMandate openers | sarah, nimay, indi | today | **At risk**: none of the three is connected yet. |
| WS-63 The final design set, approved, and the print files | sarah, dinis | 20:00 | Depends on WS-62, WS-55 and WS-56. If the votes do not come in, Dinis and Sarah decide on what is there. |

**Dependencies worth writing down.**

- **Getting connected comes first.** WS-09 (Dinis adds everyone's GitHub account, Tue 3 Nov) gates WS-02 (L2, push access), which gates every issue a person closes by committing. Then WS-02 leads to WS-03 (a PKI key) and WS-12 (Dinis verifies the keys), and on to WS-04 and WS-05. Today only Dinis is past level 0.
- **The merch chain**, all due by Wed 4 Nov, 12:00: WS-62, WS-55 and WS-56 lead to WS-63 (the final set and print files), then to WS-57 (the final artwork) and WS-48 (printing logistics, Vicky and Silvio). WS-58 (a sponsor) and WS-13 (the budget if no sponsor comes) are due at the same hour, so the budget decision cannot wait for the sponsor.
- **Outreach**: WS-30 (owners for the 20 priority-1 companies, Tue 3 Nov) comes before WS-25 (the first five companies, Wed 4 Nov) and WS-26 (50 targets, Thu 5 Nov).

**Duplicates and stale issues.**

- WS-11 is superseded by WS-67 (its own text says so).
- WS-65 (stop rewriting ~160 pages) looks done by WS-83: since v0.1.32 generated pages are no longer committed, and `admin/metrics.json` has the first before and after numbers (`866fac8`). Angelo and Jose, as its owners, or the dev agent, can confirm and close it.

**Load.** Issues per named owner: Angelo 29, Jose 26, Dinis 17, Nimay 15, Silvio 14, Indi 12, Vicky 10, Sarah 8, Daniela 2. Angelo and Jose carry the tech column (WS-33 to WS-45, WS-64 to WS-84). Both are at level 0, and 13 of their issues are due by Wed 4 Nov. That is the board's biggest risk this week.

**To raise with Dinis.**

1. WS-09 and WS-67 are the two things only you can unblock today. WS-09 holds back every person's first commit.
2. The 16:00 vote (WS-62) will probably be thin. Decide now whether the 20:00 final set (WS-63) goes ahead on the votes that are in.
3. WS-11 can be closed, and WS-65 confirmed as done by WS-83.
4. project-manager@web-summit.dinis has no section on [the agents page](../agents/index.html) yet. This run followed WS-46's definition. A section (job, schedule) would fix what future runs do.
