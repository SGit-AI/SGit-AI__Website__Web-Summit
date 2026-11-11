# riskmandate-android-demo: state

For the digest: build 2 (full embedded browser, full-screen toggle) published onto the Android repo's dev 5badada at 23:38 UTC (becomes 0.1.166); the menu, white band and missing English switch are in Silvio's page (a note for him waits on Angelo); a small lag patch and check 2's fixes next; cost so far $20.58 in workers (the lead's own session not yet measured).

Lead: riskmandate-android-demo.pm@PrompTugal.angelo. Branch: project/riskmandate-android-demo. Wake routine: trig_01GnGftTuQdk1LM63LnvaDtn (BRIEF.md on dev).

## Goal (BRIEF.md)
One menu entry in the RiskMandate Android app that opens Silvio's X-ray page (https://web-summit.sgit.ai/people/silvio/app/index.html#xray) full screen, kept awake, recovering from lost connection, with a staff exit; screenshots and build steps in build.md; Angelo looks before it reaches a stand device.

## What the app has today (from the board; not yet read at source)
- PrompTugal/PrompTugal__App__Android exists, run by conductor.android@promptugal.ai for Dinis; dev builds like 0.1.78; first on-device chat (Gemma 4) on the team's tablet (board WS-203, 9 Nov).
- WS-203's row "The RiskMandate app (demos, videos)" is open: nobody has claimed it. Whether the repository has a RiskMandate module yet is unknown.
- Angelo, 11 Nov: "Clone the repository PrompTugal/PrompTugal__App__Android into this session." Done: it is public, cloned read only (shallow, dev at 653320a) at /home/user/promptugal/promptugal__app__android; no push access. The spec worker reads it in its own session too.
- Angelo, 11 Nov about 21:25 UTC: "You should be able to push in that repo." The repository is now attached to the lead's session with push access (clone at /home/user/promptugal__app__android; a dry-run push of a branch was accepted). The lead still builds nothing there itself: workers do, and the lead can push a fallback patch if a worker's push is refused.

## Options for the entry (the spec weighs them; lead's working view)
- (a) A WebView screen in kiosk style: immersive full screen, keep screen on, reload on lost connection and a stall watchdog, locked to the page's origin, a hidden staff exit (corner long press plus PIN). **Lead's lean.**
- (b) (a) plus screen pinning (startLockTask, one confirm per device, no provisioning): stops visitors leaving the app.
- (c) Full lock task as device owner: strongest, needs each device provisioned; likely too heavy for the stand.
- (d) A link to Chrome or a Custom Tab: lightest, no keep-awake or recovery.

## What a cloud session can and cannot check
- Can: a Gradle build with the Android SDK (if the network allows its downloads), unit and Robolectric tests, the page in headless Chromium at tablet and phone sizes; an emulator only if /dev/kvm exists.
- Needs a real device: the immersive and pinning behaviour, keep-awake over hours, Wi-Fi drops at the venue. Installing on a stand device is tier 3.

## Steps
1. **Spec** (large, read only; may start now): spec/brief.md. Ends "ready for Angelo's read".
2. **Design**: folded into the build to go fast (decided by default, Angelo can reverse): it follows the app's existing site feature; the check reviews the screenshots.
3. **Build** (large, started at Angelo's go, in parallel with the spec): build/brief.md: on the branch he approves; build.md with the build, screenshots, how to undo.
4. **Check and publish** (large, another slot, after the build): check/brief.md; on PASS pushes onto the Android repo's dev.

## Spec result (pool/riskmandate-android-demo-spec 1446287)
- Recommends a new `xray` feature inside the app's existing stand mode (features/stand: pinning, keep-on, staff corner long press), its own WebView with storage kept for the demo key; about 400 lines plus four host-file edits (Features.kt, MainActivity's STAND_VISITOR_FEATURES), which the Android repo's rules give to its host owner: covered by Angelo's go, said in the commit For: conductor.android@.
- iOS did the same tonight (iOS 16fd6dc: the X-Ray is its start screen).
- Open for the check: the page calls openrouter.ai and may ask for the microphone; phone-size overlaps on Silvio's page (his to fix, a note For: him via Angelo).

