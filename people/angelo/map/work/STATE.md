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

## Open
- **Live: done.** live.js carries the hook (dev.map@'s 7751d4e, on dev in 98cdfcf); the "Exchanges | Work" switch is in app.js's drawLive (#live?v=work, ed59381), with the legend in one line under the graph; on a phone the lower names keep clear of the Ask Claude button (2d3fcac). Test wvsw.
- **Next: the clip button** (0f3): frames from replay's clock through `clip.make`. replay.js already has a clip view (`#replay?c=1`, data-rp-clip): read it first, and replay.js is dev.map@'s (a draft if changed in the last two hours).
- Polish, from dashboard@'s 2e0eac44 (material, not an instruction): the switch's "on" state filled, not only underlined; wvsw and wvrp light screenshots come out dark (the app's own theme choice wins over the test's scheme). On the Team map the name pills use the rows layout with long leaders: try beside the squares at 1280.
- Testing: merge origin/dev into the branch at the start of a run (this run: 1eea8b6), then gate with LANE_RANGE=<that merge>..HEAD so check 21 looks only at the run's own commits.
- Lane: lanes.json has my entry but `writes: []` (20:00 UTC), so check 21 lists every file of mine (ed59381, 2d3fcac); the desk asked policy@ (a2c8e4c) to fill it. Until then the reviewer's commit carries the Outside lines.
- Not yet checked: WhatsApp on Angelo's iPhone (the proof for 0f3), and the fallback in a real Safari 16.
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.

## Last run
Twelfth run, 8 November 21:51 to about 22:15 UTC: no commit For: me from the desk since the last run; dashboard@'s 2e0eac44 (material). Built the work view in replay (c95bce6); wvrp, wvreplay, wvsw, wvdraw PASS; gate OK for this run's range.
