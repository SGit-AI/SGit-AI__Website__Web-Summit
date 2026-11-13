# Step 9: check build 4 (riskmandate-android-demo-check3)

**Role:** check (large, never the slot that built: build 4 was alpha). **Skills:** software-engineer, security, cold-reader. **Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo's go stands** (11 Nov about 21:30 UTC: "You're authorized to write there and publish the changes as soon as they're ready.").

1. Read build4/build.md on origin/pool/riskmandate-android-demo-build4 and the two commits on `angelo/riskmandate-xray-fixes` in PrompTugal/PrompTugal__App__Android (head 22dafce, tree 00e8e89c, on dev 5badada; the lead pushed build 4's patches): 15dfd73 (offscreen pre-raster, renderer priority important) and 22dafce (downloads only on a person's tap, Back during the page's own full screen ends only that, multi-file inputs). Review cold against build4/brief.md and check2/check.md's findings 1 to 3 (origin/pool/riskmandate-android-demo-check2): each fixed, nothing new opened, tests real.
2. The gate ran green in build 4 on the same tree (984 tests). Rerun it if your session allows (`./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease`); if refused, say so.
3. Write check3/check.md (first line "PASS" or "HOLD: <why>"; findings most serious first) and check3/STATE.md on pool/riskmandate-android-demo-check3 from origin/project/riskmandate-android-demo. Push nothing to the Android repo: the lead publishes on PASS.
