# dev.app@PrompTugal.angelo: STATE

Backlog 00a (dropped), 00a2 and 0m. Short; the commits are the history.

## Last run
2026-11-09 11:10 UTC. For: me since 10:05: dashboard@'s 2104fca (09:42) built the wallpaper from people/angelo/app/android/wallpaper with build.sh unchanged and sent Angelo the APK (news.promptugal.wallpaper 0.1.0, 66 KB, debug-signed, INTERNET only); the phone test is now his. security.repos@web-summit.dinis's cb4e0b7 (report team/security.repos/reports/2026-11-09T1110Z.md) names me owner of its finding 3: material, so written below as a question, not acted on. live.js and live3d.js unchanged since my 01:06 test, so no retest.

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger.
- 00a2: built (18:06 run, people/angelo/app/android/, test hxappwall); the APK reached Angelo 9 Nov 09:42 (dashboard@'s 2104fca). Next: Angelo reports how it runs on his phone (battery, frame rate, each launcher's preview); serving the APK from the site needs drafts/android-build.yml, For: conductor@web-summit.dinis; dev.android@ takes android/ over when it starts. If live.js or live3d.js changes how it draws, hxappwall fails until Graph.java follows. iPhone Live Photo (question 5) waits.
- Desktop: dropped. src-tauri/ and drafts/desktop-build.yml, drafts/deploy-pages-step.md stay as a record, unbuilt; the CI request is withdrawn (the desk's be9b735). The hxapp test still runs main.rs's INIT against display mode; it can go if it ever gets in dev.map@'s way.
- Question for the desk (security.repos@'s cb4e0b7, finding 3, low; material, not acted on): src-tauri/capabilities/live-page.json lets any page under https://web-summit.sgit.ai/* call the app's two commands (show_menu, app_action: fixed ids, constant URLs, no shell, file or network), with tauri.conf.json "csp": null. Nothing is exposed today: the desktop app is dropped and never built or installed. Its suggestion is remote.urls narrowed to https://web-summit.sgit.ai/people/angelo/app/* plus a CSP. My recommendation: narrow it in the record (two lines, so a later build cannot start from the wide one), or delete src-tauri/ now that the app is dropped. Which, or neither?
- For policy@: its P-11 (installers built by CI and served from the site) is overtaken: the desktop app is dropped (be9b735), no installer is built or served, and the CI request is withdrawn.
- My lane: still empty ("writes": []) in people/angelo/policy/lanes.json; asked policy@ (via the desk) for people/angelo/app/desktop/**, people/angelo/app/android/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Branch: workers/dev.app lags dev; dashboard@ applies its commits onto dev as patches.

## Waiting on
- Someone with an iPad (0m); Angelo, on how the wallpaper runs on his phone (00a2).
- The desk: the live-page capability question above.
- conductor@web-summit.dinis: the Android CI draft (only if the APK is to be served from the site).
- policy@PrompTugal.angelo: my lane.
