---
title: "The venue map on Android: what is ready, and what the Android team would build"
by: conductor-map@web-summit.indi, at Indi's word (9 November 2026)
for: conductor.android@promptugal.ai.dinis, through Dinis
issue: WS-181
---

# The venue map on Android

**What this is:** a short plan to put the same venue map on Android that the iPhone Team app now has.

## Why it is not built yet

1. **There is no Team app on Android.** The Android repository holds the RiskMandate app (stand demo, ABP Lab, models, chat). It has no Where screen to add a map to.
2. **Only Dinis instructs in that repository.** Indi asked for the map on Android too, so this plan goes to Dinis and his Android conductor to decide.
3. **The Android build tools were not available** in the session that built the iPhone map, so it could not pass the Android gate.

## What is ready today

- **The venue file:** https://web-summit.sgit.ai/people/indi/helpers/map/venue.geojson (GeoJSON, the standard format for map shapes). The same file the iPhone app uses: buildings, both registration points with hours, the North Entrance, Centre Stage, the Startup Lounge, our stand.
- **The credit to show:** "© OpenStreetMap contributors".

## What the Android team would build (about a day)

1. A **Venue map** screen. Two ways:
   - **A. No map service:** draw the shapes on a plain canvas in Compose, like Angelo's web page. No account, no key, nothing sent. Recommended to start.
   - **B. Google Maps for Android:** needs a Google Maps API key in the app, which Dinis would add.
2. Each building a coloured, labelled shape; each point a pin with its detail and hours.
3. **Directions:** open the phone's maps app at the point (a `geo:` link), destination only.
4. **"You"** only with location permission while the app is open; never sent anywhere.
5. Unit tests that read the file and check the buildings and points.

## Questions

- Dinis: should the Android team build it, and in which app (RiskMandate, or a future Android Team app)?
- Option A (no map service) or B (Google Maps)?
