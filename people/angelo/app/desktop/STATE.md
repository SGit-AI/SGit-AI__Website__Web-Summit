# dev.app@PrompTugal.angelo: STATE

Backlog 00a, the live graph as a hexagonal app. Short; the commits are the history.

## Last run
2026-11-08 18:06 UTC. 00a2 built, at the desk's 54b2877 (Angelo's priority): the Android live wallpaper in people/angelo/app/android/ (Graph.java the contract, GLES2 renderer, WallpaperService, setup screen, SDK-only build.sh, install guide README, CI draft drafts/android-build.yml), test hxappwall. APK built and verified in the session (66 KB), never committed. Not seen on a phone: no emulator here (no KVM).

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger. dashboard@'s light-mode note (flat grey centre with transparent=1) is in live.js, dev.map@'s: left to it.
- Installers: need Windows and Mac machines. CI drafts drafts/desktop-build.yml and drafts/deploy-pages-step.md, For: conductor@web-summit.dinis (contents: write for the storage release, actions: write for one deploy; their call). Served from our site's dl/. Until then, nothing to download; the page says so.
- transparent=1 is live on the site (49bd878). main.rs's INIT now also carries 0.1.1's scroll-bar fix and control panel (dashboard@), so it stays; its transparent CSS is now redundant but harmless: leave it, so the app works with an older page.
- My lane: I have none in people/angelo/policy/lanes.json (now also people/angelo/app/android/** for 00a2, until dev.android@ starts), so the lane check refuses my commits whatever they declare. Asked policy@ (via the desk) for: people/angelo/app/desktop/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Next: when the CI runs, check the page lists both installers (nothing to fill in by hand now); the iPad test by Angelo's helper.
- On dev up to the 15:06 run (49bd878); the 16:06 (0m) and 17:06 runs on workers/dev.app, for dashboard@ (apply as patches onto dev: this branch's own tree lacks abp-live/player.htm, so its gate shows ipad.html's two player links as broken; on dev they resolve).
- 00a2: built (above). Next: someone installs it on an Android phone (battery, frame rate, each launcher's preview); serve the APK from the site (drafts/android-build.yml, For: conductor@web-summit.dinis); dev.android@ takes android/ over when it starts. If live.js or live3d.js changes how it draws, hxappwall fails until Graph.java follows. iPhone Live Photo (question 5) waits.
- The pop-out's black 3D (0c2 point 3) is dev.map@'s; the app's window draws 3D fine in Chromium. Not testable here: WebView2 (Windows) and WKWebView (Mac).

## Waiting on
- conductor@web-summit.dinis: the CI workflow (or Angelo builds on his laptop: README "Build it yourself").
- policy@PrompTugal.angelo: my lane.
- Angelo: signing (only if the first-open warnings stop people).
