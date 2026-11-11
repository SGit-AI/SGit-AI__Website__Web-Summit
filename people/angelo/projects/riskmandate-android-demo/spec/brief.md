# Step 1: spec (riskmandate-android-demo-spec)

**Role:** spec (large). **Skills:** researcher, writer, analyst, plus software-engineer and security (read only). **Format:** web-summit-site.
**From:** riskmandate-android-demo.pm@PrompTugal.angelo (the lead), for the project in ../BRIEF.md (Angelo, 11 Nov about 20:30 UTC: "we need to enhance the RiskMandate android app to have a dedicated menu entry to host the new demo page Silvio created, so that it's easy to select and put full screen to leave on devices").
**Wake routine:** not yet set (conductor.b@ adds it to ../BRIEF.md; if BRIEF.md on origin/dev or origin/project/riskmandate-android-demo names one when you end, fire it).

## Where you work (overrides the preamble's paths)
- Your folder is `people/angelo/projects/riskmandate-android-demo/spec/`, not people/angelo/pipeline/{ID}/. Create `pool/riskmandate-android-demo-spec` from `origin/project/riskmandate-android-demo` (not from dev), push only there.
- Writes: `spec/spec-riskmandate-android-demo.md`, `spec/STATE.md`. Nothing else in this repository.
- **Read only** in PrompTugal/PrompTugal__App__Android and PrompTugal/PrompTugal__App__iOS (attach each with add_repo, access read). Writing there is tier 3 and Angelo has not said yes: no branch, no commit, no issue, no comment, no message to conductor.android@ or any other agent. If add_repo is refused, say so in STATE.md, spec from what you can reach and mark every claim about the app as unverified.

## The question
How to add one menu entry to the RiskMandate Android app that opens https://web-summit.sgit.ai/people/silvio/app/index.html#xray in a kiosk-style view to leave running on devices at the stand. Silvio's page (people/silvio/app/ here and the live page) is never edited by us; if it needs a change, write it as a question.

## The spec must cover (newsroom spec shape: front matter title, by, written, for, issue WS-203; what and why, out of scope, data and who sees it, changes by owner, risks, how we know it works)
1. **What the app has today:** the repository's layout, the RiskMandate module (or where it would go if it is not there), how menus/navigation and any web views are built (file paths), how builds are made and released (Gradle tasks, CI, versioning like 0.1.78, signing: name where keys live, never read or copy a key), its CLAUDE.md rules for outside contributors and its branch rules. The iOS RiskMandate app: does it have a demo entry to mirror?
2. **The page in a WebView:** does it load and run in Android System WebView (JavaScript, storage, fetches, fonts, any camera or mic, the #xray anchor, sizes at tablet and phone)? Check by loading it in headless Chromium at a tablet and a phone size; screenshots in spec/ are welcome.
3. **Options, each with what it does well and badly:** (a) a WebView screen in kiosk style: immersive full screen (system bars hidden, sticky), FLAG_KEEP_SCREEN_ON, reload on lost connection and on a stall (a watchdog), offline message, no navigation away from the page's origin, a hidden staff exit (for example a long press in a corner plus a PIN or a gesture); (b) the same plus Android screen pinning (startLockTask without device owner: the user confirms once); (c) full lock task mode as device owner (needs provisioning each device: heavier, say what it takes); (d) a Chrome Custom Tab or a link to the browser (lightest, least control). **Recommendation** in one line.
4. **What can be built and checked in a cloud session** (Gradle with the Android SDK, an emulator if KVM is there: try `ls /dev/kvm` and say; screenshots) **and what needs a real device** (Angelo's or the team's tablet); the exact commands, tested where you can.
5. **The build step, ready to brief:** files to add or change, roughly how big, the checks, how to undo it; and the tier-3 questions for Angelo (writing to the Android repository: a branch of its own or a pull request For: conductor.android@promptugal.ai; installing a build on a stand device; signing).

## Done when
spec-riskmandate-android-demo.md is on pool/riskmandate-android-demo-spec, every path it names exists (or is marked as in the Android repository, with the commit read), and spec/STATE.md says "ready for Angelo's read".
