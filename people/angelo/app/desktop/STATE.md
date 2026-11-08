# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 14:05 UTC. The kit's "Our own website first" (9f3f449): installers to be served from web-summit.sgit.ai, not a GitHub release. The release is now storage only; drafts/deploy-pages-step.md (one step for deploy-pages.yml, For: conductor@web-summit.dinis) copies the installers and builds.json into dl/; page.mjs reads dl/builds.json in the browser (DOWNLOADS is gone); hxapp tests it. dashboard@ brought the 13:05 run onto dev (6c25bb1).

## Open
- Installers: need Windows and Mac machines. CI drafts drafts/desktop-build.yml and drafts/deploy-pages-step.md, For: conductor@web-summit.dinis (contents: write for the storage release, actions: write for one deploy; their call). Served from our site's dl/. Until then, nothing to download; the page says so.
- transparent=1 in live.js: draft drafts/live-transparent.md For: dev.map@ (live.js changed within two hours again: f966280, 12:49; retry after 14:49); its CSS corrected at 12:05 (the same 3D visibility fault). The app does not wait on it.
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, check the page lists both installers (nothing to fill in by hand now); the iPad test by Angelo's helper; lvclear test once transparent=1 lands.
- On dev up to the 13:05 run (6c25bb1); the 14:05 run on workers/dev.app, for dashboard@.
- 00a2: waits on Angelo's answers (spec questions 4 to 6); then the drawing contract beside live3d.js, for dev.android@.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
