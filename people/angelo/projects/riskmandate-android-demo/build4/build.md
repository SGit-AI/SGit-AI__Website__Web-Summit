---
title: "Build 4: the lag patch, check 2's three fixes, the gate run"
by: alpha.large.worker@PrompTugal.angelo (role build), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-11
for: the check step, then conductor.b@PrompTugal.angelo
status: built and gated locally; delivered as patches (push to the Android repository refused)
---

**In one line:** build 3's lag patch plus check 2's findings 1 to 3, each with tests, on Android dev 5badada; the full gate passes here (984 tests, 0 failures, lint 0 errors, release APK and AAB).

## Where the change is

- Attaching PrompTugal/PrompTugal__App__Android with push access was refused in this session (the auto-mode check, "access added as a means"), as for builds 1 to 3. So nothing was pushed there, and the branch `angelo/riskmandate-xray-fixes` does not exist yet.
- Built and tested in a local clone. Two patches in this folder, applying on `5badada` in order:
  - `0001-...X-R.patch` (sha256 starts `9109101b8ce7a168`): build 3's patch, unchanged (`git am` of build 3's file gives the same commit content).
  - `0002-...X-R.patch` (sha256 starts `769743a98668e909`): this build.
- Checked: `git am` of both on a fresh clone at `5badada` gives tree `00e8e89c`, the tree the gate ran on.

```
git clone https://github.com/PrompTugal/PrompTugal__App__Android && cd PrompTugal__App__Android
git checkout -b angelo/riskmandate-xray-fixes 5badada
git am <path>/build4/0001-*.patch <path>/build4/0002-*.patch
./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease
git push -u origin angelo/riskmandate-xray-fixes
```

## What changed (Android, patch 0002)

| Finding | Before (5badada + build 3) | Change | Test |
|---|---|---|---|
| Check 2, 1: downloads open outside without a tap | The listener asked `navigation(url, hasGesture = true)`: any https download, even from a script or a frame, opened the browser | `XrayPolicy.downloadOpensOutside(url, lastTouchAt, now)`: a tapped link's rule, and only within 2 s (`DOWNLOAD_TAP_WINDOW_MS`) of a finger touching the WebView. `WebView.watchTouches` records the touch and never consumes it | `XrayPolicyTest.aDownloadOpensOutsideOnlyJustAfterATouch` (never touched, too late, clock gone back, bad schemes, the site's own page); `XrayScreenTest.theWebViewReportsEachTouchOnce` (down, move, up counts one) |
| Check 2, 2: Back in the page's full screen leaves everything | Back called `toggle()`: `XrayView().pageEntered().toggled()` is the window (the old test `leavingFullScreenEndsThePagesFullScreenToo` shows it) | `XrayView.back()`: in the page's full screen, `pageExited()` (the app's full screen stays, or the window if the page brought us from there); else as before. The screen's `back()` then ends the page's full screen in WebView. WebView's own `onHideCustomView` after it changes nothing (`pageExited` twice gives the same) | `XrayViewTest.backDuringThePagesFullScreenEndsOnlyThat`, `backInTheAppsFullScreenLeavesItAndInTheWindowDoesNothingHere` |
| Check 2, 3: `<input multiple>` gets one file | `params.createIntent()` alone | `fileChooserIntent(params)` adds `EXTRA_ALLOW_MULTIPLE` for `MODE_OPEN_MULTIPLE` | `XrayScreenTest.aMultipleFileInputAsksThePickerForSeveralFiles` (multiple: extra set; single: absent) |
| Build 3's test | `theSettingsKeepThePageStateAndStayLockedDown` failed: Robolectric's WebSettings keeps no `offscreenPreRaster` (reproduced: "rastered ahead, less lag"), and its WebView keeps no renderer priority (with that line out: "expected 2 but was 0") | Pre-raster assertion dropped, the setting kept (device check). The priority is tested by a WebView subclass that records `setRendererPriorityPolicy` | `XrayScreenTest.theRendererKeepsTheAppsPriority` |

Files: `XrayPolicy.kt`, `XrayScreen.kt`, `XrayWebView.kt`, and `XrayPolicyTest.kt`, `XrayViewTest.kt`, `XrayScreenTest.kt`. Finding 4 (rotation) is not in this build, as the brief says.

## How it was tested

JDK 21, Android SDK platform 35 and build-tools 35.0.0 from dl.google.com, Gradle 8.11.1 from the wrapper. Maven Central answered 429 (too many requests) on the first runs; retried, nothing else changed.

```
# build 3's patch alone on 5badada
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.xray.*'
23 tests completed, 1 failed (theSettingsKeepThePageStateAndStayLockedDown: "rastered ahead, less lag")
# both patches
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.xray.*'
XrayPolicyTest 6, XrayScreenTest 10, XrayScreenshotTest 1, XrayViewTest 6, XrayWatchdogTest 6: 0 failures
./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease     (23:54 to 23:57 UTC)
BUILD SUCCESSFUL in 3m 30s; 984 tests, 0 failures, 0 errors; lint 0 errors, 39 warnings, none in features/xray;
app-release-unsigned.apk (CI signs) and app-release.aab built
```

## Needs a real device

- A download link the visitor taps opens the browser (unpinned); one the page starts by itself does not.
- Back in the page's own full screen: the page leaves its full screen, the app stays full screen.
- The pre-raster setting and the lag, as build3/build.md says.

## How to undo

Revert patch 0002's commit (and 0001's for the lag settings) on `angelo/riskmandate-xray-fixes`. Nothing to migrate.
