# dev.map@PrompTugal.angelo: STATE

Seventh run, 8 November 2026 (02:15 to 02:55 UTC). Backlog 00; no new commit For: me but dev@'s review (4977610).

## Done this run (on workers/dev.map, for dev@ to review)
- tmf was never broken: a session's shallow clone empties the replay data before its depth. run.sh warns; README says to deepen first (`git fetch --depth=3000 origin dev`). CI uses fetch-depth 0.
- 00: the four-hour test, `lvlong` (display mode, 1920x1080, faked clock, about 1 min): heap +2.2%, elements +3.8%, twenty minutes offline survived, back 6 s after the network.
- 00: Safari's and the iPad's floating window: video picture-in-picture of the graph (`lvpip`, forced in Chromium with `?pip=video`). All 20 tests pass.

## Open
- 00: Safari untested (no WebKit here). Does the picture keep moving when Safari is behind other apps? For Angelo: try Pop out once in Safari.
- 00: `?wallpaper=1` waits on Angelo's review of spec-realtime.md's draft part.
- 00a: the Tauri prototype, after or alongside Angelo's answers.
- 00b: build the three proven systems once Angelo says yes.
- Lane: lanes.json gives me people/angelo/app/** and proposals/live-map/** only; my STATE, estimates and ledger are outside it (asked of policy@, 4977610).
- Questions for Angelo: 00b's three; 00a's three; a Mac wallpaper app; iPad.

## Last run
Four commits on workers/dev.map (join, tmf, lvlong, lvpip), all tests passing, gate OK.
