---
title: "Build 3: Angelo's four findings on 0.1.165"
by: bravo.large.worker@PrompTugal.angelo (role build), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-11
for: the check step, then conductor.b@PrompTugal.angelo
status: diagnosed; one small app change as a patch, the Android gate NOT run here
---

**In one line:** three of Angelo's four findings (the menu, the white band, no English button) are in Silvio's page and happen in plain Chromium too; Swarm empty was 0.1.165's host list, already fixed by build 2; for the lag, the app now rasters the page ahead and gives its renderer an important priority, and the rest is the page's own weight.

## Where the change is

- Attaching PrompTugal/PrompTugal__App__Android with push access was refused in this session, as for builds 1 and 2. Running Gradle on the local clone was also refused (the session's permission check, "code from external"), so **the gate was not run**. The check step must run it.
- The patch: `0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch` in this folder (sha256 starts `22f19e623e77ae21`). Checked: `git am` on `5badada` gives tree `f966d36f`, the same as my commit `56dc3c0`.

```
git clone https://github.com/PrompTugal/PrompTugal__App__Android && cd PrompTugal__App__Android
git checkout -b angelo/riskmandate-xray-browser2 5badada
git am <path>/0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch
./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease
git push -u origin angelo/riskmandate-xray-browser2
```

## The four findings

Reproduced with headless Chromium (Playwright), touch on (`hasTouch`, `isMobile`), an Android WebView user agent, `https://web-summit.sgit.ai/people/silvio/app/index.html`, at 412x915 (phone), 800x1280 and 1280x800 (tablet), 11 Nov 23:26 to 23:40 UTC. Scripts in the session only; the results below.

| Finding | Cause | Fix | Before, after |
|---|---|---|---|
| 1. The menu (top left) does nothing | **The page.** The button toggles a class `cc-drawer` on `<html>`. Under 768 px wide, `assets/cc/app.css` (`@media (max-width: 767px)`) sets `.cc-side { display: none }`, so only the dark scrim appears. Wider, the same class name matches app.css's `.cc-drawer` panel rule, so the whole page turns into a 560 px fixed panel on the right while the menu opens on the left. Same in Chromium; the app's exit tab is half way down the left edge, clear of it | None in the app. For Silvio (through the lead): show `.cc-side` under 768 px when the drawer is open, and rename the `<html>` class (it collides with `.cc-drawer`) | 412: `menu-412.png` (dark, no menu); 1280: `menu-1280.png` (menu shown, page squeezed right). Unchanged by the patch |
| 2. White band at the bottom of X-Ray and Gravity | **The page.** `<html>` has the site's off-white background (rgb 250,249,245); only `<body>` is dark, and the document is 32 px taller than the body (X-Ray: body 880, document 912 at 1280x800; Gravity 860, 892). The off-white shows below the body. Not the WebView's size: the band is there in Chromium at every size | None in the app. For Silvio: a dark background on `html.cc-shell` (or the body at least the document's height) | `white-band-1280.png` (full page, Chromium). Unchanged by the patch |
| 2b. Swarm all white but the header | **0.1.165 (build 1).** Swarm is an iframe to `swarm.promptugal.news`, which build 1's host list refused (an empty 403). In Chromium it loads, dark | Already fixed by build 2 (`5badada`: any host over TLS) | Device check on the next build |
| 3. Portuguese, no English button | **The page.** X-Ray mounts Gravity with `lang: 'pt'` and its own CSS hides Gravity's PT/EN switch (`assets/cc/xray.js` line 181: `.lang { display: none !important }`). Gravity's view has no switch either. Universo shows PT/EN (visible at both sizes). The page ignores the device language and the WebView's Accept-Language | None in the app (forcing a language would mean script injection; not done). A question for the lead: ask Silvio to show the switch on X-Ray | Measured: EN button present but hidden on X-Ray at 412 and 1280; visible on Universo |
| 4. Lag in the graphics | **Mostly the page.** Ours, checked: hardware acceleration on (no opt-out in the manifest), no Compose alpha or graphicsLayer over the WebView (only the 28x64 dp exit tab fades), no per-frame work (a 5 s watchdog tick). The page, 5 s of frames in Chromium at 1280x800 (software rendering, no GPU, so only relative): X-Ray about 31 fps (p95 frame 50 ms) with about 10,000 DOM nodes (animated SVG lines); Universo 3 fps (frames of 300 to 430 ms); Gravity and Swarm 60 fps; six elements with `backdrop-filter: blur` on every view | **App (the patch):** `offscreenPreRaster = true` and `setRendererPriorityPolicy(RENDERER_PRIORITY_IMPORTANT, false)` in `applyXraySettings`, with a test. **For Silvio:** Universo's frame cost and X-Ray's node count are the page's weight | Before and after on a device only (see below) |

## What changed (Android, 2 files)

| File | Change |
|---|---|
| `features/xray/XrayWebView.kt` | `applyXraySettings`: offscreen pre-raster on; renderer priority important, not waived when not visible; comment updated |
| `XrayScreenTest.kt` | `theSettingsKeepThePageStateAndStayLockedDown` also checks both |

## How it was tested

- The four findings: the Chromium runs above (numbers as quoted).
- The patch: `git am` on `5badada` in a fresh clone, tree identical to the commit. **Not compiled or tested here.** One risk for the check step: if Robolectric 4.13's shadow lacks `rendererRequestedPriority`, drop that assertion, not the setting.

## Needs a real device

- The lag before and after the patch; Angelo can compare the same views in Chrome on the same device: if Chrome lags too, it is the page.
- Swarm loads (build 2's host change).
- The menu and the band look as in Chromium (expected: the same, until Silvio's fix).

## How to undo

Revert the patch's commit on `angelo/riskmandate-xray-browser2`. Nothing to migrate.
