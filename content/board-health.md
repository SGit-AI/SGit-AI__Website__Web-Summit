---
title: The board's health
summary: What the project manager read on the board (board/WS-NN-*.md), the plan and the stand-up agenda, at 07:50, 12:50 and 17:50 UTC: deadlines at risk today and tomorrow, what waits on Dinis, dependencies, duplicates and each person's load. WS-46, until pm@web-summit.vicky takes it over.
---
Written by project-manager@web-summit.dinis from the issue files in `board/` ([the board](../briefs/index.html#issues)), `data/meetings/` ([the stand-ups](../meetings/index.html)), `people/*/onboarding.json` and the git log. Vicky picked up WS-46 on 3 November; her own note, written by pm@web-summit.vicky once a day at 07:40 for her deadlines, is [people/vicky/board-health.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/board-health.md) . This page stays the team-wide view until Vicky decides otherwise. Each run replaces the last; earlier runs are in the file's git history.

## Run of 4 November 2026, 17:50 UTC

Read: everything at commit `b1350b2` on dev (v0.2.327). Since 12:50: seven new issues (WS-145 to WS-151), two done (WS-100; WS-23 with five booked meetings in the private vault), and an incident, WS-151: why WS-145 sat buried on Dinis's dashboard. My review is in the file.

### Only Dinis can do this {#only-dinis}

At most five, ranked by who is blocked. Each one is an action no agent can take. From WS-151: this block comes first, and each ask stands alone.

| # | Issue | Who is blocked | The action |
|---|---|---|---|
| 1 | **WS-145** Indi's write access to the newsroom | Indi, and her newsroom desks (WS-141) | On GitHub, in SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, go to Settings, Collaborators and teams, Add people, and add `riskmandate-indi` with Write. Angelo is not an admin there (`a6c8a91`). |
| 2 | **WS-09 / WS-124** who sends the GitHub invitations | Nimay (still to create `riskmandate-nimay`) | Say "Angelo sends them" in one line, and the start page says one thing. |
| 3 | **WS-113** your yes on the generic-QR set and the RiskMandate logo | The printer: sign-offs are at 3 of 7, and delivery is now aimed at Monday 9 November | On [/print/](../print/index.html). |
| 4 | **WS-105 / WS-90** protect main | Every agent: "never push to main" is a rule with no barrier behind it | On GitHub, in the repository's Settings, Rules, add a rule for `main` that requires a pull request. |
| 5 | **WS-115** the OpenRouter key, one per agent | Ask Claude on the command centres | Seal and sign one key per agent. |

Also yours, but not blocking anyone: WS-10 (workspace email), WS-12 (verify keys as the anchor), WS-88 (a public role address), WS-98 (Meet recording), and whether to close WS-62 and WS-56 and renumber the duplicate WS-106.

### The rest of the board

**In one line.** 152 issue files: 106 open, 20 picked, 5 in progress, 21 done. 54 were due today and are not done, 41 of them with nobody in `picked_by:`. Tomorrow, Thursday 5 November, adds 23 more with nobody on them: WS-05, WS-17, WS-20, WS-21, WS-26, WS-36, WS-38, WS-42, WS-69, WS-75, WS-76, WS-79, WS-80, WS-110, WS-111, WS-117, WS-127, WS-131, WS-133, WS-138, WS-139, WS-144 and WS-150.

**Still the biggest risk.** The RiskMandate core (WS-15, WS-16, WS-18, WS-19, WS-22, WS-66, WS-109) was due today with nobody on it. WS-17 (material for investors), WS-20 (the landing page) and WS-21 (the offer and how to buy it) are due tomorrow, also with nobody on them. "Who writes the one paragraph" has been on the agenda since 2 November.

**Stand-ups are not deciding.** One decision has been recorded since Tuesday morning: the print order. The 18:00 has 29 open items, 27 of them carried over. Who records (WS-107) is still open, and moving the midday slot (13:07) is now an item too.

**The merch.** The printer is aiming for Monday 9 November. Who collects is on the agenda (logistics@web-summit.vicky). Sign-offs are still at 3 of 7 (Angelo, Dinis, Vicky). /impressao/ has the files in Portuguese for the printer (procurement@web-summit.silvio).

**WS-31 (the schedules, Vicky).** WS-23 is done, so the booked meetings are in the vault. WS-25 (the first five companies) is still an open decision. WS-29 (hot leads) and WS-32 (sessions) still have nobody on them.

**Tidied this run.** On the 18:00 agenda, the two newsroom decisions (13:00 and 18:00) are made one, and the only-Dinis part, WS-145, is first in my item, standing alone. On the board, WS-145's `agents:` line no longer says Angelo can do it. The review of the WS-151 findings is in the file.

**Load.** Open issues per named owner: Dinis 54, Angelo 46, Jose 35, Indi 20, Nimay 17, Silvio 16, Vicky 11, Sarah 10, Daniela 4. Another 24 are for everyone and 6 for anyone.

**The pulse.** Still two check-ins in total: Vicky (3 November, morning) and Jose (3 November, evening). None on Wednesday.
