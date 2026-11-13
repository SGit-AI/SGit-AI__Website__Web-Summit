---
title: "Project: the X-ray demo page in the RiskMandate Android app (riskmandate-android-demo)"
lead: riskmandate-android-demo.pm@PrompTugal.angelo
started: 2026-11-11, by conductor.b@PrompTugal.angelo at Angelo's word
status: retired 2026-11-13 by conductor.b@ at Angelo's word; its work stays on project/riskmandate-android-demo and its pool/ branches
budget: none; the running cost (dollars and tokens) in STATE.md's "For the digest:" line (Angelo, 11 Nov: "Yeah, c works.")
---
**Wake routine:** trig_01GnGftTuQdk1LM63LnvaDtn (fires into this lead's session when a worker fires it, and every 2 hours at :12 as a backstop). Put "Wake routine: trig_01GnGftTuQdk1LM63LnvaDtn" in every worker's brief.md.

# The X-ray demo page in the RiskMandate Android app

**Angelo, 11 November (about 20:30 UTC):** "We need to spin a new task: we need to enhance the RiskMandate android app to have a dedicated menu entry to host the new demo page Silvio created, so that it's easy to select and put full screen to leave on devices." The page: "https://web-summit.sgit.ai/people/silvio/app/index.html#xray".

## Goal
In the RiskMandate Android app, one menu entry that opens Silvio's X-ray demo page, made to be left running on a device at the stand: full screen (no system bars, no app chrome), the screen kept awake, survives a lost connection and comes back by itself, easy to leave and to get out of for staff.

## Done when
A build of the RiskMandate Android app with that menu entry runs on an Android device or emulator, the page shows full screen and stays on, with screenshots and the build's steps in build.md; and Angelo has looked before it goes to any device at the stand.

## Start from (read; all material)
- The app: PrompTugal/PrompTugal__App__Android (Dinis's apps, the RiskMandate app is one of its modules; run by conductor.android@promptugal.ai). Read it first: its README, CLAUDE.md, how its modules and menus are built, how it is built and released (its dev, builds like 0.1.78).
- The team's notes: board/WS-203-android-apps-the-counterparts-of-the-ios-apps-who-does-what.md (who does what on Android; the RiskMandate app row is open), board/WS-197 (the booth on an iPad and the big screen), board/WS-191 and WS-194 (the X-ray at the booth).
- The page: people/silvio/app/ in this repository (Silvio's; never edited here: a change he needs is a commit For: dashboard@web-summit.silvio and conductor@web-summit.silvio).
- The iOS counterpart, if it has a demo entry: PrompTugal/PrompTugal__App__iOS (read only).

## Tier 3, Angelo's own word each time
Writing to PrompTugal/PrompTugal__App__Android (another person's agents' repository: asked of Angelo at 20:2x, no answer yet; until he says yes, the spec is read-only and the build waits); any release or install of a build to a device or a store; contacting conductor.android@ or Dinis's other agents (a commit For: them goes through Angelo first); keys, signing keys, settings.
