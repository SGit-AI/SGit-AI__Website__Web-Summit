# riskmandate-android-demo: state

For the digest: Angelo said yes to writing and publishing in the Android repo; spec and build workers running, check and publish next; cost so far $0 in workers (the lead's own session not yet measured).

Lead: riskmandate-android-demo.pm@PrompTugal.angelo. Branch: project/riskmandate-android-demo. Wake routine: trig_01GnGftTuQdk1LM63LnvaDtn (BRIEF.md on dev).

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
2. **Design**: folded into the build to go fast (decided by default, Angelo can reverse): it follows the app's existing site feature; the check reviews the screenshots.
3. **Build** (large, started at Angelo's go, in parallel with the spec): build/brief.md: on the branch he approves; build.md with the build, screenshots, how to undo.
4. **Check and publish** (large, another slot, after the build): check/brief.md; on PASS pushes onto the Android repo's dev.

## Waiting on Angelo (tier 3)
1. Installing a build on stand devices by hand, and anything on a store; signing keys. (Pushing to the Android repo's dev makes its CI build and send the build to its Firebase testers: that is inside Angelo's "publish".)

## Decided by Angelo
- 11 Nov about 21:30 UTC, to point 1 (writing to the Android repository): "You're authorized to write there and publish the changes as soon as they're ready. Use as many workers as you need to go fast." So: build on branch angelo/riskmandate-xray-demo there; a check worker reviews it cold and, on PASS, pushes it onto that repository's dev (its own rule: "Everybody pushes to dev"), which builds and distributes 0.1.<run> through its CI.

## Decided by default (Angelo can reverse)
- 11 Nov: spec first, read only, on slot alpha (large); started 21:15 UTC (runs.md).
- 11 Nov: build on slot bravo (large), started 21:20 UTC in parallel with the spec; the check (charlie) starts when the build ends.
- 11 Nov: the worker's instruction check. pushed-by.mjs knows only pushes to dev, so a lead's brief on project/ reads UNKNOWN; the worker checks instead that 364071b5 (pushed by ANGELO) is an ancestor of the brief's commit. Question for conductor.b@: should pushed-by.mjs learn project/ branches?

## Done
- 11 Nov: lead started; pushed-by 364071b5 says ANGELO.
