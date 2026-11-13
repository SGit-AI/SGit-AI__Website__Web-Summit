# Step 5: build 2, the X-ray screen as a full embedded browser (riskmandate-android-demo-build2)

**Role:** build (large). **Skills:** software-engineer, security. **Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo, 11 Nov 2026 about 22:55 UTC, after installing 0.1.165:** "Ok the app has been deployed and I can see the X-ray menu item, and if I click it I can see the dashboard go automatically in full screen. But there are a few things that don't work quite well, especially the buttons don't seem to work properly. I think you should run it as an embedded app in a browser, if it's not already like that. We want to keep the features and to also be able to go back and forth from full-screen."
**His go to write and publish in the Android repo stands** (11 Nov about 21:30 UTC: "You're authorized to write there and publish the changes as soon as they're ready.").

## The problem, as the lead reads it
The `xray` feature (Android repo dev 683f9f7, `app/src/main/java/ai/riskmandate/app/features/xray/`) is already an embedded browser (Android System WebView is Chromium), but locked down far beyond what the page needs: sub-resources only from 7 hosts (others get a 403), new windows and `target=_blank` denied, microphone/camera/file chooser denied, main-frame navigation off web-summit.sgit.ai ignored, a 56 dp invisible corner over the page. Any of these can make the page's buttons "not work".

## What to do
1. **Reproduce first.** Load https://web-summit.sgit.ai/people/silvio/app/index.html#xray in headless Chromium (Playwright) at 1280x800 and 412x915 with an Android WebView user agent. List every button and control on the page; click each; record what it does (network requests and their hosts, window.open/target=_blank, permission requests, downloads, file inputs, navigation, console errors). Then repeat with the xray policy's rules simulated (route() aborting what XrayPolicy would refuse, popups blocked, permissions denied) and list which buttons break and why. That table goes in build2/build.md. (Silvio's page is never edited by us; a fault in the page itself is a note For: him, through the lead.)
2. **Make it a full browser for this page,** keeping the kiosk features:
   - the page behaves as it does in Chrome: no sub-resource host filter (keep https only and Safe Browsing); `target=_blank` and `window.open` to web-summit.sgit.ai open in the same view, other origins open in an in-app Custom Tab (or the browser) rather than silently nothing; file inputs and downloads work if the page uses them; microphone/camera asked through Android's normal runtime prompt when the page asks (only for https://web-summit.sgit.ai); JS alert/confirm/prompt work;
   - keep: keep-screen-on while shown, reload watchdog and offline cover, own profile with storage kept (the demo key), no JS bridge;
   - **full screen in and out:** a small, visible toggle (e.g. a semi-transparent button in a corner that fades after a few seconds and returns on tap, or a top bar with "Full screen" and "Exit"), so staff and Angelo can go back and forth; in windowed mode the app's back arrow returns to the menu; in full screen, system bars hidden (immersive sticky). Replace the invisible 3-second corner if the toggle makes it redundant, and make sure nothing covers the page's own buttons.
   - Option worth naming in build.md, not building now: a Trusted Web Activity (real Chrome, needs /.well-known/assetlinks.json on web-summit.sgit.ai), with what it would gain and lose.
3. Tests in the repository's style (update XrayPolicyTest etc. to the new rules; a test for the toggle). Run the gate `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease` in your session (the SDK installs from dl.google.com; if your session refuses it, say so).

## Where you write
- Android repo: add_repo access push; branch `angelo/riskmandate-xray-browser` from its latest dev. Commit shape as before (subject `riskmandate-android-demo.build@PrompTugal.angelo: <what>`, Angelo's words in the body, trailers Agent/Issue: WS-203/For: conductor.android@promptugal.ai.dinis, security.android@promptugal.ai.dinis). Never dev or main: the lead publishes after a check. If your push is refused, put a format-patch series in build2/ and say which dev sha it applies to.
- This repo: only build2/build.md, build2/STATE.md, screenshots in build2/ (plus estimates and ledger lines), on pool/riskmandate-android-demo-build2.

## Done when
The branch (or patch) is there, the gate passes, build2/build.md has the button table (before and after), what changed, how to undo it, and what still needs a real device.
