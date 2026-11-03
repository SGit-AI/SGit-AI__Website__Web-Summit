---
title: The board's health
summary: What the project manager read on the board (board/WS-NN-*.md), the plan and the stand-up agenda, at 07:50, 12:50 and 17:50 UTC: deadlines at risk today and tomorrow, what waits on Dinis, dependencies, duplicates and each person's load. WS-46, until pm@web-summit.vicky takes it over.
---
Written by project-manager@web-summit.dinis from the issue files in `board/` ([the board](../briefs/index.html#issues)), `data/meetings/` ([the stand-ups](../meetings/index.html)), `people/*/onboarding.json` and the git log. It covers WS-46 until Vicky's own agent, pm@web-summit.vicky, takes it over. Each run replaces the last; earlier runs are in the file's git history.

## Run of 3 November 2026, 07:50 UTC

Read: everything at commit `159ca9c` on dev (v0.2.52).

**The board in one line.** 124 issue files: 101 open, 6 picked, 4 in progress, 13 done (two of them moved to done this run, below). Every issue has a `for:`. Two files share the number WS-106 (below).

**Waiting on Dinis: one message answers these.** They are also one item on the 13:00 stand-up.

1. **WS-09, the GitHub invitations.** Nimay and Indi stop at the push step (the mentor's decision on the 13:00 agenda). Sarah and Daniela have not started.
2. **WS-113, the print sign-off, by 16:00 today.** The files are on [/print/](../print/index.html). The printer that fits needs confirmation by the end of today (procurement@web-summit.silvio, 3 Nov 00:40).
3. **WS-105, protect main.** The github-pages environment allows main. Still to confirm: GitHub refuses an agent's push to main.
4. **WS-88.** May a role address (the Drive service account) be public?
5. **WS-115.** The OpenRouter key, one per agent, sealed and signed by you.
6. **WS-62 and WS-56** (the vote and the shirt lines, due yesterday, nothing came in): close them as overtaken by the sign-off, or keep them open? Also: should the done WS-106 be renumbered WS-124?

**Due today, Tuesday 3 November, and at risk.**

| Issue | For | Due | Reading |
|---|---|---|---|
| WS-113 Print files and the Official Sign-off | dinis, everyone | 16:00 | **The day's critical path.** Four fixes to the files first (designer), then each person signs. It also needs sizes (next row). |
| WS-55 Everyone's shirt and hoodie size | everyone | was Mon 2 Nov | **Overdue, and still needed.** WS-113's order sheet reads each person's `people/<id>/merch.json`, and none exists yet. |
| WS-116 Sign-off bound to its person | silvio, dinis | 16:00 | Has to land before the sign-off means anything. |
| WS-107 Decisions in the person's own words | dinis, everyone | 13:00 | `agenda.mjs decide` already records them. Done once someone runs it at today's stand-up. |
| WS-01, WS-02, WS-08, WS-30, WS-73 | everyone | today | Five of the nine are connected: Dinis (L6), Jose (L5), Angelo and Vicky (L2) and Silvio (L1). So at most five can do these today. |
| WS-33, WS-35, WS-100 | angelo, jose, vicky | today | The repository made safe, setup help, and the GitHub step written down. These are the way out of the row above. |
| WS-10, WS-14, WS-98 | dinis | today | Workspace email, who runs the newsroom, Meet recording. None picked up. |
| WS-23, WS-54, WS-101 | nimay, vicky, silvio | today | WS-101 (procurement@web-summit.silvio writes outside `people/silvio/`) needs Silvio's answer, not a fix by others. |

**Due tomorrow, Wednesday 4 November.** The merch deadline is noon: WS-57 (the final artwork, in progress) and WS-48 (printing logistics) both follow WS-113. WS-13 (the budget) is due at the same hour. WS-58 is done: there is no sponsor, the merch is RiskMandate only. Most of the tech column falls due too: WS-34, WS-39 (picked by Jose), WS-41, WS-45, WS-64, WS-68, WS-74, WS-77, WS-78, WS-91, WS-114, WS-118, WS-119, WS-120, WS-122.

**Dependencies.**

- **Connecting people unblocks everything else.** WS-09 (invitations) leads to WS-02 (push), then WS-03 (key), then WS-112, WS-99 and WS-121 (each person's conductor, dashboard and vault agents). Jose went from L3 to L5 overnight once pki.sgit.ai was allowed in his environment. The same path works for the others.
- **Merch:** WS-116, then WS-113 (16:00 today), then WS-57 and WS-48 (noon tomorrow), then the print order. Sizes (WS-55) feed WS-113's order sheet.
- **Vaults:** WS-106 (the vault-key check, done), then WS-102 (done), then WS-120 (Angelo, Jose and Silvio first, tomorrow), then WS-121 (everyone, Friday).

**Tidied this run.**

- WS-67 (start the team's scheduled agents) is **done**: all nine are on a schedule (commit `182807d`).
- WS-11 is **merged into WS-67**, which its own text says supersedes it. The note is in both files.
- WS-90 and WS-105 overlap (branch protection), and WS-105 is the main half. The note is in both files; close them together.
- **Two issues are numbered WS-106**, opened two minutes apart: the estate's repository standard (open, Angelo and Jose) and the vault-key check (done). The note is in both files.
- **Stand-ups:** three carried items merged. "If the design votes do not come in" and "the design: final set" go into today's print-order decision, and "where is everyone on connecting" into the WS-09 invitations decision. Today's 13:00 has 15 open items, 10 of them decisions.
- WS-65 (stop rewriting ~160 pages) still looks done by WS-83 and WS-85. That is for Angelo, Jose or the dev agent to confirm.

**Load.** Open issues per named owner (in brackets, due by tomorrow): Angelo 37 (22), Dinis 36 (28), Jose 30 (17), Silvio 16 (11), Nimay 15 (10), Vicky 13 (12), Indi 12 (5), Sarah 9 (6), Daniela 2 (1). Another 22 are for everyone and 6 for anyone. Dinis's 28 due by tomorrow is the bottleneck. Most of them are one-line answers, which is why they are listed first.

**The pulse.** No check-ins yet in any `people/*/pulse/` folder. WS-07 starts today.
