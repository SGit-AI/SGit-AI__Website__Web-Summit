# dev.venues@PrompTugal.angelo: STATE

Last run: 7 November 2026, night (fifth run). Pushes only to workers/dev.venues.

## Where things stand
- Spec-venues.md: Part A and Part B (as revised) are **approved**. Part B2 (the team's layer) waits for security@web-summit.dinis's review and vault@'s token: nothing built, no real location anywhere.
- **Part B1 item 1 shipped** on the newsroom's `dev` (a94b77f4c, For: dev@PrompTugal.dinis): `/summit/venue/`, plain SVG at build time, no script; buildings shaded from the programme's places; gate check added (`newsroom/build/features/venue.mjs`); words in `content/summit/venue.md`; data `assets/venue/venue-map.json` and `venue.css`. A stage's building is not in the schedule, so stages shade the whole campus (arena and four pavilions), never guessed.
- `people/angelo/tools/venue-map.mjs` now takes `--newsroom <path>` and writes both copies (the team's venue-map.js came out unchanged). OpenStreetMap's API works from the session.
- The newsroom's repository is attached with push; it moved to PrompTugal/PrompTugal__News__Website (redirect works).

## Part B1 is complete (newsroom live v0.1.650, For: dev@PrompTugal.dinis)
- Item 3 shipped (7dce572c7): `assets/venue/venue.js` shades a reader's picks (`nr.schedule.v1`) on `/summit/venue/` and lists them by day, from a JSON block in the page; no network call (gate check added, also that the block holds no person). Unplaced sessions are listed as "not placed", never guessed. Words in `assets/venue/my-day.json`. Tested at 1280 (light) and 390 (dark).
- Item 4 shipped (df21a88a0): My day links to the venue map (the summit page already did).
- The venue page now runs one small script; `content/summit/venue.md` says so. journalist@'s article claim "the map has no script of its own" (026e945) is still true of the drawing, but the page itself now has venue.js: dev@PrompTugal.dinis / journalist@ may want to look.

## Next
- Part B2 (the team's layer) waits for security@web-summit.dinis's review and vault@'s token: nothing to build. Until then: keep the two copies of the map data matching, and check the newsroom's last two hours before any change.
- `PLACES` rename (Hall to Pavilion) with dashboard@, after a day of use.

## Questions (for the desk)
1. Browser tests `tm` and `tmf` failed on dev before my change (dev.map@/dev@'s area), unchanged since last run.
2. `PLACES` still has "Hall 1-4"/"Stand" vs the drawing's "Pavilion 1-4" (rename after a day of use, with dashboard@).
3. Event dates in the newsroom's data include odd old ones (2022 dates under the MEO Arena place); the page filters to 6-13 November 2026. dev@PrompTugal.dinis / ontologist@ may want to look.
