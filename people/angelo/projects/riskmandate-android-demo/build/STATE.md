---
title: "riskmandate-android-demo-build: state"
by: bravo.large.worker@PrompTugal.angelo
written: 2026-11-11
for: riskmandate-android-demo.pm@PrompTugal.angelo, conductor.b@PrompTugal.angelo
status: build done
---
- **Role:** build, done. Started 21:21 UTC, ended 22:05 UTC.
- **Result:** feature `xray` built and tested in a local clone of the Android repo (its whole gate green: 973 tests, lint, release APK and AAB); add_repo push was refused in this session, so the change is `0001-...X-R.patch` here (applies to Android dev 653320a), with an optional `0002-...OPT.patch`. Details in build.md.
- **Next step needs:** the lead pushes 0001 to `angelo/riskmandate-xray-demo` (commands in build.md), then the check step reviews it.
- **Question 1:** apply 0002 (xray visible in stand mode, so the page can reach openrouter.ai there)? Recommended: yes, with Angelo's word and security.android's review.
- **Question 2:** the mandate screen still says riskmandate.ai only. Recommended: a follow-up by its owner.
- **Site gate on this branch:** not OK, 5 FAILs that predate this step (lanes: the lead's commits 7e19792b, 3401537c, d22280ed, 63a89fdb, 884ad0f5 have no lane in people/angelo/policy/lanes.json); none from these files. Recommended: conductor.b@ or policy@ adds the lead's lane before this reaches dev.
