PASS

---
title: "Check 3: build 4 (lag patch and check 2's findings 1 to 3), reviewed cold"
by: charlie.large.worker@PrompTugal.angelo (role check; build 4 was alpha), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-12
reviewed: PrompTugal/PrompTugal__App__Android, branch angelo/riskmandate-xray-fixes, head 22dafce (15dfd73, 22dafce on dev 5badada), tree 00e8e89c (equal to build 4's gated tree), 6 files, +144 -6
status: check done
---

**In one line:** check 2's findings 1 to 3 are fixed, each with a real test; the lag settings are in; nothing new is opened. Publish. Four notes below, none blocking.

## The gate

Not run here. The Android SDK (platform 35, build-tools 35.0.0) installed, but this session's permission check refused running Gradle on the cloned code. So the result is build 4's own on the same tree 00e8e89c: 984 tests, 0 failures, lint 0 errors (none in features/xray), release APK and AAB. CI runs the gate again on the push.

## Check 2's findings

1. **Downloads only on a tap: fixed.** `XrayPolicy.downloadOpensOutside` asks `navigation(url, hasGesture)` with a tap only if the WebView was touched in the last 2 s (`now - lastTouch in 0..2000`, so a clock gone back counts as no touch). `watchTouches` records ACTION_DOWN and returns false, so the page and WebView's own click handling still get the touch. The bad schemes and the site's own page stay refused even just after a touch (tested).
2. **Back in the page's full screen ends only that: fixed.** `XrayView.back()` calls `pageExited()`: the app's full screen stays, or the window comes back if the page brought us from there (`byPage`). The screen then calls `onCustomViewHidden`; WebView's later `onHideCustomView` runs `pageExited()` again, which changes nothing (tested).
3. **Multi-file inputs: fixed.** `fileChooserIntent` adds `EXTRA_ALLOW_MULTIPLE` for `MODE_OPEN_MULTIPLE` only (tested both ways).
- **Lag patch (15dfd73):** `offscreenPreRaster = true` (API 23) and `setRendererPriorityPolicy(IMPORTANT, false)` (API 26); minSdk is 26, so both are safe. The priority is tested by recording the call; pre-raster needs the device, as build4/build.md says.

## Notes, most serious first

1. **"A touch" is any touch, not a tap on that link.** A script or frame that starts an https download within 2 s of any touch (a scroll counts) still opens the browser. Much narrower than before, and refused while the stand is pinned. Accept for the demo; a tighter rule would tie the download to the tapped link's URL.
2. **The wiring has no test.** The pure parts are tested (`downloadOpensOutside`, `watchTouches`, `XrayView.back`, `fileChooserIntent`), but not the screen's listener calling them or the Dialog's Back calling `back()`. A device check covers it (build4/build.md's list).
3. **In the page's own full screen, touches go to the page's view, not the WebView.** A download tapped there will not open outside. This fails closed; check it on the device if the page offers downloads in its full screen.
4. **Stale comment:** `XrayView.toggled()` still says "(or Back while full screen)"; Back now uses `back()`. Cosmetic.
- Check 2's finding 4 (rotation) is still open, by build 4's brief.

## What still holds

No JavaScript bridge; file and content access off; mixed content never; third-party cookies off; one window; top-level pages only from https://web-summit.sgit.ai. The diff touches none of these. No secret or contact detail in the diff.
