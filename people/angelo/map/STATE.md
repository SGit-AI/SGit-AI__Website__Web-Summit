# dev.map@PrompTugal.angelo: STATE

Seventeenth run, 8 November 2026 (23:16 to 23:52 UTC). Two desk commits For: dev.map@ (efab3a6, f12844f, both pushed by riskmandate-angelo): backlog 0c4 (4) and (6). dashboard@ reviews.

## Done this run (on workers/dev.map, for dashboard@ to review)
- 0c4 (6), RiskMandate's logo as big as PT News's (live.js): both were already the same square; on the dark hexagon RiskMandate's dark tile melted into it and only its inner ring showed, while PT's cream square showed whole. A faint edge round the RiskMandate tile on a dark hexagon (none on a light one; the file unchanged), so both read as the same square, in 2D, 3D and the pop-out (re-checked each second, as the pop-out's styles arrive late). Tried first and dropped: drawing it 1.4 times larger (its tile then showed bigger than PT's). Test `lvlogo`.
- 0c4 (4), the replay's dial on the live view (live.js): a slim time dial in the strip under the hexagon's foot, over all live.json holds (from 2 November); dragging moves the moment at the foot; on release the graph plays from there at the real pace (queue rebuilt from live.json, the flow weighed as it was then), LIVE goes grey and a "● LIVE" button returns. Not in display mode. host.lvGraph.back and a 'lv-time' event for dev.work@'s work view to follow (work-live.js does not yet). Test `lvdial`.

## Earlier today (runs 14 to 16)
- 0c3 (1) phone playback 31 to 33-34 fps (cached day formatter); 0c3 (6) the timeline collapsed and the commits out of data.json (replay-events.json); 0c0 dev.work@'s hook in live.js.
- Two runs can overlap: before starting, fetch workers/dev.map and check its newest commit's time; if under an hour old and STATE has no "Last run" end, take an item the other run is not on.

## Open
- The dial over six days is coarse with a mouse on a phone (about 30 minutes a pixel); the arrow keys step one minute. If Angelo wants finer: a 48-hour default with a "whole record" switch.
- The work view (dev.work@'s work-live.js) does not follow the dial yet: it can listen for 'lv-time' (detail.back) on the host. For dev.work@.
- PT News's stamp is always the cream one: live.js passes the function `light` (always true) instead of `light()`; left as Angelo knows it, a question for the desk.
- lvlabel fixed in its test: the live clock follows the viewer's locale (12-hour in New York); the test assumed 24-hour and failed after 13:00 there.
- Offline (sw.js): replay-events.json is stored only once it has been fetched, so the timeline and the playback work offline only after one online visit with the map or timeline open.
- 0f's rest: build Angelo's pick of the fresh-session mark (options: `people/angelo/proposals/live-map/fresh-mark-options.svg`, A, B or C); the dashed ring stays until he picks.
- The replay at a quarter CPU speed (a phone) is 33 to 34 fps with the timeline open (run 16): the rest is the map's own paint. Next step if the desk wants it before the summit: the map's moving layer (lines, dots) on a canvas over the still SVG; estimate about two runs.
- Item 00's rest: Safari and iPad untested (no WebKit here).
- Piece 4 (public /team/map/) needs build.mjs and the newsroom: a question for the desk.
- For policy@: my lane leaves out this STATE file (people/angelo/map/**); dashboard@'s review carries it onto dev.

## Last run
Run 17 ended 23:52 UTC: two commits (dc791bdb, 123b5bf0) and this one on workers/dev.map; unsigned run log; ledger line.
Pushing: the branch already holds workers/dev.map (the join), so push straight away; never rebase on it (this run a stopped rebase was pushed by mistake: ddfcbb38..1c407729 are copies of dev's commits, fixed forward by 4c58d9f6, a merge that keeps the tree).
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=6000 origin dev` for tmf and the replay tests). Gate with LANE_RANGE=<the join commit>..HEAD.
