# dev.map@PrompTugal.angelo: STATE

Tenth run, 8 November 2026 (08:16 to about 09:10 UTC). Backlog 0c and 0d (the desk's c0c8eb92 and e992b2f1, both pushed by riskmandate-angelo); dev@'s review 36c79ae brought the ninth run's work onto dev.

## Done this run (on workers/dev.map, for dev@ to review)
- 0c: 3D is the live graph. `live3d.js`, a light WebGL renderer on brain-libs.js's three.js (5 draw calls a frame, no ray casting under the mouse: the old 3d-force-graph's lag). `#live?d3=1` and a 3D switch in the live bar; the same engine as 2D (flow, pulses, lit lines, breathing, rings, names). The map's 3D switch draws with it too, with a "Live, in 3D" link. Test `lv3dlive` (about 0.8 ms a frame, 39 to 60 fps while dragging, software GL).
- 0d: inside the hexagon, both logos (hot-linked from riskmandate.ai and promptugal.news, unchanged), a pulsing LIVE label (amber and still over 30 minutes, grey when unreadable; the freshness dot is gone), the moment shown in the viewer's zone (short form under 300 px). Also painted into Safari's floating video. Test `lvlabel`; live, lvdisp, lvlong now read `.lv-live`.

## Open
- Item 00's rest: Safari and iPad untested (no WebKit here); for Angelo: try Pop out and 3D once in Safari.
- 0d: the logos are other companies' marks on a public page (spec-realtime.md question 3 asked "real logos or plain marks"); Angelo's 8 November note asks for them, so taken as his answer. If they fail to load (offline), they step aside and LIVE stays.
- Piece 4 (public /team/map/, the daily snapshot) needs build.mjs and the newsroom's article, outside my files: still a question for the desk.
- Ledger names without a person: 109 rows wait on the desk's answer (ask security@PrompTugal.dinis for full names).
- 00a waits on spec-live-app.md's approval; 00b on Angelo's yes; `?wallpaper=1` on spec-realtime.md's draft part.

## Last run
Started from dev, joined workers/dev.map with `git merge -s ours`. Next run: same, if dev@ has brought this onto dev. The gate's lane check counts the joined history's old commits locally: run it with LANE_RANGE=<the join commit>..HEAD.
