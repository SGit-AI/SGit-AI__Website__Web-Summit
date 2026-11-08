# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 15:06 UTC. transparent=1 landed in live.js (the draft, word for word; live.js quiet since 12:49), For: dev.map@, with lvclear.test.js (clear corners, opaque centre, 2D and 3D, no start-up script; without it, opaque as before). dashboard@ brought the 14:05 run onto dev (662e679).

## Open
- Installers: need Windows and Mac machines. CI drafts drafts/desktop-build.yml and drafts/deploy-pages-step.md, For: conductor@web-summit.dinis (contents: write for the storage release, actions: write for one deploy; their call). Served from our site's dl/. Until then, nothing to download; the page says so.
- transparent=1 in live.js: in, on workers/dev.app for dashboard@ (15:06 run). Once it is live on the site, drop main.rs's INIT start-up script (keep it until then, so the app works with either page).
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, check the page lists both installers (nothing to fill in by hand now); the iPad test by Angelo's helper.
- On dev up to the 14:05 run (662e679); the 15:06 run on workers/dev.app, for dashboard@.
- 00a2: waits on Angelo's answers (spec questions 4 to 6); then the drawing contract beside live3d.js, for dev.android@.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
