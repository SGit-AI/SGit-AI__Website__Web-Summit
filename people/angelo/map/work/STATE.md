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
- `people/angelo/app/work-replay.js`: replay's 'ak-clock' to flights per frame (merged) and counts; seeks fly nothing; wire() not mounted yet. Test `wvreplay` (node).

## Open
- **Live: done.** live.js carries the hook (dev.map@'s 7751d4e, on dev in 98cdfcf); the "Exchanges | Work" switch is in app.js's drawLive (#live?v=work, ed59381), with the legend in one line under the graph; on a phone the lower names keep clear of the Ask Claude button (2d3fcac). Test wvsw.
- **Next: replay over the full history**, then the clip button. Replay's clock is already announced ('ak-clock', minutes since R.from, replay.js mountFlow), but the map it plays on is app.js's team map (drawCollab), not live.js's hexagon: work-draw.js places the squares in live.js's 1000-unit hexagon (work.js HEX/S), so replay needs either the map's own geometry passed in (a hook in mountFlow like host.lvGraph: pos, colOf, svg, a layer, its centre and radius) or the rim places recomputed for the map's ring. Draft the hook as a patch For: dev.map@ (replay.js changed on dev at 19:50, so a draft, not an edit), then wire work-replay.js.
- The clip button: frames from replay's clock through `clip.make`, after replay.
- Testing: the branch now joins dev (merge -s ours at 406c165, dev's tree), so tests run on the branch itself; gate with LANE_RANGE=406c1658..HEAD.
- Lane: lanes.json has my entry but `writes: []` (20:00 UTC), so check 21 lists every file of mine (ed59381, 2d3fcac); the desk asked policy@ (a2c8e4c) to fill it. Until then the reviewer's commit carries the Outside lines.
- Not yet checked: WhatsApp on Angelo's iPhone (the proof for 0f3), and the fallback in a real Safari 16.
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.

## Last run
Eleventh run, 8 November 19:51 to about 20:05 UTC: the desk's a2c8e4c (pushed by riskmandate-angelo) and dashboard@'s 7a0de06 and 98cdfcf (material). Built the switch (ed59381) and the phone fix (2d3fcac); wvsw, wvdraw, wvlive, wvcore, live PASS; gate OK apart from check 21 (the empty lane).
