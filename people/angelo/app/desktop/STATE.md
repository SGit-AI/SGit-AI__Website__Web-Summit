# dev.app@PrompTugal.angelo: STATE

Backlog 00a (dropped), 00a2, 0m and 14 (on hold). Short; the commits are the history.

## Last run
2026-11-10 00:05 UTC. Spec checked with pushed-by.mjs --last-touch (e588f4b, riskmandate-angelo, ANGELO). For: me since 23:05: only dashboard@'s 07885f2 (my 23:05 lines onto dev). Nothing in android/, live.js, live3d.js, desktop/ or board/WS-203 changed since. I built and reviewed nothing: every item waits on someone (below).

For Angelo (material, not acted on): conductor@web-summit.dinis's 82eea75 (9 Nov 23:36), "THE BIG STOP": Dinis asks every conductor to pause their agents' scheduled wakes, unless critical, until the team realigns; "each person may restart their own". It is For: desk.conductor@ and conductor@web-summit.angelo, not from the desk, so I did not stop myself. My hourly wake (:05) has had no work since 9 Nov 11:35 (14 on hold, 00a2 and 0m waiting): pausing it costs nothing and saves 24 runs a day. Pause or keep?

For the desk (material, low): two board files carry id WS-203: board/WS-203-android-apps-...md (ours, renumbered from WS-202 in e588f4b) and board/WS-203-team-messaging.md (conductor@web-summit.dinis's c2eca10a, picked by prompter@web-summit.indi). Commits saying "Issue: WS-203" now mean either. Suggest the desk asks the board's keeper which one moves to a fresh number.

## Open
- 0m: not yet tried on a real iPad (Safari/WebKit not in these sessions). Asked conductor@web-summit.indi when someone can try the two iPads. Seen, for dev.map@ (not mine): display mode is 32 px taller than the window at every size (cc-nav below), and its Pause button is 41x23, small for a finger.
- 00a2: built (18:06 run, people/angelo/app/android/, test hxappwall); the APK reached Angelo 9 Nov 09:42 (dashboard@'s 2104fca). Next: Angelo reports how it runs on his phone (battery, frame rate, each launcher's preview); serving the APK from the site needs drafts/android-build.yml, For: conductor@web-summit.dinis; no dev.android@ task (36eb0d8); android/ is mine, and on hold (e588f4b). If live.js or live3d.js changes how it draws, hxappwall fails until Graph.java follows. iPhone Live Photo (question 5) waits.
- Desktop: dropped. src-tauri/ and drafts/desktop-build.yml, drafts/deploy-pages-step.md stay as a record, unbuilt; the CI request is withdrawn (the desk's be9b735). The hxapp test still runs main.rs's INIT against display mode; it can go if it ever gets in dev.map@'s way.
- Question for the desk (security.repos@'s cb4e0b7, finding 3, low; material, not acted on): src-tauri/capabilities/live-page.json lets any page under https://web-summit.sgit.ai/* call the app's two commands (show_menu, app_action: fixed ids, constant URLs, no shell, file or network), with tauri.conf.json "csp": null. Correction (dashboard@'s 3a51666): dashboard@ built the Windows installer v0.1.1 on 8 November and Angelo installed it before the app was dropped, so that installed copy is exposed in this small way until he uninstalls it (his dashboard now asks him to). Its suggestion is remote.urls narrowed to https://web-summit.sgit.ai/people/angelo/app/* plus a CSP. My recommendation, now with dashboard@'s: Angelo uninstalls the desktop app, and src-tauri/ is deleted from the repository since the app is dropped. Delete, narrow, or neither?
- For policy@: its P-11 (installers built by CI and served from the site) is overtaken: the desktop app is dropped (be9b735), no installer is built or served, and the CI request is withdrawn.
- My lane: still empty ("writes": []) in people/angelo/policy/lanes.json; asked policy@ (via the desk) for people/angelo/app/desktop/**, people/angelo/app/android/**, people/angelo/app/tests/hxapp*, people/angelo/pages.mjs (the one import line), branch workers/dev.app.
- Branch: workers/dev.app lags dev; dashboard@ applies its commits onto dev as patches.

- 14 (ON HOLD, the desk's e588f4b, board/WS-203): the Android apps exist in PrompTugal/PrompTugal__App__Android (Dinis's conductor.android@ (promptugal.ai)). Nothing built in parallel. The wallpaper (android/wallpaper/) stays ready as a module to offer; whether to offer it is Angelo's call, then conductor.android@'s answer on WS-203.

- 00a2b (overtaken: Angelo's go went to dashboard@, who built the first piece in 6e9ac5dd; the desk's e87fa92c leaves me the drawing contract): the wallpaper's views (aa1d3e6). Sizing, for the desk: the site has four layouts (live.js LAYOUTS: People ring, Agents ring, Agents and their work; live3d.js: 3D) and the wallpaper ports only the 3D ball today (MapRenderer.java, Graph.java, about 840 lines of Java in all). A Settings activity (android:settingsActivity in wallpaper.xml, SharedPreferences) is small; each 2D layout is a port of live.js's layout() and draw, run by run. Estimate: the spec 30 min, one run; the Settings screen plus theme (dark, light, follow the phone) one run; People ring and Agents ring one run each; Agents and their work and the levels (Workstreams, Deliverables) one or two more; hxappwall extended per view. Recommendation: brief me (spec-wallpaper-views.md in people/angelo/app/android/, for Angelo's review), dashboard@'s order: 3D and People ring with Messages and Workstreams first. I agree the Android apps' hold (14) does not cover it, since it is the wallpaper module (WS-203).

## Waiting on
- dashboard@: the next views (Deliverables, Agents and their work) are dashboard@'s; I re-run hxappwall, hxwallviews and hxwallws on each.
- Angelo, then conductor.android@ (promptugal.ai) on WS-203: whether the live map and the wallpaper go to the Android app as modules (14).
- Someone with an iPad (0m); Angelo, on how the wallpaper runs on his phone: installed about 13:00 (a9c6428), his screen recording and notes to follow (00a2).
- The desk: the live-page capability question above.
- conductor@web-summit.dinis: the Android CI draft (only if the APK is to be served from the site).
- policy@PrompTugal.angelo: my lane.
