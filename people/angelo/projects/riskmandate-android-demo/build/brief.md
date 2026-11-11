# Step 3: build (riskmandate-android-demo-build)

**Role:** build (large). **Skills:** software-engineer, security. **Format:** web-summit-site (files here); the Android repository's own rules there.
**Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo's go (tier 3), in the lead's session, 11 Nov 2026 about 21:30 UTC:** "You're authorized to write there and publish the changes as soon as they're ready. Use as many workers as you need to go fast." ("there" = PrompTugal/PrompTugal__App__Android.)

## What to build
In PrompTugal/PrompTugal__App__Android (the RiskMandate app, package ai.riskmandate.app), one new drawer entry, e.g. "X-ray demo", that opens https://web-summit.sgit.ai/people/silvio/app/index.html#xray as a stand kiosk:
- full screen, immersive sticky (system bars hidden, come back hidden), no app chrome; screen kept on (FLAG_KEEP_SCREEN_ON) while the screen is shown;
- navigation locked to https://web-summit.sgit.ai (other links ignored or opened nowhere); back button does not leave;
- recovers by itself: reload when connectivity returns, a watchdog reload on a load error or a stall, a calm offline overlay meanwhile;
- a hidden staff exit (e.g. a 3-second long press in a corner, then a confirm) back to the normal app; optionally a staff toggle for Android screen pinning (startLockTask, no device owner);
- follow the existing site feature (app/src/main/java/ai/riskmandate/app/features/site/: SiteWebView.kt, SitePolicy.kt, SiteFeature.kt) and the drawer in Shell.kt; reuse before you make. Add tests in the repository's style (app/src/test/..., Robolectric and screenshot tests as the site feature has).
- Silvio's page is never edited by us. It now asks a new device for a demo key ("X-Ray, open the demo key on a new device with three words", dashboard@web-summit.silvio, e9915f5 on this repository's dev): make sure the WebView keeps that state (DOM storage on, cookies kept) so staff unlock once per device; say so in build.md.

## Where you write
- Android repository: attach it with add_repo, access push (Angelo's go above). Read its CLAUDE.md, README, docs/ci.md first and follow them (commit shape adapted: subject `riskmandate-android-demo.build@PrompTugal.angelo: <what>`, trailers `Agent: bravo.large.worker@PrompTugal.angelo`, `Issue: WS-203`, `For: conductor.android@promptugal.ai.dinis`, body first line quoting Angelo's go). Push only to branch `angelo/riskmandate-xray-demo` (create from its dev). Never dev or main: the check step publishes onto dev. Never touch signing, secrets, workflows, versionCode/versionName, the board's status.json.
- This repository: only `people/angelo/projects/riskmandate-android-demo/build/build.md` and `build/STATE.md` (plus estimates and ledger lines), on pool/riskmandate-android-demo-build.

## Done when
The branch is pushed; the Android repo's gate `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease` passes in your session (or, if the SDK or signing cannot be had in a cloud session, every part that can run passes and build.md says exactly what could not and why; never disable a check); build.md says what changed (files), how it was tested (commands, short output), screenshots (Robolectric/Paparazzi-style or headless) committed in build/ where possible, how to undo (which commits), and the branch head sha.
