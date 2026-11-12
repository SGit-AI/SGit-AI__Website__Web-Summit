# Vicky's note on the board's health (WS-46)

Kept by pm@web-summit.vicky for Vicky (from 3 November 2026, 15:16 UTC; before that by conductor@web-summit.vicky). Written once a day at 07:40 UTC (at Vicky's word, 3 Nov). Each run replaces the last; earlier runs are in this file's git history. It adds Vicky's view (her deadlines, what has no owner, what blocks what) to the team-wide page that project-manager@web-summit.dinis writes at 07:50, 12:50 and 17:50 UTC (`content/board-health.md`, the site's /board-health/). It does not repeat that page.

## Run of 12 November 2026, 07:40 UTC

The daily run, and the last one on a schedule: standing answer 43 switches my task off from Friday 06:30 UTC, and from then I run on demand through the conductor. I read the issue files in `board/` at commit `e2c48ca5` on dev, with each issue's front matter parsed field by field. I also read `people/*/pulse/` and the git log since my last daily run (9 Nov). I did not run the 10 and 11 Nov wakes (my session was not running). Today is the last summit day, Thursday 12 November.

**The board in one line.** 218 issue files: 123 open, 54 picked, 6 in progress, 34 done, and 1 in a new status, `design first` (WS-206). 17 are new since 9 Nov (WS-201 to WS-216). Three file numbers are shared by two files: **WS-106**, **WS-203**, and WS-105 and WS-173 say `picked` with an empty `picked_by:`.

### Vicky's issues

- **WS-48**, the merch: done. It was collected on 9 Nov (conductor@web-summit.silvio, `9412f77`).
- **WS-213** (due 11 Nov, no owner): from Silvio, 10 Nov. Vicky's agents' tokens are measured first, one ledger line per run in `people/vicky/ledger/`, using Silvio's `measure.mjs`. Nothing is in the decisions file about it and no ledger exists yet. It needs Vicky's word before any of her agents does it.
- **WS-153** (picked by Vicky, due 5 Nov): still waits for conductor@web-summit.dinis to confirm on the issue that it can open the vaults.
- **WS-163** (picked by Vicky, due 6 Nov): Vicky's photo is confirmed. Angelo, Indi, Jose and Dinis still have no answer recorded.
- **WS-29** (picked by Vicky): pending Dinis and Nimay. **WS-168** is picked by Indi.
- WS-25, WS-41 and WS-53: as before, without URGENT, at Vicky's standing word.

### The rest of the board

- **Due today:** 9 not done, 5 of them with no owner: WS-202, WS-205, WS-206, WS-210, WS-211. Nothing is due tomorrow.
- **Overdue:** 159 not done, 97 of them with no owner.
- The "could this be closed?" notes of 5 Nov (WS-56, WS-62, WS-113, WS-57, WS-63, WS-136) still have no answer.

### Proposed (not changed)

- **WS-106 and WS-203:** one file of each pair gets a new number.
- **WS-105, WS-173:** a name in `picked_by:`, or the status back to `open`.
- **The board's statuses:** `design first` is the only value besides open, picked, in progress and done. The site counts anything but `done` as open, so it behaves as open. Its owner may want to say so.

Sources: `board/WS-*.md` front matter at `e2c48ca5`; `git log` (`9412f77`); `people/vicky/decisions.md` (standing answer 43).
