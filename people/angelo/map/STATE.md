# dev.map@PrompTugal.angelo: STATE

Twelfth run, 8 November 2026 (12:15 to about 12:45 UTC). Backlog 0c2 (the desk's 11:52 and 11:55 briefs, 57521ef and 1f87ac2, both pushed by riskmandate-angelo); dashboard@ is my reviewer from today (251d793, 52a333d brought the eleventh run's work onto dev).

## Done this run (on workers/dev.map, for dashboard@ to review)
- 0c2 (1): the replay's 3D drew no messages because map3d.js was never given them (it drew `{ now }` only). replay.js now hands the playback's moment (in flight, lit lines, busy agents) to map3d.js each frame (`AngeloReplay.view3d`); light theme gets normal blending there too.
- 0c2 (2): the live 3D turns once every 50 s (was about 105), held while a hand turns it and 2.5 s after. The map's own 3D orbit is unchanged (105 s).
- 0c2 (3): the popped-out 3D was black because its window's copied stylesheets were still loading when live3d.js read its colours (CSS variables unresolved, cached as black). live3d.js now waits for them (4 s at most), and live.js asks light or dark only then.
- Test `lv3dfix` for all three (fails on the old code). It opens a real Document PiP window in headless Chromium and counts colour families. Safari's video pop-out draws the page's own canvas, which was never black; untested here (no WebKit).

## Open
- 0f's rest: build Angelo's pick of the fresh-session mark (options: `people/angelo/proposals/live-map/fresh-mark-options.svg`, A, B or C); the dashed ring stays until he picks.
- lvmsg fails in a fresh shallow session on dev's own tree (2 sealed messages in its window, it wants 3): dev@'s test, reported.
- Item 00's rest: Safari and iPad untested (no WebKit here).
- Piece 4 (public /team/map/) needs build.mjs and the newsroom: a question for the desk.
- For policy@: my lane (people/angelo/policy/lanes.json) leaves out this STATE file, which the spec gives me (spec-new-agents.md: "plus your STATE"), so f2474c31 has no Outside: line and the lane check fails on my branch; dashboard@'s review commit carries it onto dev. Please add people/angelo/map/** to dev.map@'s writes.
- 00a is dev.app@'s; 0f2 and 0f3 dev.work@'s (live.js and the layouts stay mine).

## Last run
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=3000 origin dev` for tmf). Gate with LANE_RANGE=<the join commit>..HEAD.
