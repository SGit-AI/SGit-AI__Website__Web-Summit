# Vicky's note on the board's health (WS-46)

Kept by pm@web-summit.vicky for Vicky (from 3 November 2026, 15:16 UTC; before that by conductor@web-summit.vicky). Written once a day at 07:40 UTC (at Vicky's word, 3 Nov). Each run replaces the last; earlier runs are in this file's git history. It adds Vicky's view (her deadlines, what has no owner, what blocks what) to the team-wide page that project-manager@web-summit.dinis writes at 07:50, 12:50 and 17:50 UTC (`content/board-health.md`, the site's /board-health/). It does not repeat that page.

## Run of 4 November 2026, 07:40 UTC

The daily run (one a day at 07:40, at Vicky's word). I read the issue files in `board/` at commit `4a115a6` on dev (site v0.2.227), with each issue's front matter parsed field by field. I also read `admin/tools/signoff.mjs verify` at 07:42 UTC, `people/*/pulse/`, `data/meetings/2026-11-03-1800/` and `2026-11-04-1300/`, and the git log since yesterday's 15:25 run.

**The board in one line.** 138 issue files: 98 open, 16 picked, 5 in progress, 19 done. Nine are new since 15:25 yesterday: WS-130 to WS-137 (WS-130 is already done). WS-138 is not yet in use.

### Due today, Wednesday 4 November

48 issues are due today and not done; 36 of them have nobody in `picked_by:`. The ones that touch Vicky:

1. **Hers, no owner:** WS-25 (the first five companies), WS-29 (hot leads to Nimay or Dinis), WS-41 (the pulse app, with Angelo and Jose), WS-53 (Silvio's workflow written up, with Silvio). WS-25 is on the 13:00 agenda (procurement@web-summit.silvio: Nimay proposes five, Silvio adds the Algarve and Portugal).
2. **WS-48, printing (logistics@web-summit.vicky with procurement@web-summit.silvio).** The order was confirmed with the printer at 16:40 yesterday (`01feb4c`), and every size is in (WS-130 done, `7079899`). Sign-offs are at **3 of 7** (Vicky, Angelo, Dinis); Silvio, Nimay, Indi and Jose are awaiting (`signoff.mjs verify`, 07:42). WS-57 (final artwork) and WS-13 (the merch budget) are both due at noon.
3. **WS-136, everyone adds their key to the site, by 18:00.** This includes Vicky (on the 13:00 agenda, conductor@web-summit.dinis).
4. **WS-23**, overdue since yesterday: Vicky and Nimay go through the booked meetings today, before the 18:00 stand-up (the note on WS-23). The private vault exists and is empty.

### Overdue (due 2 or 3 November, not done)

24 issues, 20 of them with no owner. Vicky's are WS-23 and WS-100 (the GitHub step for newcomers, with Angelo). The rest: WS-01, WS-02, WS-08, WS-09, WS-10, WS-30, WS-33, WS-54, WS-55, WS-56, WS-62, WS-73, WS-88, WS-98, WS-105, WS-107, WS-113, WS-115 and WS-126. WS-35 (3 to 4 Nov) has no owner either. WS-105 still says `picked` with an empty `picked_by:`.

### Without an owner later this week

Thursday 5 November: all 21. Friday: 6 of 7. Saturday: 3 of 4, among them WS-32 (the sessions each person attends), which WS-31 needs.

### Dependencies, from Vicky's side

- **WS-31, the schedules for 10 to 12 November (Sat 7 Nov):** these need WS-25 (decided at 13:00 today, or it slips), WS-29 (no owner), WS-23 (meetings into the vault, from today's session with Nimay) and WS-32 (no owner). The schedules are built in the private vault; only their public shape comes here.
- **The vault, for Nimay:** Nimay's agents need a published key before vault@web-summit.vicky can seal the vault key to them (WS-23 note, 17:40 yesterday; WS-136 asks everyone for a key today).
- **The stand-ups:** no decision from the 13:00 or 18:00 stand-ups yesterday reached the repository (team-collaboration@web-summit.angelo, `dbb8a40`, 19:16), except Dinis's yes to the print order. Everything carries to today's 13:00. WS-107 (who records the decisions) is still open.

### Proposed (not changed: each needs its owner's or Dinis's word)

- **WS-29:** Vicky picks it with Nimay today, so WS-31 has its input by Saturday.
- **WS-23's due date:** a new date of Wednesday 4 November, after today's session, for Nimay or Dinis to agree.
- **WS-105:** a name in `picked_by:`, or the status back to `open` (Dinis or Angelo).

Sources: `board/WS-*.md` front matter at `4a115a6`; `signoff.mjs verify` at 07:42 UTC; `data/meetings/`; `git log` (`01feb4c`, `7079899`, `dbb8a40`).
