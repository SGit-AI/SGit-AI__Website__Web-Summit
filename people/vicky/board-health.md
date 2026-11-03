# Vicky's note on the board's health (WS-46)

Kept by pm@web-summit.vicky for Vicky (from 3 November 2026, 15:30 UTC; before that by conductor@web-summit.vicky). Each run replaces the last; earlier runs are in this file's git history. It adds Vicky's view (her deadlines, what has no owner, what blocks what) to the team-wide page that project-manager@web-summit.dinis writes at 07:50, 12:50 and 17:50 UTC (`content/board-health.md`, the site's /board-health/). It does not repeat that page.

## Run of 3 November 2026, 12:25 UTC

Read: the issue files in `board/` at commit `f974007` on dev (site v0.2.83), `admin/tools/signoff.mjs verify`, `people/*/merch.json`, `people/*/pulse/`, and the git log.

**The board in one line.** 127 issue files: 101 open, 9 picked, 4 in progress, 13 done.

**Correction to the 10:20 run.** It said 17 open issues due today and 25 due tomorrow had no owner. Those were undercounts: the script read an empty `picked_by:` as filled when the next line was `agents:`, so it missed WS-88, WS-101, WS-107, WS-113, WS-115 and WS-116. The counts below are from the fixed script.

### Deadlines at risk today, Tuesday 3 November

1. **The merch order (WS-113, sign-off by 16:00; the printer's confirmation by the end of today).** **Signed: 1 of 7** sets (Vicky's, approved 10:34 UTC); Dinis has not signed the shared designs (hoodie, card). **Sizes: 1 of 7** (Vicky's). The printer's fourth reply says ready Friday if confirmed today (procurement@web-summit.silvio, `add8b59`). WS-55 (sizes) and WS-113 still have no owner.
2. **WS-116, the sign-off bound to its person** (16:00), and **WS-107, decisions in the person's own words** (13:00): no owner.
3. **Vicky's own:** WS-23 is on the 13:00 agenda for a new date (Nimay, or Dinis); WS-100 (with Angelo) has no owner; WS-47 has one check-in to read so far (Vicky's morning pulse, the team's first).

### Without an owner

- **Due today:** 23 open issues have no `picked_by`: WS-01, WS-02, WS-07, WS-08, WS-09, WS-10, WS-14, WS-23, WS-30, WS-33, WS-35, WS-47, WS-54, WS-73, WS-88, WS-98, WS-100, WS-101, WS-107, WS-113, WS-115, WS-116, WS-126.
- **Due tomorrow, Wednesday 4 November:** 40 open issues have no `picked_by`, Vicky's WS-25, WS-29, WS-41 and WS-53 among them (WS-48 has procurement@web-summit.silvio on the printer shortlist).

### Dependencies, from Vicky's side

- **Merch:** sizes (WS-55) and the seven sign-offs plus Dinis's shared designs feed WS-113 (16:00), then the printer's confirmation (end of today), then WS-57, WS-48 and the budget WS-13 (noon tomorrow).
- **The schedule for 10 to 12 November (WS-31, Sat 7 Nov)** needs WS-25 and WS-29 (tomorrow) and WS-23, which waits on the vaults (WS-120 Wed, WS-121 Fri).
- **Alignment (WS-47) and the pulse app (WS-41)** need more than one check-in.

### Decided, and what is waiting

- **Two pages, at Vicky's word (3 Nov, about 10:25 UTC): "Keep two board-health pages for now."**
- **WS-23's date** is on the 13:00 agenda; the due date stays until Nimay or Dinis agrees.
- **The mentor's question (10:40):** is a once-a-day note the rhythm Vicky wants? This run follows the conductor's three wakes a day until she says.

Sources: `board/WS-*.md` front matter at `f974007`; `signoff.mjs verify` at 12:25 UTC; `people/vicky/merch.json`; `people/vicky/pulse/2026-11-03-morning.md`; `people/vicky/mentor/2026-11-03-1040.md`; `git log` (`add8b59`).
