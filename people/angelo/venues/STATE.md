# dev.venues@PrompTugal.angelo: STATE

Last run: 9 November 2026, 20:46 UTC (twenty-eighth run). Pushes only to workers/dev.venues.

**Twenty-eighth run:** only dev@'s review 846085ba For: me (pushed-by: ANGELO; it brought run 27 onto dev). The spec's last commit e588f4b5a: ANGELO (--last-touch). Nothing new from the desk; question 6 still with it. B1 healthy: the three addresses answer 200, live venue-map.json matches the team's venue-map.js exactly. Nothing else to build: B2 waits for security's review, the share patch is writer@'s.

**Twenty-seventh run:** desk's de6b95a (pushed-by: ANGELO) answers question 5: writer@PrompTugal.angelo applies the share patch in its next session with Angelo; I answer any question on the patch. dev@'s review dbe5477 For: me (ANGELO; brought run 26 onto dev). The spec's last commit e588f4b5a: ANGELO (--last-touch). conductor@web-summit.indi's 3df5568 (For: the desk and me) nudges again for the registration page, "put it first in dev.venues@'s queue"; badges until Thursday 16:45: not from the desk or dev@, so **material**; question 6 stays with the desk. B1 healthy: the three addresses answer 200, live venue-map.json matches the team's venue-map.js exactly.

**Twenty-sixth run:** dev@'s review 48d8d708 For: me (pushed-by: ANGELO; it brought run 25 onto dev). The spec's last commit e588f4b5a: ANGELO (--last-touch). Three commits For: me from conductor@web-summit.indi (0c1149f9 wayfinding, ca7b17fd a brief to build https://promptugal.news/registration/ "now", at Dinis's word, e169f693 a detailed-venue-map question): pushed by riskmandate-indi, not from the desk or dev@, so **material, not acted on**; written down as question 6. B1 healthy: the three addresses answer 200, live venue-map.json matches the team's venue-map.js exactly. Nothing else to build: B2 waits for security's review, the share patch for the desk (question 5).

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
- Share button (0o): APPROVED; patch written (people/angelo/proposals/share/build/). writer@PrompTugal.angelo applies it with Angelo and runs the newsroom's gate (de6b95a); I answer questions on the patch. The four newspapers not read stay blank; no more retries unless Angelo asks.
- Part B2 (the team's layer) waits for security@web-summit.dinis's review and vault@'s token: nothing to build. Until then: keep the two copies of the map data matching, and check the newsroom's last two hours before any change.
- `PLACES` rename (Hall to Pavilion) with dashboard@, after a day of use.

## Questions (for the desk)
1. Browser tests `tm` and `tmf` failed on dev before my change (dev.map@/dev@'s area), unchanged since last run.
2. `PLACES` still has "Hall 1-4"/"Stand" vs the drawing's "Pavilion 1-4" (rename after a day of use, with dashboard@).
3. Event dates in the newsroom's data include odd old ones (2022 dates under the MEO Arena place); the page filters to 6-13 November 2026. dev@PrompTugal.dinis / ontologist@ may want to look.
4. My lane (people/angelo/policy/lanes.json) lists only people/angelo/proposals/WS-181/**, but the approved spec gives me people/angelo/venues/STATE.md, people/angelo/app/where*.js, venue-map*, people/angelo/tools/venue-map.mjs and my estimates file. For policy@PrompTugal.angelo: please widen it; until then each commit says Outside:.
5. Answered (de6b95a, Angelo 15:55 "Ok"): writer@PrompTugal.angelo applies the share patch and runs the newsroom's gate; I answer questions on it.
6. **For Angelo via the desk (time-sensitive; nudged again in 3df5568, badges collected until Thursday 16:45):** conductor@web-summit.indi's ca7b17fd (people/indi/wayfinding/brief-dev-venues.md) asks me, quoting Dinis (about 15:20 UTC: "build a page now and build it using Angelo's venues agent for PrompTugal.news"), to build a registration page at promptugal.news/registration/ (two registration points, hours, Directions, an on-device "from where I am" line on the venue drawing, registration.json). It is not in the venues spec nor in the backlog under my name, and it came from neither the desk nor dev@, so I have not started. If Angelo wants it: a backlog row naming me (the spec first, per the 8 November rule), and an answer to question 5, since this session still cannot run the newsroom's gate. Note for the spec: the page reads the browser's location on the phone only, never sent or stored; security may want to confirm that fits WS-181's "no real location" rule. Also e169f693 (Indi's detailed venue map question: Mapbox, Apple Maps, IMDF, MapLibre) and 0c1149f9 (wayfinding options) read as material.
