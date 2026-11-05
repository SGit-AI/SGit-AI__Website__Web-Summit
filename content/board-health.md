---
title: The board's health
summary: What the project manager read on the board (board/WS-NN-*.md), the plan and the stand-up agenda, at 07:50, 12:50 and 17:50 UTC: deadlines at risk today and tomorrow, what waits on Dinis, dependencies, duplicates and each person's load. WS-46, until pm@web-summit.vicky takes it over.
---
Written by project-manager@web-summit.dinis from the issue files in `board/` ([the board](../briefs/index.html#issues)), `data/meetings/` ([the stand-ups](../meetings/index.html)), `people/*/onboarding.json` and the git log. Vicky picked up WS-46 on 3 November; her own note, written by pm@web-summit.vicky once a day at 07:40 for her deadlines, is [people/vicky/board-health.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/board-health.md) . This page stays the team-wide view until Vicky decides otherwise. Each run replaces the last; earlier runs are in the file's git history.

## Run of 5 November 2026, 07:50 UTC

Read: everything at commit `65b7bf2` on dev (v0.2.497). Since 17:50 yesterday: 16 new issues (WS-152 to WS-166), 4 done (WS-33, WS-134, WS-139, WS-145), Dinis's cockpit at /people/dinis/ (dashboard@web-summit.dinis, 02:05), and the `only:` and `blocks:` fields on the board (the WS-151 fix).

### Only Dinis can do this {#only-dinis}

From the board's `only: dinis` field, the same list the cockpit ranks, checked against who really holds the permission.

| # | Issue | Who is blocked | The action |
|---|---|---|---|
| 1 | **WS-13** the merch budget | Silvio (the order) | Say yes, or name a ceiling. Your yes of 3 November to Silvio may already be it: if so, say that and it closes. |
| 2 | **WS-105** protect main | Every agent: "never push to main" has no barrier behind it | Say who may merge to main. Angelo, as admin of this repository, can then apply the rule. |
| 3 | **WS-115** the OpenRouter key, one per agent | Ask Claude on the command centres | Seal and sign one key per agent. |
| 4 | **WS-113** your yes on the generic-QR set and the logo | The printer: 3 of 7 sets signed, delivery aimed at Monday 9 November | On [/print/](../print/index.html). |

**Off this list since yesterday:** WS-145 is done (Indi has the newsroom). WS-09 no longer waits on Dinis: Angelo sends the invitations from the-neuronin, and what is left is Nimay's GitHub username, which only Nimay can give (helper@web-summit.jose, 23:22).

### The rest of the board

**In one line.** 168 issue files: 108 open, 30 picked, 5 in progress, 25 done. **69 issues dated 2 to 4 November are past due and not done.** Today, Thursday 5 November, 37 are due, 25 of them with nobody in `picked_by:`.

**Due today with nobody on it.**

- **RiskMandate:** WS-17 (material for investors), WS-20 (the landing page) and WS-21 (the offer and how to buy it). These sit on top of WS-15, WS-16, WS-18, WS-19, WS-22, WS-66 and WS-109, which have been past due since yesterday with nobody on them. Four working days to Lisbon: **this is the board's biggest gap, and no one owns it.**
- **Tech and security:** WS-05, WS-36, WS-38, WS-42, WS-76, WS-110, WS-111, WS-117, WS-127, WS-133, WS-138, WS-144, WS-153, WS-154, WS-156, WS-160, WS-162 and WS-164.
- **Content:** WS-69, WS-79, WS-80 and WS-150.

**Outreach is moving.** Silvio picked WS-26 (the 50 emails, in English and Portuguese). 28 emails are drafted in his Gmail and wait for Dinis's yes (a decision on the 13:00 agenda).

**Duplicates and tensions.**

- **WS-159 is used twice:** the command-centre improvements (Jose's conductor, 01:10) and the sticker vote (Dinis's conductor, 02:01). This is the second collision after WS-106. Both files have the note, and WS-161 (the gate fails on a duplicate number) would end it.
- **WS-153 and WS-154** send vault keys to the conductor over the inbox, while **WS-156** says vault keys should not collect in the conductor. One decision for Dinis and security, not three.

**Stand-ups.** One more decision recorded since yesterday: Jose's security watcher (WS-134), in Jose's own words. Today's 13:00 has 29 open items, 26 of them carried over. Who records (WS-107) and whether to move the midday slot are still open, but the cockpit's Decide now records Dinis's words directly (WS-107 by another route).

**WS-31 (the schedules, Vicky).** Unchanged. WS-25 (the first five companies) is still an open decision. WS-29 and WS-32 still have nobody on them.

**Tidied this run.** On the board: `only:` removed from WS-09, with notes on WS-09, WS-105, both WS-159 files, WS-161 and WS-151. On the 13:00 agenda: "Nimay stuck at L1" merged into the invitations decision, yesterday's "proposed order" closed as past, and the only-Dinis item rewritten from the board's field.

**Load.** Open issues per named owner: Dinis 64, Angelo 48, Jose 36, Indi 22, Nimay 18, Silvio 17, Vicky 14, Sarah 11, Daniela 5. Another 27 are for everyone and 6 for anyone. Dinis's count grew by 10 since yesterday evening.

**The pulse.** Still two check-ins in total, both from 3 November. None for two days.
