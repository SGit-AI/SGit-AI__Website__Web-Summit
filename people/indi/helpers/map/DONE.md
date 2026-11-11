---
title: "Venue map: done, in TestFlight build 0.4.76 (565)"
by: conductor-map@web-summit.indi (9 November 2026)
for: conductor@web-summit.indi, indi
issue: WS-181
---

# Venue map: what was done

**What it is:** a map of the Web Summit venue in the iPhone and iPad Team app (Where tab). It is Apple Maps with our own simple drawing of the buildings and key places on top.

## Done

1. **The venue file** (shapes and pins): in this folder, public at https://web-summit.sgit.ai/people/indi/helpers/map/venue.geojson. What is in it: this folder's README.
2. **The Map screen** in the Team app, on branch `night/team-map` of the iOS repository:
   - each building a coloured, labelled shape; each place a pin;
   - a pin opens its detail, hours and a **Directions in Apple Maps** button;
   - **Open Web Summit's app**, for their full detail;
   - "you" appears only after the person taps Show me and allows it; the position stays on the phone.
3. **Tests:** passed on iPhone and iPad, with a full build. Run: https://github.com/PrompTugal/PrompTugal__App__iOS/actions/runs/42668007000
4. **A brief for Dinis's iOS conductor:** in the iOS repository, briefs, 2026-11-09 team-map.
5. **Android:** a plan, not code (android.md here), and it stays a plan for now. The Android repository has no Team app, only Dinis instructs there, and the Android build tools were not available.

## In TestFlight

- **At Indi's yes, the conductor merged the map into the app's shared line of work** (dev, Tuesday 10 November). The tests passed again on the combined code.
- **It is in the Team app 0.4.76, build 565**, for the team's internal testers. Apple finished processing it on Tuesday 10 November at 13:47 UTC.
- **One small step failed:** just after processing, Apple's server returned an error (500), so the build's tester notes ("What to Test") and export answer may not be set. The build itself is fine. Run: https://github.com/PrompTugal/PrompTugal__App__iOS/actions/runs/42823122015

## Left for the conductor

- **Build 565's tester notes:** re-run the TestFlight step (the iOS repository's TestFlight ops) if they are missing.
- **Not mine, seen on the way:** the iOS repository's website update fails on dev, because `briefs/2026-11-09__the-big-stop/stop-report.md` has no "> summary" line. It was failing before the map was merged.
- **My key was not made.** This session was not allowed to run the downloaded key tool (even though it matched the pinned version), so there is no entry in the keys list for conductor-map@web-summit.indi.
- **Approximate pins to check on OpenStreetMap:** the airport, Terminal 1; the North Entrance; the Startup Lounge; our stand. OpenStreetMap could not be reached from this session.
- **Not on the map:** Stages 2 to 14, masterclasses and meetups (no building published), and Pavilion 5 (not in OpenStreetMap's outlines yet).
