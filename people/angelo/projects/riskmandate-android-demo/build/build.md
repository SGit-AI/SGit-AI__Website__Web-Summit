---
title: "Build: the X-Ray demo as a stand kiosk in the RiskMandate Android app"
by: bravo.large.worker@PrompTugal.angelo (role build), for riskmandate-android-demo.pm@PrompTugal.angelo
written: 2026-11-11
for: the check step, then conductor.b@PrompTugal.angelo
status: built and tested locally; not pushed to the Android repository (push access refused in this session)
---

**In one line:** a new `xray` feature in PrompTugal/PrompTugal__App__Android opens Silvio's X-Ray page full screen as a kiosk; the repository's whole gate passes locally; the change is here as a patch for the lead to push.

## Where the change is

Attaching the Android repository with push access was refused in this session (the session's permission check, not GitHub). As the brief says, I built in a local clone of the public repository and put the patches here:

| File | What | Apply to |
|---|---|---|
| `0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch` | The feature. Commit `4d7f582f34219a974051f2f7d38ba737b327d335` in my clone (sha256 of the patch `6a01811d...e55bb8`) | Android `dev` at `653320a` |
| `0002-riskmandate-android-demo.build-PrompTugal.angelo-OPT.patch` | **Optional, needs a decision first** (question 1 below): `xray` on the stand-mode visitor list. Commit `f89f072` | on top of 0001 |

To push it (the lead's session has push access):

```
git clone https://github.com/PrompTugal/PrompTugal__App__Android && cd PrompTugal__App__Android
git checkout -b angelo/riskmandate-xray-demo 653320a
git am <path>/0001-riskmandate-android-demo.build-PrompTugal.angelo-X-R.patch
git push -u origin angelo/riskmandate-xray-demo
```

Tested: `git am` of 0001 on `653320a` gives exactly the tree I tested (same tree hash as `4d7f582`); 0002 applies on top. The branch head after `git am` gets a new sha (the committer and date change); its tree is the tested one.

## What changed (all in the Android repository)

| File | Change |
|---|---|
| `app/src/main/java/ai/riskmandate/app/features/xray/XrayFeature.kt` (new) | The feature: id `xray`, "X-Ray demo", kicker "Live demo"; holds stand mode's idle reset off while shown |
| `.../features/xray/XrayPolicy.kt` (new) | Pure Kotlin: pages only on `https://web-summit.sgit.ai`; sub-resources only from web-summit.sgit.ai, cdn.jsdelivr.net, fonts.googleapis.com, fonts.gstatic.com, promptugal.news, dev.send.sgraph.ai, openrouter.ai (the hosts the page used when I loaded it at 21:27 UTC, plus openrouter.ai, which the spec found it calls once a key is set); the watchdog |
| `.../features/xray/XrayWebView.kt` (new) | Client (policy, errors, renderer crash), chrome client (permissions, location, files and new windows denied; JavaScript alert and confirm use WebView's own dialogs), settings |
| `.../features/xray/XrayScreen.kt` (new) | The kiosk window, the cover, the staff corner, the exit dialog, the network watch |
| `app/src/main/res/values/feature_xray.xml`, `values-pt-rPT/feature_xray.xml` (new) | Strings, English and Portuguese |
| `app/src/test/java/ai/riskmandate/app/features/xray/` (new) | `XrayPolicyTest`, `XrayWatchdogTest`, `XrayScreenTest`, `XrayScreenshotTest`: 18 tests |
| `.../features/Features.kt` | `XrayFeature` added to `FEATURES` (the conductor's file) |
| `.../MainActivity.kt` | `xray` in the Demos section, first in the order, the pulse icon (host lines) |
| `res/values/features.xml`, `values-pt-rPT/features.xml` | `feature_xray_title` |
| `app/src/test/.../qa/FeatureLinksTest.kt` | The X-Ray start URL added to the test's map of reviewed extra origins, in the `xray` package only. The test says a new origin means editing that map "so it is always a reviewed change": for QA and security.android |

How it behaves:
- **Full screen, no app chrome:** the screen is a full-screen dialog window over the app, so the app's top bar and sidebar never show; system bars hidden with "show transient bars by swipe" (immersive sticky), hidden again on resume; `FLAG_KEEP_SCREEN_ON` on that window while it shows; display cutouts used (Android 9+).
- **Locked:** main-frame pages off web-summit.sgit.ai are ignored and never opened in a browser; fetches to other hosts get a 403; Back does nothing.
- **Recovers by itself:** after a load error (or a 5xx on the page itself, or a certificate error) a calm cover ("X-Ray will be back in a moment") and a reload after 10 s, then 20, 40, at most 60 s; a load that has not finished in 45 s is reloaded; the network coming back reloads a failed page at once; a crashed renderer gets a new WebView. The cover stays during a retry, so WebView's error page never shows.
- **Staff exit:** hold the bottom-start corner (56 dp, invisible) for 3 seconds, then Leave, Reload page or Stay. A tap there does nothing. The page's own buttons are in the top corners, so the bottom-start corner covers none of them (seen on the 1280 px screenshot of the live page).
- **The demo key (Silvio's page asks a new device for it, e9915f5):** DOM storage is on and kept, first-party cookies are accepted and never cleared, so staff unlock once per device and it survives reloads and app restarts. On WebView 110 and later the kiosk has its own WebView profile, so the RiskMandate site screen, which wipes the default profile's storage when it opens and closes, never clears the key. On an older WebView it shares the default profile and **opening the site screen clears the key**: staff then unlock again.

Not done, on purpose:
- **Stand mode:** `xray` is not on the stand-mode visitor list, so it is hidden while stand mode is on (fail closed). Patch 0002 is the one-line change, kept separate (question 1).
- **Screen pinning toggle (optional in the brief):** not added. Pinning needs the Activity, which the architecture rules keep from features; stand mode already pins. With 0002 applied, stand mode's pinning is the lock.

## How it was tested (this session, 11 Nov 21:24 to 21:53 UTC)

JDK 21 (the session's), Android SDK platform 35 and build-tools 35.0.0 installed from dl.google.com, Gradle 8.11.1 from the wrapper.

```
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.site.SitePolicyTest'   # baseline on 653320a
BUILD SUCCESSFUL
./gradlew testDebugUnitTest --tests 'ai.riskmandate.app.features.xray.*'
XrayPolicyTest 4, XrayScreenTest 7, XrayScreenshotTest 1, XrayWatchdogTest 6: 0 failures
./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease                      # the repository's gate, on 4d7f582
BUILD SUCCESSFUL in 2m 40s; 973 tests, 0 failures, 0 errors; lint: no RequiresFeature or other finding in xray
```

What the tests caught on the way: the first policy refused `cdn.jsdelivr.net/npm/three@0.147.0/...` (an `@` in the path, now refused only in the host part); the gate's `FeatureLinksTest` and `ColourRulesTest` refused a URL literal and colour literals (now the reviewed map and the theme's tokens); lint asked for an explicit WebView profile feature check (now explicit); this site's own contact-detail check read two hostile test URLs in the patch as email addresses (now `evil.example.com`, and the userinfo case built in two parts, with a comment).

**What could not be tested here:** a real device or emulator (no `/dev/kvm` in a cloud session): the page itself inside WebView, immersive mode, keep-awake for hours, Wi-Fi drops, the profile isolation on a real WebView, and how long the 3 s hold feels. Robolectric draws no web content. **Signing:** the release APK is unsigned here (no upload key; CI holds it), the AAB built.

Screenshots (Robolectric, the kiosk's own screen, the offline cover): `xray-cover-tablet10-landscape.png`, `xray-cover-phone-portrait.png`.

On a device, after the lead pushes and CI builds (Firebase): open the drawer, Demos, "X-Ray demo"; the page fills the screen; turn Wi-Fi off (cover), on (page back within seconds); hold the bottom-left corner 3 s, Leave.

## How to undo

Revert the commit made from 0001 on `angelo/riskmandate-xray-demo` (and the 0002 commit, if applied). No data migration; the page's stored key goes with the app's data or the `xray` WebView profile.

## Questions (for conductor.b@, with my recommendation)

1. **Stand mode** (the lead asked for it; the spec's question 3): apply 0002 so stand mode's pinning keeps visitors in the kiosk? It lets the page reach openrouter.ai with a key typed on the device while stand mode is on, which the app's own rule keeps off. Recommended: yes, with Angelo's word and security.android's review recorded on the Android side.
2. **The mandate screen** lists riskmandate.ai as the only host the app opens; with this feature that is no longer the whole story. Recommended: the mandate feature's owner adds web-summit.sgit.ai and the fetch hosts, as a follow-up on the Android side.
3. **Push:** the lead pushes 0001 to `angelo/riskmandate-xray-demo` (commands above).
