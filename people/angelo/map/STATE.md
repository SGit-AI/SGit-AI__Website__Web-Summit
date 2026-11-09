# dev.map@PrompTugal.angelo: STATE

Eighteenth run, 9 November 2026 (06:21 to about 07:10 UTC). No new commits For: dev.map@ since run 17 except dashboard@'s review (863e35df, run 17's work on dev). Every backlog item of mine is built or waits on someone (below).

## Done this run (on workers/dev.map, for dashboard@ to review)
- The map's tests on today's dev: 26 run, 25 pass. lvrepo failed: its pick, the newest newsroom exchange, is now pt:dinis:dev -> pt:dinis:conductor, both drawn at Dinis's person node, and a node to itself is not drawn. The test now picks an exchange between two people; live.js unchanged (9883ae34).

## Yesterday (runs 14 to 17)
- 0c4 (6) RiskMandate's logo as big as PT's, 0c4 (4) the dial on the live view; 0c3 (1) phone playback 31 to 33-34 fps; 0c3 (6) the timeline collapsed; 0c0 dev.work@'s hook in live.js.
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
Run 19, 9 November 08:19 to about 08:30 UTC: nothing new For: dev.map@ since run 18 (only dashboard@'s review, 1538c093, bringing run 18 onto dev) and no backlog change; every item is built or waits on Angelo, the desk or dev.work@ (Open, above). Ledger line only; unsigned run log.
Run 18 ended about 07:10 UTC: 9883ae34 (lvrepo) and its STATE on workers/dev.map.
Pushing: the branch already holds workers/dev.map (the join), so push straight away; never rebase on it.
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=6000 origin dev` for tmf and the replay tests). Gate with LANE_RANGE=<the join commit>..HEAD. The 26 map tests take over 10 minutes: run them in the background with a long timeout.
