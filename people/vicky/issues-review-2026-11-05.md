# Vicky's issues: a list to review (5 November 2026)

By pm@web-summit.vicky for Vicky, at her request, read from `board/` at `5d868893` on dev (front matter parsed field by field). **Nothing here is claimed or changed.** Vicky says which ones to claim. Issues that clearly belong to someone else are left out. Effort is a rough guess: **S** under an hour, **M** a few hours, **L** a day or more.

## 1. Already assigned to Vicky

| Issue | Status | Due | What's left |
|---|---|---|---|
| **WS-31** Each person's schedule for 10 to 12 Nov | picked (Vicky, pm@) | Sat 7 Nov | Inputs: the booked meetings (WS-23, done) and the first five companies (WS-25, chosen). Still missing: the sessions each person attends (WS-32, no owner). Then build the seven schedules in the private vault and publish only their public shape. |
| **WS-46** Board health | picked (Vicky, pm@) | daily | Ongoing: one note a day at 07:40 (`people/vicky/board-health.md`). |
| **WS-47** Team alignment from the pulse | picked (Vicky, pm@) | daily | Ongoing, but only 2 of 9 people have checked in, none since 3 Nov. It needs check-ins more than work. |
| **WS-48** Printing and merch logistics | open (Silvio's procurement@; Vicky with logistics@) | Wed 4 Nov (overdue) | Ordered. Still open, from the 12:00 stand-up: who holds the receipt (they collect), and whether the garments are ready Monday or Tuesday. Whether personal cards are printed is on the stand-up for Dinis; the team cards (600, no names) are WS-155, for collection Fri 6. |

Recently done: WS-23 (booked meetings in the private vault, `e7ff186`) and WS-100 (the onboarding guide, `95345bb`).

## 2. Open, no owner, in Vicky's areas

| Issue | Area | Due | Done means | Effort |
|---|---|---|---|---|
| **WS-32** The sessions each person attends | calendar | Sat 7 Nov | 3 to 6 sessions each from the summit page, with the speakers worth meeting. It feeds WS-31 directly. | **M**: pm@ can draft a shortlist per person from the public programme (the programme desk's agenda), and each person confirms. |
| **WS-153** The newsroom vault keys to conductor@web-summit.dinis | newsroom, board admin | Thu 5 Nov (today) | The conductor confirms on the issue which vaults it can open. vault@ sent the shortlist vault's read key at Vicky's yes (10:09); the research vault's read key is already public. | **S**: what's left is the conductor's confirmation, then closing. |
| **WS-168** From a conversation with a lead to an article: the process | newsroom, interview logistics | Sun 8 Nov | One short page every person can follow at the summit: who captures, what may become public, who writes and publishes, how fast. From the 12:00 stand-up of 5 Nov. | **M**: a write-up (pm@'s writing job), with Indi (editorial) and the newsroom agreeing. |
| **WS-107** Stand-up decisions recorded in the person's own words | board admin | Tue 3 Nov (overdue) | The stand-up's decisions show **Decided** on /meetings/, and the briefings stop carrying them over. | **M, ongoing**: someone records after each stand-up. The tool's gaps are Angelo's dev agent's. |
| **WS-163** Each person confirms their own photo on the site | onboarding (personal) | Fri 6 Nov | Vicky says yes or no to her own photo, in her own words, through her agent (a line in `people/vicky/onboarding.json` or `card.md`), or the file comes off. | **S**: one answer from Vicky; it's only her own part of the issue. |
| **WS-49** Mini tools for the team | tools | from Wed 4 Nov | Small tools listed on Vicky's dashboard. | Ongoing: dev@web-summit.vicky's job; claim only if Vicky wants it on the board. |

Not listed as claimable, by Vicky's standing word (4 Nov): **WS-29** (she claims it herself when she posts the hot-leads rule), and **WS-25, WS-41, WS-53** (others'). The onboarding "everyone" issues (WS-01 to WS-08, WS-99, WS-121, WS-136) are each person's own, so nobody claims them for the team. See section 3.

There are no unowned issues for the newsroom's research or programme desks: those desks run without board issues (`people/vicky/newsroom/README.md`). If Vicky wants them tracked, one issue per desk is an option.

## 3. Could be closed (each needs its owner's or Dinis's word)

| Issue | Why | Who decides |
|---|---|---|
| **WS-55** Everyone's size, colour, message | Its own note says it was merged into WS-130, which is done (3 Nov 17:50), but its status is still open. | project-manager@web-summit.dinis or Dinis |
| **WS-56** The shirt messages, and **WS-62** Vote on the design | Overtaken by the print sign-off, as proposed on /board-health/ (3 Nov 12:50); the merch is ordered (logistics@, `3dc83a2`). | Dinis (WS-56: Sarah, Nimay, Indi) |
| **WS-113**, **WS-57**, **WS-63** The sign-off, the final artwork, the final design set | The order went to the printer on 4 Nov (`3dc83a2`). But only 3 of 7 sets are signed (`signoff.mjs verify`, 5 Nov 07:45), so close them as done only if Dinis says the order stands as it is. | Dinis; designer@web-summit.dinis |
| **WS-153** (above) | Done once the conductor confirms it can open the vaults. | conductor@web-summit.dinis |
| **WS-136** Everyone adds their key to the site | Done for Vicky (mentor note, 4 Nov 11:41). It stays open for those who haven't. | nobody yet, for the team |

Sources: `board/WS-*.md` at `5d868893`; `people/vicky/inbox.md`; `people/vicky/newsroom/README.md`; `signoff.mjs verify` (5 Nov 07:45); `git log` (`3dc83a2`, `9e38d7d`, `e7ff186`, `95345bb`).
