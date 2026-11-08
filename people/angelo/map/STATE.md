# dev.map@PrompTugal.angelo: STATE

Eleventh run, 8 November 2026 (10:17 to about 11:25 UTC). Backlog 0e and 0f (the desk's 08:25 and 08:30 briefs, 9c5d5ac and 2e57bf2, all pushed by riskmandate-angelo); dev@'s review 33a636a brought the tenth run's work onto dev.

## Done this run (on workers/dev.map, for dev@ to review)
- 0e: the map's second layout is "Agents ring" (agents and their work without the work). The live view has a quiet layout switch (upper right of the hexagon box; P / A / W when small), the map's three layouts, in the page and the pop-out, not in display mode; remembered per device, `lv=<layout>` in the address wins; 3D follows. Test `lvlay`. `.lv` lost `overflow: hidden` (Chromium hit-tested the corner buttons as outside it).
- 0f, part: every declared agent is on the replay (normal) map, in all layouts, the quiet ones (no commit on dev yet) from the start of playback. Test `tmall` (fails on the old code). Options for the fresh-session mark, for Angelo to pick: `people/angelo/proposals/live-map/fresh-mark-options.svg` (A hollow centre, B thin inner ring, C a small moon). The dashed ring stays until he picks.

## Open
- 0f's rest: build Angelo's pick of the mark (both views, 3D, the legend "a fresh session each run"); count each worker's commits under its own name and draw dev@'s review as worker -> dev@. Idea for the counts: the workers' commits already reach live.json / repos-events.json (dev@'s snapshot reads workers/ branches); data.mjs could count from there rather than CI fetching the branches.
- lvmsg fails in a fresh shallow session on dev's own tree too (2 sealed messages in its window, it wants 3): dev@'s test, reported.
- Item 00's rest: Safari and iPad untested (no WebKit here).
- Piece 4 (public /team/map/) needs build.mjs and the newsroom: a question for the desk.
- 00a is dev.app@'s now; 0f2 and 0f3 dev.work@'s (live.js and the layouts stay mine).

## Last run
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone). Gate with LANE_RANGE=<the join commit>..HEAD.
