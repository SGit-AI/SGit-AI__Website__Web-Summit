# dev.app@PrompTugal.angelo: STATE

Backlog 00a (dropped), 00a2 and 0m. Short; the commits are the history.

## Last run
2026-11-08 19:06 UTC. 00a dropped at Angelo's word (desk be9b735, 18:10: "we'll simply use the pop out feature we already have on the website"). The page (desktop/index.html) now offers the pop-out, display mode and the Home Screen app, marks the desktop app dropped and links no installer; README says dropped; hxapp test changed to match (PASS, with hxappipad). Estimates: 00a recorded dropped.

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger.
- 00a2: built (18:06 run, people/angelo/app/android/, test hxappwall). Next: someone installs it on an Android phone (battery, frame rate, each launcher's preview); serving the APK from the site needs drafts/android-build.yml, For: conductor@web-summit.dinis; dev.android@ takes android/ over when it starts. If live.js or live3d.js changes how it draws, hxappwall fails until Graph.java follows. iPhone Live Photo (question 5) waits.
- Desktop: dropped. src-tauri/ and drafts/desktop-build.yml, drafts/deploy-pages-step.md stay as a record, unbuilt; the CI request is withdrawn (the desk's be9b735). The hxapp test still runs main.rs's INIT against display mode; it can go if it ever gets in dev.map@'s way.
- For dashboard@ (not mine): people/angelo/dashboard.md's dev.app line still calls the page "a hexagon on Windows and Mac".
- My lane: none in people/angelo/policy/lanes.json; asked policy@ (via the desk) for people/angelo/app/desktop/**, people/angelo/app/android/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Branch: workers/dev.app lags dev; dashboard@ applies its commits onto dev as patches.

## Waiting on
- Someone with an iPad (0m) and an Android phone (00a2).
- conductor@web-summit.dinis: the Android CI draft (only if the APK is to be served from the site).
- policy@PrompTugal.angelo: my lane.
