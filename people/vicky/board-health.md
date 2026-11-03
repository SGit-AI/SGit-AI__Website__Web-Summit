# Vicky's note on the board's health (WS-46)

Kept by conductor@web-summit.vicky for Vicky. Each run replaces the last; earlier runs are in this file's git history. It adds Vicky's view (her deadlines, what has no owner, what blocks what) to the team-wide page that project-manager@web-summit.dinis writes at 07:50, 12:50 and 17:50 UTC (`content/board-health.md`, the site's /board-health/). It does not repeat that page.

## Run of 3 November 2026, about 10:20 UTC

Read: the issue files in `board/` at commit `72f1643` on dev (site v0.2.66), `people/*/merch.json`, `people/*/pulse/`, and the git log.

**The board in one line.** 126 issue files: 101 open, 8 picked, 4 in progress, 13 done. Two files still share the number WS-106 (already flagged on /board-health/).

### Deadlines at risk today, Tuesday 3 November

1. **The merch order (WS-113, sign-off by 16:00; the printer needs confirmation by the end of today).** It needs everyone's sizes and everyone's signed print set. **Sizes: 1 of 7** people going have a `people/<id>/merch.json` (Vicky's, commit `faa9d55`, 10:05 UTC). WS-55, where the sizes are asked for, was due Monday and has no owner. This is the one deadline today that the whole team can miss by not answering.
2. **WS-56, the shirt messages** (sarah, nimay, indi): due Monday, no owner, nothing came in. /board-health/ already asks Dinis whether the sign-off overtakes it.
3. **Vicky's own, due today, no owner yet:**
   - **WS-23, Nimay's booked meetings in a private vault.** Blocked: no one has published a vault yet (no `people/*/vaults.json`), and Vicky's vaults step (L6) is the one she has not done. Vaults come with WS-120 (Angelo, Jose and Silvio, Wed 4 Nov), then WS-121 (everyone, Fri 6 Nov). The due date cannot hold as written.
   - **WS-100, the GitHub step written down for newcomers** (with Angelo). Nimay and Indi still stop at the push step (WS-09), so this is the issue that helps them.
   - **WS-47, team alignment from the pulse.** There is nothing to read yet: no `people/*/pulse/` folder has a check-in (WS-07 starts today).

### Without an owner

- **Due today:** 17 open issues have no `picked_by`. Ten of them are everyone's or Dinis's setup and admin steps (WS-01, WS-02, WS-07, WS-08, WS-09, WS-10, WS-14, WS-30, WS-73, WS-98); the rest are WS-23, WS-33, WS-35, WS-47, WS-54, WS-100 and WS-105.
- **Due tomorrow, Wednesday 4 November:** 25 open issues have no `picked_by`, including four of Vicky's: WS-25 (the first five companies), WS-29 (hot leads), WS-41 (the pulse app) and WS-53 (Silvio's workflow written up), with WS-49 (mini tools) starting the same day.

### Dependencies, from Vicky's side

- **Merch:** sizes (WS-55) and each person's sign-off feed WS-113 (16:00 today), then the printer's confirmation (end of today), then WS-57 and WS-48 (noon tomorrow) and the budget WS-13 (noon tomorrow).
- **The schedule for 10 to 12 November (WS-31, Sat 7 Nov)** needs the first five companies (WS-25) and the hot-lead rule (WS-29), both tomorrow, and the meetings in a vault (WS-23), which waits on the vaults (WS-120, WS-121).
- **Alignment (WS-47) and the pulse app (WS-41)** wait on the first pulse check-ins (WS-07).

### Decided, and what is waiting

- **Two pages, at Vicky's word (3 Nov, about 10:25 UTC): "Keep two board-health pages for now."** project-manager@web-summit.dinis keeps the team-wide /board-health/; this note gives Vicky's view.
- **WS-23's date** is on the 13:00 agenda as a decision for Nimay, or Dinis if Nimay is not there (`data/meetings/2026-11-03-1300/`). The due date stays as written until one of them agrees.
- **Correction (10:30 UTC):** brief 1 (10:15) said the designer's four fixes were still to come. They landed at 09:21 UTC (`b7879f2`, WS-113), with the sign-off on /print/. Vicky's set is ready for her to check.

Sources: `board/WS-*.md` front matter at `72f1643`; `content/board-health.md` (run of 07:50 UTC); `people/vicky/merch.json`; `ls people/*/pulse/`; `git log`.
