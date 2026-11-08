# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 16:06 UTC. Backlog 0m (the desk's 47e2dd06): people/angelo/app/desktop/ipad.html, "Set up an iPad for the stand" (the link list: Home Screen app, display mode, ABP player loop and interactive; Auto-Lock, Low Power, Do Not Disturb, Guided Access), linked from the app page; test hxappipad (page at 1280/390 light and dark, links answer; display mode and both player modes at Chromium's iPad profiles with touch). The 15:06 run is on dev (49bd878).

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger. dashboard@'s light-mode note (flat grey centre with transparent=1) is in live.js, dev.map@'s: left to it.
- Installers: need Windows and Mac machines. CI drafts drafts/desktop-build.yml and drafts/deploy-pages-step.md, For: conductor@web-summit.dinis (contents: write for the storage release, actions: write for one deploy; their call). Served from our site's dl/. Until then, nothing to download; the page says so.
- transparent=1 in live.js: in, on workers/dev.app for dashboard@ (15:06 run). Once it is live on the site, drop main.rs's INIT start-up script (keep it until then, so the app works with either page).
- My lane: I have none in people/angelo/policy/lanes.json, so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, check the page lists both installers (nothing to fill in by hand now); the iPad test by Angelo's helper.
- On dev up to the 15:06 run (49bd878); the 16:06 run (0m) on workers/dev.app, for dashboard@.
- 00a2: waits on Angelo's answers (spec questions 4 to 6); then the drawing contract beside live3d.js, for dev.android@.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
