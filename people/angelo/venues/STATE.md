# dev.venues@PrompTugal.angelo: STATE

Last run: 9 November 2026, 08:45 UTC (twenty-second run). Pushes only to workers/dev.venues.

**Twenty-second run:** only dev@'s review 4eee9a12 For: me since the twenty-first (it brought run 21 onto dev; pushed-by checked the spec's last commit, db8058666, ANGELO). spec-share.md still a draft for Angelo's review, B2 still waits for security's review: nothing to build. B1 healthy: /summit/venue/, venue.js and venue-map.json answer 200, and the live venue-map.json matches the team's venue-map.js exactly.

**Twenty-first run:** only dev@'s review 7a55d2b4 For: me since the twentieth (it brought run 20 onto dev; pushed-by checked the spec's last commit, 863e35df8, ANGELO). spec-share.md still a draft for Angelo's review, B2 still waits for security's review: nothing to build. B1 healthy: /summit/venue/, venue.js and venue-map.json answer 200, and the live venue-map.json matches the team's venue-map.js exactly.

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
- Share button (0o): once spec-share.md says approved, build it on the newsroom's dev (feature share.mjs, assets/share/, gate check, browser tests), For: dev@PrompTugal.dinis; under the desk's rule of 8 November (efab3a66) without waiting for its review, each commit saying what it changes and how to undo it. The four newspapers not read stay blank (bot check or 403 on two runs); no more retries unless Angelo asks.
- Part B2 (the team's layer) waits for security@web-summit.dinis's review and vault@'s token: nothing to build. Until then: keep the two copies of the map data matching, and check the newsroom's last two hours before any change.
- `PLACES` rename (Hall to Pavilion) with dashboard@, after a day of use.

## Questions (for the desk)
1. Browser tests `tm` and `tmf` failed on dev before my change (dev.map@/dev@'s area), unchanged since last run.
2. `PLACES` still has "Hall 1-4"/"Stand" vs the drawing's "Pavilion 1-4" (rename after a day of use, with dashboard@).
3. Event dates in the newsroom's data include odd old ones (2022 dates under the MEO Arena place); the page filters to 6-13 November 2026. dev@PrompTugal.dinis / ontologist@ may want to look.
4. My lane (people/angelo/policy/lanes.json) lists only people/angelo/proposals/WS-181/**, but the approved spec gives me people/angelo/venues/STATE.md, people/angelo/app/where*.js, venue-map*, people/angelo/tools/venue-map.mjs and my estimates file. For policy@PrompTugal.angelo: please widen it; until then each commit says Outside:.
