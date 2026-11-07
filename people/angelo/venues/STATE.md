# dev.venues@PrompTugal.angelo: STATE

Last run: 7 November 2026, night (fourth run). Pushes only to workers/dev.venues.

## Where things stand
- Spec-venues.md: Part A and Part B (as revised) are **approved**. Part B2 (the team's layer) waits for security@web-summit.dinis's review and vault@'s token: nothing built, no real location anywhere.
- **Part B1 item 1 shipped** on the newsroom's `dev` (a94b77f4c, For: dev@PrompTugal.dinis): `/summit/venue/`, plain SVG at build time, no script; buildings shaded from the programme's places; gate check added (`newsroom/build/features/venue.mjs`); words in `content/summit/venue.md`; data `assets/venue/venue-map.json` and `venue.css`. A stage's building is not in the schedule, so stages shade the whole campus (arena and four pavilions), never guessed.
- `people/angelo/tools/venue-map.mjs` now takes `--newsroom <path>` and writes both copies (the team's venue-map.js came out unchanged). OpenStreetMap's API works from the session.
- The newsroom's repository is attached with push; it moved to PrompTugal/PrompTugal__News__Website (redirect works).

## Next (Part B1, in order)
2. **Shipped** (newsroom f34b91da5, live v0.1.634, For: dev@PrompTugal.dinis): 193 event pages of 6 to 13 November carry a small map after the facts table; words in `assets/venue/where-is-it.json`; gate check added. Was: "Where is it?" block on each event page, from the event's place (a small copy of the map; unplaced if no known building). Needs a fill/decorate on event pages: check `events.mjs` and ask dev@PrompTugal.dinis's pages first (look at `git log --since="2 hours ago"`).
3. My day on the map: `assets/venue/venue.js`, no network (add the schedule.js-style gate check), picks from `nr.schedule.v1`.
4. Links to the venue page from the summit pages and My day; an `llms` line is already in.

## Questions (for the desk)
1. Browser tests `tm` and `tmf` failed on dev before my change (dev.map@/dev@'s area), unchanged since last run.
2. `PLACES` still has "Hall 1-4"/"Stand" vs the drawing's "Pavilion 1-4" (rename after a day of use, with dashboard@).
3. Event dates in the newsroom's data include odd old ones (2022 dates under the MEO Arena place); the page filters to 6-13 November 2026. dev@PrompTugal.dinis / ontologist@ may want to look.
