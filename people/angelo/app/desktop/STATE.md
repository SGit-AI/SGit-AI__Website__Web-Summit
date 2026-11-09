# dev.app@PrompTugal.angelo: STATE

Backlog 00a (dropped), 00a2, 0m and 14 (on hold). Short; the commits are the history.

## Last run
2026-11-09 12:09 UTC. For: me since 11:10, all the desk's and pushed by riskmandate-angelo (checked): 54d01e4 (WS-202, the Android counterparts of the iOS apps, shared on one board issue), 36eb0d8 (my job is now the Android apps, in people/angelo/app/android/; no dev.android@ task) and e588f4b (11:36: PrompTugal/PrompTugal__App__Android already exists and ships, build 0.1.78, run by Dinis's conductor.android@promptugal.ai; our Android rows ON HOLD, nothing built in parallel; WS-202 renumbered WS-203). So I built nothing: backlog 14 is on hold, and the wallpaper stays ready as a module to offer, Angelo's call. dashboard@'s 3a51666 (material): it built the Windows desktop app v0.1.1 on 8 November and Angelo installed and ran it on his laptop, so my "never built or installed" was wrong; corrected in Open.

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger.
- 00a2: built (18:06 run, people/angelo/app/android/, test hxappwall); the APK reached Angelo 9 Nov 09:42 (dashboard@'s 2104fca). Next: Angelo reports how it runs on his phone (battery, frame rate, each launcher's preview); serving the APK from the site needs drafts/android-build.yml, For: conductor@web-summit.dinis; no dev.android@ task (36eb0d8); android/ is mine, and on hold (e588f4b). If live.js or live3d.js changes how it draws, hxappwall fails until Graph.java follows. iPhone Live Photo (question 5) waits.
- Desktop: dropped. src-tauri/ and drafts/desktop-build.yml, drafts/deploy-pages-step.md stay as a record, unbuilt; the CI request is withdrawn (the desk's be9b735). The hxapp test still runs main.rs's INIT against display mode; it can go if it ever gets in dev.map@'s way.
- Question for the desk (security.repos@'s cb4e0b7, finding 3, low; material, not acted on): src-tauri/capabilities/live-page.json lets any page under https://web-summit.sgit.ai/* call the app's two commands (show_menu, app_action: fixed ids, constant URLs, no shell, file or network), with tauri.conf.json "csp": null. Correction (dashboard@'s 3a51666): dashboard@ built the Windows installer v0.1.1 on 8 November and Angelo installed it before the app was dropped, so that installed copy is exposed in this small way until he uninstalls it (his dashboard now asks him to). Its suggestion is remote.urls narrowed to https://web-summit.sgit.ai/people/angelo/app/* plus a CSP. My recommendation, now with dashboard@'s: Angelo uninstalls the desktop app, and src-tauri/ is deleted from the repository since the app is dropped. Delete, narrow, or neither?
- For policy@: its P-11 (installers built by CI and served from the site) is overtaken: the desktop app is dropped (be9b735), no installer is built or served, and the CI request is withdrawn.
- My lane: still empty ("writes": []) in people/angelo/policy/lanes.json; asked policy@ (via the desk) for people/angelo/app/desktop/**, people/angelo/app/android/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Branch: workers/dev.app lags dev; dashboard@ applies its commits onto dev as patches.

- 14 (ON HOLD, the desk's e588f4b, board/WS-203): the Android apps exist in PrompTugal/PrompTugal__App__Android (Dinis's conductor.android@promptugal.ai). Nothing built in parallel. The wallpaper (android/wallpaper/) stays ready as a module to offer; whether to offer it is Angelo's call, then conductor.android@'s answer on WS-203.

## Waiting on
- Angelo, then conductor.android@promptugal.ai on WS-203: whether the live map and the wallpaper go to the Android app as modules (14).
- Someone with an iPad (0m); Angelo, on how the wallpaper runs on his phone (00a2).
- The desk: the live-page capability question above.
- conductor@web-summit.dinis: the Android CI draft (only if the APK is to be served from the site).
- policy@PrompTugal.angelo: my lane.
