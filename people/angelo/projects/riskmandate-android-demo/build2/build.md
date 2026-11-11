---
title: "Build 2: the X-Ray screen as a full embedded browser, with full screen in and out"
by: alpha.large.worker@PrompTugal.angelo (role build), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-11
for: the check step, then conductor.b@PrompTugal.angelo
status: built and tested locally; not pushed to the Android repository (push access refused in this session); patch here
---

**In one line:** the `xray` screen now lets the page work as it does in Chrome (any host over TLS, its own full-screen button, file inputs, links that leave the site open in the browser), starts full screen with a small tab to leave it, and has Reload and Full screen above the page when in the app's window. The repository's gate passes locally.

## Where the change is

Attaching PrompTugal/PrompTugal__App__Android with push access was refused in this session (the session's permission check), as for build 1. So, as the brief says, I built in a local clone of the public repository; the patch is `0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch` in this folder (commit `139ebb2` in my clone, sha256 of the patch `05231d14...1178d8`). It applies to Android `dev` at `683f9f7`; `git am` there gives exactly the tested tree (`a8aa9b5`), checked.

```
git clone https://github.com/PrompTugal/PrompTugal__App__Android && cd PrompTugal__App__Android
git checkout -b angelo/riskmandate-xray-browser 683f9f7
git am <path>/0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch
git push -u origin angelo/riskmandate-xray-browser
```

## Step 1: what the buttons did (reproduced before changing anything)

Headless Chromium (Playwright), `https://web-summit.sgit.ai/people/silvio/app/index.html#xray`, an Android WebView user agent, 1280x800 and 412x915, 11 Nov 23:00 to 23:10 UTC. Every visible control (41 at 1280, 39 at 412) clicked on a fresh load, twice: as Chrome, and with build 1's rules simulated (other hosts get a 403, off-site pages refused, popups and permissions refused, `requestFullscreen` refused, Web Speech absent as in WebView). The page's own load used web-summit.sgit.ai, fonts.googleapis.com, fonts.gstatic.com, promptugal.news, cdn.jsdelivr.net, dev.send.sgraph.ai: all on build 1's list, so the X-Ray view itself loaded fine. Most controls only change the page in place and did the same in both runs. The ones that differ, plus what the page's code does in places the click run did not reach (marked "code"):

| Control | In Chrome | Build 1 (0.1.165) | Build 2 |
|---|---|---|---|
| Top bar UNIVERSO | `#stand`, fetches api.github.com | api.github.com refused (403) | loads |
| Top bar SWARM | `#swarm`, fetches swarm.promptugal.news | swarm.promptugal.news refused (403) | loads |
| Ecrã inteiro (page's full-screen button) | `requestFullscreen`, page fills the screen | nothing visible: WebView needs `onShowCustomView`, which build 1 did not have | the app shows the page's full-screen view, system bars hidden; leaving it returns to where it was |
| Drawer: Summit desk (target=_blank, claude.ai) and GitHub | opens a new tab | nothing (off-site page refused) | opens in the browser |
| Ask Claude "open in Claude" (code: `window.open` claude.ai) | new tab | nothing | opens in the browser |
| CHAVE, "Choose the file" (code: file input) | file picker | picker refused, nothing chosen | the system file picker |
| Brain "Import a file" (code: file input) | file picker | refused | the system file picker |
| Brain "Export (a file)" (code: blob download) | saves a file | nothing | still nothing (see "not done") |
| Ask Claude voice button (code: Web Speech) | listens | page says "not in this browser" | same: WebView has no Web Speech |
| Confirm dialogs (code: delete note, empty brain) | confirm | WebView's dialog | WebView's dialog (unchanged) |
| Every other visible control (PESQUISAR, EMPRESAS, COMO FUNCIONA, + / − / ⤢, ▶ X-RAY, CHAVE, MOSTRAR CUSTO, the cards and leads, the 412 px bottom bar) | in-page change | the same | the same |

12 controls at 1280 and 15 at 412 (the animated cards and leads) never held still long enough for an automated click, in either run: that is the page's animation and the tool, not a fault. A person's tap reaches them. The page also logs an SVG path error on every view change; that is in the page (a note for Silvio, through the lead), and harmless.

**So, what Angelo saw:** UNIVERSO and SWARM came up empty, the page's own full-screen button did nothing, and every link out of the page was silently dropped. Also, on a phone, build 1's invisible 56 dp hold-corner sat at the bottom-left, on the page's own Home button (the page has a bottom bar at 412 px: `policy-412.png`).

## What changed (Android repository, 10 files)

| File | Change |
|---|---|
| `features/xray/XrayPolicy.kt` | No host list: sub-resources from any host over TLS; plain http and ws refused (WebView's mixed-content rule refuses them too). `navigation(url, hasGesture)`: the site loads in the view; another https page **tapped by a person** opens outside; anything else is ignored. `mayAskForMedia` (site only). New `XrayView`: full screen or windowed, and whether the page's own full screen is in force |
| `features/xray/XrayWebView.kt` | Client: tapped links off the site go to `onOutside`. Chrome client: the page's full screen (`onShowCustomView` / `onHideCustomView`) and file inputs (`onShowFileChooser`) handed to the screen; camera, microphone, location still refused |
| `features/xray/XrayScreen.kt` | Starts full screen (as 0.1.165): a window over the app, bars hidden (immersive sticky), screen kept on. A slim tab on the start edge, half way down (28x64 dp, the theme's ink at 72 %), "Exit full screen" for screen readers, fades after 4 s and comes back on any tap (the tap still reaches the page); Back also leaves full screen. In the app's window: the app's frame and its Back to the menu, with Reload and Full screen in a slim bar above the page, never over it. The same WebView moves between the two, so the page keeps its place. Links out: `Browser.openExternal` (the system browser; refused while pinned, with the app's usual message). Downloads to https open outside. The staff hold-corner and its exit dialog are gone (the toggle and Back replace them) |
| `features/xray/XrayFeature.kt` | Comment; `XrayScreen()` (Back is the host's in the window) |
| `res/values/feature_xray.xml`, `values-pt-rPT/feature_xray.xml` | Summary updated; Full screen, Exit full screen, Reload; the corner and dialog strings removed |
| tests | `XrayPolicyTest` (the new rules, tapped versus untapped links), new `XrayViewTest` (4: in and out, page's own button from either mode), `XrayScreenTest` (the bar, full screen in and out, the tab fades and a tap brings it back, starts full screen, the client sends tapped links outside), `XrayScreenshotTest` (the windowed screen) |

Kept: the watchdog and offline cover, keep-screen-on (now also in the window, on the WebView), own WebView profile with storage kept (the demo key), no JavaScript bridge, Safe Browsing, no third-party cookies, no file:// access, `HoldIdleWhile`, not on the stand-mode list.

**Not done, on purpose:**
- **Microphone and camera.** The page never asks for them: its voice input is Web Speech (`webkitSpeechRecognition`), which Android WebView does not provide, so a microphone permission would change nothing. Granting them would also need `RECORD_AUDIO` / `CAMERA` in the manifest, a new permission for security.android to review. `mayAskForMedia` is there for that day. (Question 2.)
- **Blob exports** (the brain's Export): WebView cannot save a `blob:` download without a JavaScript bridge, which this screen never has. Export works in Chrome.
- **Clipboard read** ("Paste my key"): Chromium's permission, not routed to apps by WebView; staff type the key or choose the file. To check on a device.

## Option, not built: a Trusted Web Activity

Real Chrome, full screen, the app's look, opened from the app. **Gains:** everything Chrome has (Web Speech, clipboard, blob downloads, full screen, its updates), Chrome's own storage. **Loses:** the watchdog and offline cover, keep-screen-on control, the separate profile (the demo key lives in Chrome, shared with the browser), and stand-mode pinning works differently (Chrome is another app). **Needs:** `/.well-known/assetlinks.json` on web-summit.sgit.ai with the app's signing key fingerprint (a change to this site, its owners' call) and the androidx.browser TWA launcher.

## How it was tested (11 Nov, 22:58 to 23:16 UTC)

JDK 21, Android SDK platform 35 and build-tools 35.0.0 from dl.google.com, Gradle from the wrapper. Maven Central answered 429 (too many requests) several times; retried.

```
# baseline, dev 683f9f7 (separate worktree)
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.xray.*'
XrayPolicyTest 4, XrayScreenTest 7, XrayScreenshotTest 1, XrayWatchdogTest 6: 0 failures
# the change
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.xray.*'
XrayPolicyTest 5, XrayScreenTest 7, XrayScreenshotTest 1, XrayViewTest 4, XrayWatchdogTest 6: 0 failures
./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease
BUILD SUCCESSFUL in 5m 10s; 978 tests, 0 failures, 0 errors; lint: no finding in xray; release APK (unsigned here, CI signs) and AAB built
```

On the way: the fade test first failed with the test clock driven by hand (the tap was not delivered until the clock ran by itself); it now lets the clock run for the tap.

**Needs a real device** (no emulator here): the page inside WebView; the page's own full-screen button through `onShowCustomView` and back; that the edge tab sits clear of the page's controls on the stand's tablet and a phone; links opening in the browser and Back returning; the file picker; immersive mode after Home and Recents; `window.open` from a tap (WebView keeps `javaScriptCanOpenWindowsAutomatically` off, which should still allow a tapped one).

On a device, after the lead pushes and CI builds: drawer, Demos, X-Ray demo; tap UNIVERSO and SWARM (content appears); tap the tab on the left edge (the app's window, Reload and Full screen above the page); Full screen; the page's own ⛶ button and back; a link in the page's drawer (the browser opens).

Screenshots: `policy-412.png` (the page at 412 px, its bottom bar), `xray-cover-phone-portrait.png` and `xray-cover-tablet10-landscape.png` (Robolectric, the windowed screen: Reload and Full screen above the offline cover).

## How to undo

Revert the commit made from the patch on `angelo/riskmandate-xray-browser`. Nothing to migrate; the demo key stays in the `xray` WebView profile.
