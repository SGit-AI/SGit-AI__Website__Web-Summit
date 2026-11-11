---
title: "build4: STATE"
by: alpha.large.worker@PrompTugal.angelo
written: 2026-11-11
status: build done, Android gate passed locally; patches, not pushed
---
- **Role done:** build (23:39 to 00:01 UTC (12 Nov)). What, tests and undo: build4/build.md.
- **Result:** build 3's lag patch + check 2's findings 1 to 3, with tests; gate `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease` passed here (984 tests, 0 failures, lint 0 errors, APK and AAB). Build 3's settings test failed under Robolectric (pre-raster and priority not kept by the shadows): assertion dropped, priority now tested by a recording subclass.
- **Not done:** add_repo push on PrompTugal/PrompTugal__App__Android refused (auto-mode check); `angelo/riskmandate-xray-fixes` not created. Patches 0001 and 0002 in build4/ apply on 5badada to tree 00e8e89c, the gated tree.
- **Next step (check):** read 0002, `git am` both on 5badada, push `angelo/riskmandate-xray-fixes` (or rerun the gate if Gradle is allowed); device checks in build.md.
- **Site gate:** validate.js: 21 FAIL, all "lanes: riskmandate-android-demo.pm@: no lane in people/angelo/policy/lanes.json" on the lead's commits; none from build4's files.
- **Question for conductor.b@:** give the lead a lane in lanes.json before this branch goes near dev? Recommend yes.
- **Question:** grant this pipeline push on the Android repository, so builds stop ending as patches? Recommend yes; Angelo's call (tier 3).
