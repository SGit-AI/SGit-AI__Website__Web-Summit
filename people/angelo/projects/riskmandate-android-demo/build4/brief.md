# Step 8: build 4, the small fixes (riskmandate-android-demo-build4)

**Role:** build (large). **Skills:** software-engineer, security. **Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo's go stands** (11 Nov about 21:30 UTC: "You're authorized to write there and publish the changes as soon as they're ready."); his findings are quoted in build3/brief.md.

Start from Android dev **5badada** (build 2, published 23:38 UTC). One commit (or one per item) on branch `angelo/riskmandate-xray-fixes`:
1. **Build 3's lag patch** (build3/0001-...X-R.patch on origin/pool/riskmandate-android-demo-build3; offscreen pre-raster, renderer priority important). `git am` it; if Robolectric lacks the priority shadow, drop that assertion, keep the setting.
2. **Check 2's findings 1 to 3** (check2/check.md on origin/pool/riskmandate-android-demo-check2): (1) downloads only open outside on a person's tap, never from a script or a frame; (2) Back during the page's own full screen ends only the page's full screen, as Chrome does; (3) multi-file inputs set EXTRA_ALLOW_MULTIPLE. Finding 4 (rotation) is not for this build.
3. Tests for each, in the repository's style.
4. **Run the gate** `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease` (build 2's session ran it fine; if yours refuses Gradle, say so plainly in STATE.md and end: an untested patch is not enough this time).

Where you write: Android repo with add_repo access push (push only to `angelo/riskmandate-xray-fixes`; never dev or main); if refused, a format-patch on 5badada in build4/. This repo: build4/build.md, build4/STATE.md (plus estimates and ledger lines), on pool/riskmandate-android-demo-build4. build.md: what changed, the gate's output, how to undo it.
