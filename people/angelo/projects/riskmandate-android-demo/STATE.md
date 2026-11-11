# riskmandate-android-demo: state

For the digest: lead started; plan written, the spec worker starting (read only); waiting on Angelo for writing to the Android app's repository; cost so far $0 in workers (the lead's own session not yet measured).

Lead: riskmandate-android-demo.pm@PrompTugal.angelo. Branch: project/riskmandate-android-demo. Wake routine: not yet in BRIEF.md (conductor.b@ adds it).

## Goal (BRIEF.md)
One menu entry in the RiskMandate Android app that opens Silvio's X-ray page (https://web-summit.sgit.ai/people/silvio/app/index.html#xray) full screen, kept awake, recovering from lost connection, with a staff exit; screenshots and build steps in build.md; Angelo looks before it reaches a stand device.

## What the app has today (from the board; not yet read at source)
- PrompTugal/PrompTugal__App__Android exists, run by conductor.android@promptugal.ai for Dinis; dev builds like 0.1.78; first on-device chat (Gemma 4) on the team's tablet (board WS-203, 9 Nov).
- WS-203's row "The RiskMandate app (demos, videos)" is open: nobody has claimed it. Whether the repository has a RiskMandate module yet is unknown.
- Angelo, 11 Nov: "Clone the repository PrompTugal/PrompTugal__App__Android into this session." Done: it is public, cloned read only (shallow, dev at 653320a) at /home/user/promptugal/promptugal__app__android; no push access. The spec worker reads it in its own session too.

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
2. **Design** (large, after the spec): the menu entry, the staff exit and the offline screen; mocks at phone and tablet size.
3. **Build** (large, after Angelo's yes to writing in the Android repository): on the branch he approves; build.md with the build, screenshots, how to undo.
4. **Check** (large, another slot): reads the build cold; then Angelo looks before any device.

## Waiting on Angelo (tier 3)
1. Writing to PrompTugal/PrompTugal__App__Android: a branch of its own there (recommended) or a pull request, For: conductor.android@promptugal.ai. The build waits; the spec and design do not.
2. Later: installing a build on stand devices; signing (debug-signed vs the app's release key).

## Decided by default (Angelo can reverse)
- 11 Nov: spec first, read only, on slot alpha (large); started 21:15 UTC (runs.md).
- 11 Nov: the worker's instruction check. pushed-by.mjs knows only pushes to dev, so a lead's brief on project/ reads UNKNOWN; the worker checks instead that 364071b5 (pushed by ANGELO) is an ancestor of the brief's commit. Question for conductor.b@: should pushed-by.mjs learn project/ branches?

## Done
- 11 Nov: lead started; pushed-by 364071b5 says ANGELO.
