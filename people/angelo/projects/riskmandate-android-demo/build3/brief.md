# Step 7: build 3, Angelo's remaining findings (riskmandate-android-demo-build3)

**Role:** build (large). **Skills:** software-engineer, security. **Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo's go stands** (11 Nov about 21:30 UTC: "You're authorized to write there and publish the changes as soon as they're ready.").

**Angelo's findings on 0.1.165, on his device, 11 Nov about 23:00 to 23:05 UTC, quoted:**
- "The menu sandwich on the top left corner doesn't work, some pages like x-ray and gravity have a white band at the bottom, also the swarm page seems to be completely white except for the header, also it's in Portuguese but I can't see the button to switch to english."
- "There's also a quite evident lag in processing the graphical elements of the dashboard, not sure if that can't be helped or there is a fix?"

**What build 2 already fixed** (build2/build.md on origin/pool/riskmandate-android-demo-build2; Android branch `angelo/riskmandate-xray-browser`, head 5badada): Swarm and Universo empty (hosts were refused); the page's own full-screen button; links out; file inputs; full screen in and out (edge tab, Reload / Full screen bar); the hidden corner removed; no per-request host check; no alpha layer over the WebView when the tab is hidden.

## Still open: build on top of `angelo/riskmandate-xray-browser` (5badada)
1. **The hamburger menu, top left:** build 2's headless run saw the drawer open in Chromium. Find why it fails in Android WebView: e.g. a tap target under the status-bar/cut-out area in immersive mode, a CSS `:hover`/pointer media query, `position: fixed` with the WebView's viewport, our edge tab or window overlapping it, or touch events. Reproduce with Chromium's touch emulation (hasTouch, isMobile) at tablet and phone sizes.
2. **The white band at the bottom of X-ray and Gravity:** most likely the WebView not filling the immersive window, or `100vh`/`100dvh`/`innerHeight` not updated after the bars hide (insets, `fitsSystemWindows`, layout params, display cutout mode, Compose `AndroidView` sizing, the IME/navigation insets). Fix ours so the page always gets the whole window; reproduce the page's layout with a resized viewport in Chromium to see which CSS unit it uses.
3. **Portuguese, no English switch:** find how the page picks its language (navigator.language, Accept-Language, a stored setting, a button inside the hamburger). If it follows the device or an Accept-Language header the WebView sends, say so; if the switch is in the hamburger, (1) fixes it. A missing switch in the page itself is a question for the lead (Silvio's page is never edited by us). Do not force a language in the app without saying why in build.md.
4. **Lag:** check every part of our rendering path (hardware acceleration on the window and WebView, `setRendererPriorityPolicy(RENDERER_PRIORITY_IMPORTANT)`, `setOffscreenPreRaster`, no Compose layer with alpha or graphicsLayer over the WebView, no per-frame work of ours) and fix what is ours. Measure the page's own load (a Chromium performance trace at tablet size: frame times, canvas/three.js/SVG work) and say what is the page's own weight (a note for Silvio, through the lead). Say what only a device can tell (Angelo can compare in Chrome on the same device).

## Where you write
- Android repo: add_repo access push; branch `angelo/riskmandate-xray-browser2` from `origin/angelo/riskmandate-xray-browser` (5badada). Commit shape as before (subject `riskmandate-android-demo.build@PrompTugal.angelo: <what>`, Angelo's words in the body, trailers Agent/Issue: WS-203/For: conductor.android@promptugal.ai.dinis, security.android@promptugal.ai.dinis). Never dev or main. If your push is refused, a format-patch series in build3/ that applies on 5badada.
- This repo: only build3/build.md, build3/STATE.md, screenshots in build3/ (plus estimates and ledger lines), on pool/riskmandate-android-demo-build3.

## Done when
Each of the four has a row in build3/build.md: cause, fix (or why it is the page's), before and after; the gate `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease` passes; how to undo it; what needs a real device.
