# dev.map@PrompTugal.angelo: STATE

Twenty-sixth run, 9 November 2026 (22:19 to about 22:45 UTC). The desk briefed the glow at last: 1ac23df8 (desk.conductor@, pushed from riskmandate-angelo), backlog 0c6.

## Done this run (on workers/dev.map, for dashboard@ to review)
- 0c6, the live graph glowing all the time (people/angelo/proposals/live-map/glow/README.md), drawing only:
  - live3d.js: the steady flow drawn as a real exchange, a little smaller: a head of 34 at alpha 0.55 to 0.95 over its trip and a three-dot trail of 20, 16.5 and 13 at 0.6 of the head's alpha, fading; lit lines at min(1, op * 1.25), where they were op * 1.05.
  - live.js (2D, every layout): each flow dot gets a halo (r 10, as a real exchange's 14 is to its 7.5 dot), opacity 0.45 of the dot's 0.55 to 0.95; lit lines' stroke-opacity min(1, op * 1.25). The engine's own op (which 3D reads) is unchanged. The halo carries class "flow" too, so the six-hourly reload, which waits for no real exchange in flight, still sees only flow.
  - New test lvglow (2D halos and 0.94 lines, 3D four points a flow dot), at 1280 and 390 px, light and dark.
  - The trail sizes follow the brief (20/16.5/13); dashboard@ matched the wallpaper to them (07264726, 0.4.4).

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
Run 27, 10 November 00:14 to about 00:20 UTC: nothing from the desk, runner or dev@ For: dev.map@ since run 26; dashboard@'s b3baf51b brought run 26's glow (0c6) onto dev and its 07264726 matched the wallpaper's trail to 20/16.5/13, so the Done item's question is closed. The backlog's changes since are not mine; conductor@web-summit.dinis's big-stop report (4080019c) is material. pushed-by --last-touch checked the spec (e588f4b5, ANGELO). Ledger line only; unsigned run log.
Run 26, 9 November 22:19 to about 22:45 UTC: the desk's 1ac23df8 (ANGELO) briefed 0c6, the glow; built (Done, above). pushed-by --last-touch checked the spec (e588f4b5, ANGELO).
Run 25, 9 November 20:17 to about 20:30 UTC: nothing from the desk, runner or dev@ For: dev.map@ since run 24; only dashboard@'s review 1efbc49a (run 24 onto dev), which again asks the desk to brief the glow (b52ac2f0): still material until the desk does (Open, above). The backlog's change since (a3a00cfc, research@) is not mine. pushed-by --last-touch checked the spec (e588f4b5, ANGELO); a plain git log in this shallow clone gave the boundary b52ac2f0, as 1b2 warns. Ledger line only; unsigned run log.
Run 24, 9 November 18:16 to about 18:25 UTC: nothing from the desk, runner or dev@ For: dev.map@ since run 23; dashboard@'s b52ac2f0 (the glow on all views) is material until the desk briefs it (Open, above); the backlog's changes since (research@, the wristbands article, the pool) are not mine. pushed-by --last-touch checked the spec (e588f4b5, ANGELO). Ledger line only; unsigned run log.
Run 23, 9 November 16:18 to about 16:25 UTC: nothing new For: dev.map@ since run 22 (only dashboard@'s reviews df4b6084, eaeead3b and its Android wallpaper work 48a75f60, not mine); the backlog's changes since (an article, the authority-checks draft, dev.abp@'s demo) are not mine; every item built or waiting (Open, above). pushed-by --last-touch checked the spec (e588f4b5, ANGELO). Ledger line only; unsigned run log.
Run 22, 9 November 14:15 to about 14:25 UTC: nothing new For: dev.map@ since run 21 (only dashboard@'s review b4a65e23); the backlog's changes since (Android wallpaper, articles) are not mine; every item built or waiting (Open, above). pushed-by --last-touch checked the spec (e588f4b5, ANGELO). Ledger line only; unsigned run log.
Run 21, 9 November 12:23 to about 12:30 UTC: nothing new For: dev.map@ since run 20 (only dashboard@'s review 8ea65ed5); the backlog's changes (0-POOL, 0-FIX, 0-URGENT-2/3, 14 removed) are not mine; every item built or waiting (Open, above). pushed-by --last-touch checked the spec (e588f4b5, ANGELO). Ledger line only; unsigned run log.
Run 18 ended about 07:10 UTC: 9883ae34 (lvrepo) and its STATE on workers/dev.map.
Pushing: the branch already holds workers/dev.map (the join), so push straight away; never rebase on it.
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=6000 origin dev` for tmf and the replay tests). Gate with LANE_RANGE=<the join commit>..HEAD. The 26 map tests take over 10 minutes: run them in the background with a long timeout.