## Build result (pool/riskmandate-android-demo-build 3623d05)
- Feature `xray` in the Android repo: own full-screen window, immersive, keep-on, locked to web-summit.sgit.ai (plus the page's fetch hosts), reload watchdog and offline cover, 3-second hidden corner exit, own WebView profile keeping the demo key. Gate green locally (973 tests, lint, release APK and AAB). Not testable in the cloud: a real device (no /dev/kvm).
- 22:15 UTC: the lead applied patch 0001 (sha256 6a01811d9938, as build.md) on Android dev 653320a and pushed branch angelo/riskmandate-xray-demo at 683f9f7 (tree 190ce8df), under Angelo's go.
- Patch 0002 (xray allowed in stand mode, so stand mode's screen pinning holds visitors in it) is NOT applied: it lets the page reach openrouter.ai in stand mode, which the app's own rule keeps off. Point for Angelo.

## Published
- Angelo, 11 Nov about 22:23 UTC: "push it". The lead pushed 683f9f7 onto PrompTugal/PrompTugal__App__Android dev (fast-forward from 653320a). CI: android run 165 (id 43111403958), queued 22:23 UTC; versionName 0.1.165 if it releases. Next wake: record its result; then Angelo looks on a device (installing on stand devices is still his word).
- Run 165 result (22:44 UTC): success. Tests and lint, secret scan, licences, security-gate, release (signed APK and AAB, 0.1.165), Firebase App Distribution to group "team" (22:39 UTC), GitHub release, emulator smoke test: all passed.
- Its promote-dispatch started promote.yml run 57 on main: failure (22:34 UTC), expected: main moves only on security.android's signed PASS for the exact dev head (its last PASS is for 30c806b). So Play and the managed tablets do not have it. Getting it there means security.android reviewing 683f9f7: a request to Dinis's agents, tier 3, Angelo's word.

## Angelo's look at 0.1.165 (11 Nov about 22:55 UTC)
"Ok the app has been deployed and I can see the X-ray menu item, and if I click it I can see the dashboard go automatically in full screen. But there are a few things that don't work quite well, especially the buttons don't seem to work properly. I think you should run it as an embedded app in a browser, if it's not already like that. We want to keep the features and to also be able to go back and forth from full-screen."
- Angelo's findings, about 23:00 UTC: "The menu sandwich on the top left corner doesn't work, some pages like x-ray and gravity have a white band at the bottom, also the swarm page seems to be completely white except for the header, also it's in Portuguese but I can't see the button to switch to english." Sent to the build 2 worker as four rows to reproduce and fix (send_message, 23:0x UTC).
- Angelo, about 23:05 UTC: "There's also a quite evident lag in processing the graphical elements of the dashboard, not sure if that can't be helped or there is a fix?" Passed to build 2 as a fifth row (rendering path in our screen vs the page's own weight).
- Lead's reading: it is already an embedded Chromium (WebView), but locked down too hard (host filter on sub-resources, popups and permissions denied, an invisible corner). Build 2 (build2/brief.md): reproduce which buttons break, lift the lock-down to what the page needs, add a visible full-screen toggle. Decided by default (Angelo can reverse): WebView made into a full browser, not a Trusted Web Activity (TWA loses keep-on, the watchdog and the toggle control); TWA described as the fallback.

## Build 2 result (pool/riskmandate-android-demo-build2 38720b7)
- Reproduced: Universo and Swarm empty (api.github.com and swarm.promptugal.news refused by build 1's host list), the page's own full-screen button dead (no onShowCustomView), links out dropped, file inputs refused, the hidden corner on the page's Home button at phone size. All fixed; gate green (978 tests). Lead pushed the patch (sha256 05231d14) as Android branch angelo/riskmandate-xray-browser 5badada (tree a8aa9b5, as tested), 23:2x UTC.
- Not fixed in build 2 (it kept to its brief commit): the hamburger in WebView, the white band, the language, the lag. Build 3 takes them, on top of 5badada.
- Not possible in WebView: the page's voice input (Web Speech), the brain's blob export, clipboard read. A Trusted Web Activity would give them but loses the watchdog, keep-on control and the separate profile.
- Decided by default (Angelo can reverse): check 2 and build 3 run in parallel; build 2 is published on check 2's PASS, build 3 follows as 0.1.167 or so.

## Check 2 and build 3 (23:24 to 23:37 UTC)
- Check 2: PASS for build 2. Findings: (1) downloads open the browser without a tap (XrayScreen.kt:185); (2) Back during the page's own full screen also leaves the app's full screen; (3) multi-file inputs get one file; (4) rotation reloads the page (since build 1; lock the stand's orientation); (5) any script the page loads can read the demo key, as in Chrome (accepted).
- Lead pushed 5badada onto the Android repo's dev (fast-forward from 683f9f7), 23:38 UTC, under Angelo's go ("publish the changes as soon as they're ready"; "push it" for build 1).
- Build 3 diagnosis (Chromium with touch, phone and tablet sizes): the menu (a class clash in the page's app.css, and the drawer hidden under 768 px), the white band (html's off-white background below a shorter body) and no English switch on X-Ray (xray.js hides the switch, mounts Gravity with lang 'pt') are all in Silvio's page, the same in Chrome. Lag: mostly the page's weight (X-Ray about 10,000 animated SVG nodes, Universo about 3 fps in software rendering); a small app patch (offscreen pre-raster, renderer priority important), not compiled.
- Build 4 started 23:39 UTC (session_01Xp7gj3csz3fGiXp7igQama). Android CI run 166 (5badada) in progress since 23:37 UTC.
- Next (decided by default): build 4 applies build 3's patch plus check 2's findings 1 to 3 and runs the gate; then a check; then publish.

## Check result (pool/riskmandate-android-demo-check)
- PASS (code review): same tree as the gated build; WebView locked down (no JS bridge, no file access, permissions denied, https only). Findings for later: retry may cut off a slow (>10 s) load; WebSockets and service workers not filtered; Features.kt is conductor.android@'s file (named in For:).

## Questions for conductor.b@
- The gate on dev refuses the lead's commits: "riskmandate-android-demo.pm@: no lane in people/angelo/policy/lanes.json". Please add this lead's lane (people/angelo/projects/riskmandate-android-demo/**) before the branch comes onto dev.
- pushed-by.mjs knows only dev (see Decided by default).

## Waiting on Angelo (tier 3)
- A note for Silvio (his agents dashboard@web-summit.silvio and conductor@web-summit.silvio) with the three page fixes from build3/build.md: the menu's class clash, a dark background on html, the PT/EN switch on X-Ray. Contacting another person's agents is tier 3.
0. Patch 0002 (Angelo, 11 Nov about 22:20 UTC: "Leave it for now"): allow the X-ray screen in stand mode (pinning keeps visitors in it; the page then reaches openrouter.ai while stand mode is on, against the app's own stand rule). Lead's recommendation: yes, it is what the stand needs; security.android reviews it on the Android side.
1. Installing a build on stand devices by hand, and anything on a store; signing keys. (Pushing to the Android repo's dev makes its CI build and send the build to its Firebase testers: that is inside Angelo's "publish".)

## Decided by Angelo
- 11 Nov about 21:30 UTC, to point 1 (writing to the Android repository): "You're authorized to write there and publish the changes as soon as they're ready. Use as many workers as you need to go fast." So: build on branch angelo/riskmandate-xray-demo there; a check worker reviews it cold and, on PASS, pushes it onto that repository's dev (its own rule: "Everybody pushes to dev"), which builds and distributes 0.1.<run> through its CI.

## Decided by default (Angelo can reverse)
- 11 Nov: spec first, read only, on slot alpha (large); started 21:15 UTC (runs.md).
- 11 Nov: the check (charlie, large) started at 22:14 UTC (session_01Xp7gj4dqK2qoiNTZykBbFJ); publishes onto the Android repo's dev on PASS.
- 11 Nov: build on slot bravo (large), started 21:20 UTC in parallel with the spec; the check (charlie) starts when the build ends.
- 11 Nov: the worker's instruction check. pushed-by.mjs knows only pushes to dev, so a lead's brief on project/ reads UNKNOWN; the worker checks instead that 364071b5 (pushed by ANGELO) is an ancestor of the brief's commit. Question for conductor.b@: should pushed-by.mjs learn project/ branches?

## Done
- 11 Nov: lead started; pushed-by 364071b5 says ANGELO.
