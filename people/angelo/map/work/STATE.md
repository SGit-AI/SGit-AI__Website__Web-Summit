# dev.work@PrompTugal.angelo: STATE

Backlog 0f2 (the work view) and 0f3 (the WhatsApp clip). **Approved** by Angelo 8 November about 16:30 UTC (the desk's 7fcaf108 and d36afd88, both pushed by riskmandate-angelo): building, deliveries.mjs first, then the view, then the clip.

## Built (on workers/dev.work, for dashboard@ to review)
- `people/angelo/tools/deliveries.mjs`: the spec's rule table, "Delivered:" lines, the maker, readRepo(), backfill(), pack(). Test `wv` (a fixture per row).
- `people/angelo/app/deliveries.json`, written by the build (data.mjs extras(), .gitignore line), makers named as live.json names agents. Test `wv` checks it.
- `people/angelo/app/work.js`: the view's pure rules (rim places, merge, counts, origin, the light theme's stroke). Test `wvcore`.
- `people/angelo/app/work-newsroom.js`: the newsroom read live (stories.json every two minutes), shape check, live diff, poller. Test `wvnews` against `tests/wv-stories.json`.
- `people/angelo/app/deliveries-backfill.json`: empty, with its shape.
- `people/angelo/app/clip.js` (0f3): sizes, caps, caption, file name; WebCodecs H.264 Main 4.0 as limited-range I420 into a fast-start MP4; the fallback for Safari before 17 (MediaRecorder, its fragmented file rewritten as one fast-start MP4); share or download. `vendor/mp4-muxer-5.2.2/` (MIT, sha256 in SOURCE.txt). Test `clip` (ffprobe).
- `people/angelo/app/work-logos/`: PT News (light, dark) and LinkedIn favicons, SOURCES.md; the rest plain marks.
- `people/angelo/app/work-draw.js`: the drawing on the hook's layer: squares on the rim (logos), name pills outside it (12 px or more; on a phone in rows above and below with leaders), counts, flights in the maker's colour, merges, landing light. Test `wvdraw` (1280 and 390 px, dark and light).
- `people/angelo/app/work-live.js`: the live feed: deliveries.json each minute, 4 minutes behind; the newsroom every two; counts for 24 h; the corner note. Test `wvlive`.
- The look after dashboard@'s review (de879c5): squares on the four slanted edges (work.js SLOTS), none on the logos/LIVE or the date line; pills step off live.js's furniture; on a phone the hexagon at 94% width with the name rows above and below. wvdraw checks the furniture.
- `people/angelo/app/work-replay.js`: replay's 'ak-clock' to flights per frame (merged) and counts; seeks fly nothing. Test `wvreplay` (node).
- **Replay: done** (c95bce6): mountMap() puts the work view on the Team map while it plays (the map's viewBox opened to 0.84 plus a 7% margin, squares on that rim, deliveries.json over the whole history); "Exchanges | Work" above the playback bar in app.js drawCollab, r_work=1 in the address. Test wvrp.

## Built this run (14th)
- be2077cb: 0c4 (5): each label in a pill beside its own square (outside with the full name where it fits; else outside short; else inside the rim, short, cut to fit: a phone); no rows, no leaders. Every destination its own mark (site window, research magnifier, infra rack, app phone, drafts pencil). work.js DEST_SHORT. Test wvdraw checks it.
- b62ea65e: 0c4 (5): the three-way switch in the pop-out (live.js o.onPop, two lines under the five steps; app.js popSync). Test wvpop.

## Open
- **Branch:** this run rebased once onto workers/dev.work and so carried 36 copies of dev's commits (be2077cb's parents); content equals dev, harmless for a one-commit review. Next runs: merge origin/dev, never rebase.
- **Seen:** in a 440 px pop-out live.js's layout switch sits over the upper right square (WS-14 / the team site): dev.map@'s furniture, told in b62ea65e.
- **Lane:** policy@ turned check 21 into a FAIL; lanes.json still has `writes: []` for me. d71e6ca8 and 49ce4f13 went out without Outside lines (already pushed, no force-push): the reviewer's commit must carry them. From 423f113f every commit of mine carries its own Outside lines. Gate my own range: LANE_RANGE=<my first commit of the run>^..HEAD.
- **0f3 proof:** Angelo sends a clip to himself on WhatsApp on his iPhone; the fallback in a real Safari 16 not checked.
- **0c4 questions (spec part 3), via the desk:** the nine squares fixed over the data's span (built) or per window; retire "Agents and their work".
- Polish, from dashboard@'s 2e0eac44 (material): on the Team map the name pills use the rows layout with long leaders; try beside the squares at 1280.
- Testing: merge origin/dev into the branch at the start of a run (this run: 4d9369f).
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.

## Last run
Fourteenth run, 8 November 23:52 to 9 November about 00:20 UTC: the desk's f12844f8 (pushed by riskmandate-angelo, checked) gave 0c4 (5); all three parts built. Two commits on workers/dev.work; wvdraw, wssw, wvsw, wvpop, wvrp, wsrp, clipbtn, wvreplay, wvcore, wvlive, lvpip, lvdisp, live PASS.
