# dev.map@PrompTugal.angelo: STATE

Sixteenth run, 8 November 2026 (20:15 to about 21:00 UTC). No new commit For: dev.map@ since run 15; every named backlog item of mine is done or waiting on Angelo. dashboard@ reviews.

## Done this run (on workers/dev.map, for dashboard@ to review)
- 0c3 (1), the phone: the map's playback at a quarter CPU, 390 px, three days, timeline open was 31 fps (47 closed). JavaScript is about 16% of the time; the rest is painting and layering the map's SVG (2,590 elements) each frame. Tried and dropped (no measurable change): containment on the timeline, a layer for the playhead overlay, content-visibility, no transitions on the lines. Kept: dayLabel from one cached Intl.DateTimeFormat, one label per UTC day (it built a formatter every frame): 33 to 34 fps. A canvas for the moving layer is the real fix: a question for the desk.

## Run 14 (18:15 to about 19:40 UTC)
- 0c3 (6), the timeline collapsed on its own (app.js, replay.js, data.mjs): closed by default, a "Show the timeline" button whether the map is open or not, remembered on this device (localStorage `ak-tl-open`); `tl=1` or the timeline's own filters (`r_*`) in the address open it, and an old `#replay` link lands with `tl=1`; closing drops them. Drawn only when open.
- The data: every commit since 2 November (`replay.events`) left data.json for `replay-events.json` (extras in data.mjs; ignored by `people/angelo/app/.gitignore`), fetched once, only when the map or the timeline is opened. The first load of the command centre (any view): data.json 1,137 KB -> 858 KB, gzipped 307 KB -> 217 KB (-29%). With the map open the commits are still fetched (its playback needs them); the timeline's 9,000 marks are not drawn unless it is open. Test `tmtlc`; `rpfps` opens the timeline with `tl=1`.

## Done in a parallel run (19:09 to 19:40 UTC, run 15)
- 0c0, dev.work@'s hook in live.js (7751d4e, the desk's a2c8e4c7): host.lvGraph and the 'lv-graph' event; wv, wvdraw, wvlive and the lv tests pass on dev's tree. dev.work@ adds the switch next.
- lvmsg is not broken: it needs three sealed messages and a shallow clone holds two; with `git fetch --depth=3000 origin dev` it passes.
- Two runs overlapped (this schedule fired while run 14 was still working): before starting, fetch workers/dev.map and check its newest commit's time; if it is under an hour old and STATE has no "Last run" end, the other run may still be going: take an item it is not on.

## Open
- lvlabel fixed in its test: the live clock follows the viewer's locale (12-hour in New York); the test assumed 24-hour and failed after 13:00 there.
- Offline (sw.js): replay-events.json is stored only once it has been fetched, so the timeline and the playback work offline only after one online visit with the map or timeline open.
- 0f's rest: build Angelo's pick of the fresh-session mark (options: `people/angelo/proposals/live-map/fresh-mark-options.svg`, A, B or C); the dashed ring stays until he picks.
- The replay at a quarter CPU speed (a phone) is 33 to 34 fps with the timeline open (run 16): the rest is the map's own paint. Next step if the desk wants it before the summit: the map's moving layer (lines, dots) on a canvas over the still SVG; estimate about two runs.
- Item 00's rest: Safari and iPad untested (no WebKit here).
- Piece 4 (public /team/map/) needs build.mjs and the newsroom: a question for the desk.
- For policy@: my lane leaves out this STATE file (people/angelo/map/**); dashboard@'s review carries it onto dev.

## Last run
Pushing: the branch already holds workers/dev.map (the join), so push straight away; never rebase on it (this run a stopped rebase was pushed by mistake: ddfcbb38..1c407729 are copies of dev's commits, fixed forward by 4c58d9f6, a merge that keeps the tree).
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=6000 origin dev` for tmf and the replay tests). Gate with LANE_RANGE=<the join commit>..HEAD.
