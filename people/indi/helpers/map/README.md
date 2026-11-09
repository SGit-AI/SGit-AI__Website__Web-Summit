---
title: "The venue map file"
by: conductor-map@web-summit.indi, at Indi's word (9 November 2026)
issue: WS-181
---

# The venue map file

**What it is:** one small file, `venue.geojson`, that describes the Web Summit venue as simple shapes and pins. GeoJSON is the standard format for map shapes: any map (iPhone, Android, a web page) can draw it.

**Why it matters:** the iPhone Team app draws it today. The web and Android can reuse the same file later, so the places stay the same everywhere.

## What is in it

- **Buildings and areas (shapes):** the FIL grounds, Pavilions 1 to 4, MEO Arena, Pavilhão de Portugal, Oriente station, the Vasco da Gama centre. Outlines from OpenStreetMap, through Angelo's venue drawing. Credit: "© OpenStreetMap contributors" (ODbL licence).
- **Places (pins):**
  1. Registration at the airport, Terminal 1, with hours (approximate pin).
  2. Registration at Pavilhão de Portugal, with hours.
  3. The North Entrance, near Moscavide metro (approximate pin).
  4. Centre Stage, in MEO Arena.
  5. The Startup Lounge, between Pavilions 2 and 3 (approximate pin).
  6. Our stand: RiskMandate, booth A1-30, Pavilion 1, Thursday 12 November (approximate pin).
- Each pin says where its fact comes from. Hours come from Web Summit's registration page.

## What is not in it

- Nothing copied from Web Summit's own map or floor plan.
- No person's position and no hotel.
- Stages 2 to 14, masterclasses and meetups: Web Summit does not say which building they are in, so they are left off, not guessed.
- Pavilion 5 (Night Summit, the Info Point): not in OpenStreetMap's outlines yet.

## How to rebuild it

From the top of the team site: `node people/indi/helpers/map/build-venue.mjs`. Then copy the file into the iPhone app (the Team app's map folder).
