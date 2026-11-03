# Vicky's note on the board's health (WS-46)

Kept by pm@web-summit.vicky for Vicky (from 3 November 2026, 15:16 UTC; before that by conductor@web-summit.vicky). Written once a day at 07:40 UTC (at Vicky's word, 3 Nov). Each run replaces the last; earlier runs are in this file's git history. It adds Vicky's view (her deadlines, what has no owner, what blocks what) to the team-wide page that project-manager@web-summit.dinis writes at 07:50, 12:50 and 17:50 UTC (`content/board-health.md`, the site's /board-health/). It does not repeat that page.

## Run of 3 November 2026, 15:25 UTC

This is my first run (pm@web-summit.vicky). I read the issue files in `board/` at commit `d3596a4` on dev (site v0.2.120), with each issue's front matter parsed field by field, and also `admin/tools/signoff.mjs verify` at 15:22 UTC, `people/*/merch.json`, `people/*/pulse/`, `data/meetings/2026-11-03-1300/` and `-1800/`, and the git log since 13:00.

**The board in one line.** 129 issue files: 101 open, 11 picked, 4 in progress, 13 done. Since 12:25 there are two new issues, WS-127 (12:45) and WS-128 (15:03), and WS-31 and WS-47 are now picked.

### Deadlines at risk today, Tuesday 3 November

1. **The print order (WS-113, sign-off at 16:00; the printer's confirmation by the end of today).** **Signed: 1 of 7** (Vicky's, 10:34 UTC). Dinis, Silvio, Nimay, Angelo, Indi and Jose are awaiting. **Sizes: 1 of 7** (only `people/vicky/merch.json` exists). Dinis said yes to the spend at 14:45 (`da69331`). He then asked for one generic QR on the garments (`1961811`, 14:55). Once the files are regenerated, every sign-off, Vicky's included, has to be done again (logistics@web-summit.vicky, `d874bc9`). WS-113 and WS-55 (sizes, overdue since Monday) still have no one in `picked_by`. This is logistics@web-summit.vicky's now, with procurement@web-summit.silvio.
2. **Due at 16:00 with no owner:** WS-116 (the sign-off bound to its person; Silvio, Dinis).
3. **Past due today with no owner:** WS-107 (decisions in the decider's own words, 13:00). The 13:00 stand-up recorded no decisions (`61b3847`), so all its items carry over to 18:00, WS-107 among them.
4. **Vicky's own, due today:** WS-23 (a new date is proposed at the stand-up; the due date stays until Nimay or Dinis agrees) and WS-100 (with Angelo, no owner).

### Without an owner (`picked_by:` empty)

- **Overdue since Monday 2 November:** WS-55, WS-56, WS-62. WS-56 and WS-62 are proposed for closing as overtaken by the sign-off (/board-health/, 12:50).
- **Due today:** 21 of 23 not done have no owner: WS-01, WS-02, WS-08, WS-09, WS-10, WS-14, WS-23, WS-30, WS-33, WS-54, WS-73, WS-88, WS-98, WS-100, WS-101, WS-105, WS-107, WS-113, WS-115, WS-116, WS-126. WS-35 (3 to 4 Nov) has none either. WS-105 says `status: picked` with `picked_by` empty.
- **Due tomorrow, Wednesday 4 November:** 36 of 44 not done have no owner. Vicky's among them: WS-25, WS-29, WS-41, WS-53.
- **Thursday 5 November:** all 20 have no owner, including the big outreach (WS-26).

### Dependencies, from Vicky's side

- **Merch:** the generic QR (designer@web-summit.dinis) → regenerated files → seven sign-offs again plus Dinis's shared designs (WS-113, WS-116) and sizes (WS-55) → the printer's confirmation tonight → WS-57 and WS-48 at noon tomorrow, and the budget (WS-13, noon tomorrow).
- **WS-31, the schedules for 10 to 12 November (Sat 7 Nov):** these need WS-25 and WS-29 (tomorrow, no owner), WS-23 (booked meetings, which waits on the vaults, WS-120 Wed and WS-121 Fri) and WS-32 (the sessions each person attends, Sat 7 Nov, no owner). Meetings stay out of this repository: the schedules will be built in the private vault, and only the public shape goes here.
- **WS-47 and WS-41 (the pulse app):** these need more than one check-in. There is still only one (Vicky's, this morning) out of nine people.

### Proposed (not changed: each needs its owner's or Dinis's word)

- **WS-25 and WS-29 need an owner by tomorrow, or WS-31 slips.** Vicky could pick WS-29 with Nimay, since it is hers and Nimay's. WS-25 is on the stand-up as a decision for Dinis.
- **WS-105:** either a name in `picked_by` or the status back to `open`. That is for Dinis or Angelo.

### Decided, and what is waiting

- **Two pages, at Vicky's word (3 Nov, about 10:25 UTC): "Keep two board-health pages for now."**
- **The note's rhythm, at Vicky's word (3 Nov, about 15:35 UTC): "Let's try one board-health note a day, at the 07:40 wake. On the other wakes, only tell me if something urgent changes."** This answers the mentor's question of 10:40. From tomorrow, this note is written once a day at 07:40 UTC. The 12:40 and 17:40 wakes only check for urgent changes and tell Vicky; they do not rewrite this note.

Sources: `board/WS-*.md` front matter at `d3596a4`; `signoff.mjs verify` at 15:22 UTC; `people/vicky/merch.json`; `people/vicky/pulse/2026-11-03-morning.md`; `data/meetings/2026-11-03-1300/`; `git log` (`da69331`, `1961811`, `61b3847`, `d874bc9`, `79993c4`).
