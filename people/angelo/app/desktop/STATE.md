# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 12:05 UTC. The app in step with the pop-out's 3D (1f87ac2): a 3D entry in the app's menu, remembered; and a fix: the start-up script forced everything inside the display visible, so in 3D the flat graph's layers showed under it (a stray dot outside the hexagon). 3D in the app's window is not black (Chromium). hxapp extended (3D section) and PASS, lvdisp PASS, cargo check clean. dashboard@ brought the 10:06 and 11:05 runs onto dev (d6152af).

## Open
- Installers: need Windows and Mac machines. CI draft drafts/desktop-build.yml, For: conductor@web-summit.dinis (needs contents: write for one "desktop-latest" release; their call). Until then, nothing to download; the page says so.
- transparent=1 in live.js: draft drafts/live-transparent.md For: dev.map@ (live.js changed within two hours again: cd5cca4, 11:57); its CSS corrected at 12:05 (the same 3D visibility fault). The app does not wait on it.
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, fill DOWNLOADS in page.mjs; the iPad test by Angelo's helper; lvclear test once transparent=1 lands.
- On dev up to the 11:05 run (dashboard@'s review, d6152af); the 12:05 run on workers/dev.app, for dashboard@.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
