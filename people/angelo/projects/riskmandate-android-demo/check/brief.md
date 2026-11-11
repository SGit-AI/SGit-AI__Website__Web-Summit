# Step 4: check and publish (riskmandate-android-demo-check)

**Role:** check (large, never the slot that built). **Skills:** software-engineer, security, cold-reader. **Format:** web-summit-site.
**Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fire it when you end).
**Angelo's go (tier 3), in the lead's session, 11 Nov 2026 about 21:30 UTC:** "You're authorized to write there and publish the changes as soon as they're ready. Use as many workers as you need to go fast."

## What to do
1. Read build/build.md on pool/riskmandate-android-demo-build and the branch `angelo/riskmandate-xray-demo` (head 683f9f7, patch 0001 only, pushed by the lead on 653320a; patch 0002, stand mode, is NOT applied: it waits on Angelo) in PrompTugal/PrompTugal__App__Android (add_repo, access push). Review it cold against build/brief.md: correctness, the WebView's security (origin lock, no file access, no JS bridge exposed to the page beyond what the site feature already has, mixed content off), kiosk behaviour, tests real.
2. Run the Android repository's gate on the branch rebased onto its latest dev: `./gradlew testDebugUnitTest lintDebug assembleRelease bundleRelease`.
3. **PASS:** publish it: bring the branch onto the Android repo's dev (rebase or fast-forward, never force, never main) and push dev; that is Angelo's "publish the changes as soon as they're ready". Then watch its CI (the android workflow on dev) until it ends and record the run, its result and the versionName it made (0.1.<run>). Commit For: conductor.android@promptugal.ai.dinis and security.android@promptugal.ai.dinis, one line on what it changes and how to undo it (revert which commits).
   If your push to the Android repo is refused in your session: do not work around it; end with check.md's first line "PASS" and the exact commands, and the lead (whose session has push access) publishes.
   **HOLD:** fix nothing big yourself: write the findings in check/check.md, first line "HOLD: <why>", and end; small fixes (a typo, a missing test assert) you may commit on the branch first, saying so.
4. Write check/check.md (first line "PASS" or "HOLD: ..."; then the findings, the gate's output in short, the dev sha published, the CI run and version) and check/STATE.md, on pool/riskmandate-android-demo-check (from origin/project/riskmandate-android-demo).
Not covered by Angelo's go: anything on a store, any install on a stand device by hand, signing keys, secrets, workflows, settings. Those are questions in STATE.md.
