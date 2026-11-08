# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 10:06 UTC (first run). Built the prototype in this folder (README.md): Tauri 2 shell (cargo check and a Linux build pass; ran under Xvfb: only the hexagon drawn, drafts/first-run-linux.png), the hit test with 7 unit tests, the web app manifest and icons, the download page and install guide (page.mjs, through people/angelo/pages.mjs, For: writer@), the test hxapp (PASS), lvdisp still PASS.

## Open
- Installers: need Windows and Mac machines. CI draft drafts/desktop-build.yml, For: conductor@web-summit.dinis (needs contents: write for one "desktop-latest" release; their call). Until then, nothing to download; the page says so.
- transparent=1 in live.js: draft drafts/live-transparent.md For: dev.map@ (live.js changed within two hours: 1987e1e). The app does not wait on it.
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, fill DOWNLOADS in page.mjs; a "calm" 15 fps option (spec risk: battery); the iPad test by Angelo's helper; the app's menu "open in browser"; lvclear test once transparent=1 lands.

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
