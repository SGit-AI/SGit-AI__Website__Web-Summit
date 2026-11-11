PASS

---
title: "Check 2: build 2 (the X-Ray screen as an embedded browser), reviewed cold"
by: charlie.large.worker@PrompTugal.angelo (role check; build 2 was alpha), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-11
reviewed: PrompTugal/PrompTugal__App__Android, branch angelo/riskmandate-xray-browser, head 5badada, tree a8aa9b5 (checked equal to build 2's tested tree), diff against dev 683f9f7 (10 files)
---

**In one line:** the change does what build2/brief.md asked, the lock-down holds with one gap (downloads open the browser without a tap), and the tests are real. Publish; fix finding 1 in build 3.

## The gate

Not run here. The Android SDK (platform 35, build-tools 35.0.0) installed, but Gradle's first run stopped resolving dependencies: Maven Central answered 429 (too many requests) for `com.google.guava:listenablefuture:1.0`. This session's permission check then refused a retry. So the gate result is build 2's own (978 tests, 0 failures, lint clean in xray, release APK and AAB) on the same tree, a8aa9b5. CI runs the gate again on the push.

## Findings, most serious first

1. **Downloads open the browser without a tap** (`XrayScreen.kt:185`). The download listener asks `XrayPolicy.navigation(url, hasGesture = true)`, so any https download opens the system browser. That includes one started by a script or by a frame from any host, which this build now allows. This breaks "off-site pages only on a person's tap". It does nothing while the stand tablet is pinned, because `Browser.openExternal` refuses then. **Fix:** remember when the WebView was last touched (`setOnTouchListener { _, e -> if (e.actionMasked == ACTION_DOWN) lastTouch = clock(); false }`). Open a download outside only within about 2 s of that touch. Or drop the listener: the page's exports are `blob:` and never reach it. Add a test either way.
2. **Back during the page's own full screen leaves everything** (`XrayScreen.kt:215`). Back calls `toggle()`. That ends the page's full screen and also the app's full screen, so a visitor who started full screen lands in the windowed view. Chrome's Back only ends the page's full screen. **Fix:** in `onDismissRequest`, if `view.pageFullScreen`, call `endPageFullScreen()` only. WebView's `onHideCustomView` then runs `pageExited()`, which already returns to the right mode.
3. **Multiple-file inputs get one file** (`XrayScreen.kt:163`). `FileChooserParams.createIntent()` does not set `EXTRA_ALLOW_MULTIPLE` for `MODE_OPEN_MULTIPLE`. **Fix:** add the extra when `params.mode == MODE_OPEN_MULTIPLE`. This is low priority: the page's CHAVE and brain inputs take one file.
4. **Rotation reloads the page and drops a file pick in progress.** `MainActivity` declares no `configChanges`, and the WebView is only `remember`ed, so a recreated activity builds a new WebView. This is true since build 1; the dropped file pick is new. **Fix:** check it on the stand's tablet. If the stand rotates, either lock the stand's orientation or handle `orientation|screenSize` in the X-Ray screen's activity. That is an app-wide decision for the Android lead, not this branch.
5. **Note, accepted by the brief:** sub-resources from any https host mean any script the page loads can read the demo key in the `xray` profile and send it anywhere, as it could in Chrome. The separate profile still keeps the key away from the site screen's wipe and from Chrome.

## What still holds (read in the code)

- No JavaScript bridge: no `addJavascriptInterface`, `addWebMessageListener` or `evaluateJavascript` in `app/src/main`.
- `allowFileAccess`, `allowContentAccess` and both `...FromFileURLs` are off. `MIXED_CONTENT_NEVER_ALLOW`, Safe Browsing on, third-party cookies off, `javaScriptCanOpenWindowsAutomatically` off, a single window (`onCreateWindow` false), geolocation off.
- Plain http and ws are refused for sub-resources too (`blockSubresource`). The authority checks refuse `@`, `%`, a backslash, whitespace and a port other than 443.
- Top-level pages load only from https://web-summit.sgit.ai. Another https page a person tapped goes to the system browser (`Browser.openExternal`, refused while pinned). `intent:`, `javascript:`, `file:`, `http:` and userinfo URLs are ignored even with a tap (tested). Finding 1 is the one exception.
- Certificate errors cancel the load. Camera, microphone and location are denied (`onPermissionRequest` → `deny`). `mayAskForMedia` is unused for now.
- The file chooser returns only `FileChooserParams.parseResult` of the system picker's result, which is what the user picked, or null if they cancelled. A second request first cancels the pending one.
- Full screen: `XrayView` is sound in all four paths (tested in `XrayViewTest`). `onShowCustomView` hands the page's view to the full-screen dialog, and leaving ends it through `onCustomViewHidden`. Immersive mode comes back on resume. The edge tab watches taps without consuming them.
- Tests are real: they check behaviour, not names. `XrayPolicyTest` covers tapped versus untapped links and the bad schemes. `XrayScreenTest` covers the bar, full screen in and out, the tab fading and coming back, and the client sending tapped links outside. The download listener, the file chooser and the custom-view wiring have no test. These need a device, plus the test finding 1 asks for.

## For the device check (unchanged from build2/build.md, plus)

- The system file picker while the stand is pinned. Screen pinning may block another app's activity. The page's input then waits until the next pick.
- Back during the page's own full screen (finding 2).
