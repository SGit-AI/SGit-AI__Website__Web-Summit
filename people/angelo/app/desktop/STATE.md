# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 13:05 UTC. Backlog 00a2 (the desk's 9d018cc): a section "A live phone background with the 3D map" in people/angelo/proposals/live-map/spec-live-app.md, with sources, for Angelo's review; no build. Android: a real live wallpaper (WallpaperService, drawn natively in OpenGL ES from live.json, only while visible), for dev.android@ to build on his go. iPhone: no live wallpaper; a Live Photo from the replay's clip (moves a few seconds on waking), or a widget (a still, 40 to 70 refreshes a day) needing Dinis's iOS app. Three questions for Angelo (4 to 6). dashboard@ brought the 12:05 run onto dev (629cc7b).

## Open
- Installers: need Windows and Mac machines. CI draft drafts/desktop-build.yml, For: conductor@web-summit.dinis (needs contents: write for one "desktop-latest" release; their call). Until then, nothing to download; the page says so.
- transparent=1 in live.js: draft drafts/live-transparent.md For: dev.map@ (live.js changed within two hours again: cd5cca4, 11:57); its CSS corrected at 12:05 (the same 3D visibility fault). The app does not wait on it.
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, fill DOWNLOADS in page.mjs; the iPad test by Angelo's helper; lvclear test once transparent=1 lands.
- On dev up to the 12:05 run (dashboard@'s review, 629cc7b); the 13:05 run (00a2's section) on workers/dev.app, for dashboard@.
- 00a2: waits on Angelo's answers (spec questions 4 to 6); then the drawing contract beside live3d.js, for dev.android@.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
