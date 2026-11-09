---
title: "A detailed venue map in the Team app: Mapbox, or our own"
by: conductor@web-summit.indi, at Indi's word (9 November 2026, about 16:10 UTC)
status: research and options; nothing built
---

# 5. A detailed venue map in the Team app

Indi's question, with a screenshot of Web Summit's app (the Night Summit area: Wine Summit, the Food Summit networking garden, Pink Street, the Disco Bar, the VIP and Platinum Investor lounges, meetup spots, the north entrance), credited "mapbox": can we put this kind of map in the PrompTugal Team app? If not, can we make our own?

## What Mapbox is, in plain words

- **Mapbox is a map engine and a map service.** It draws maps inside an app or a web page, and it supplies the base map: streets, buildings, water. It is used by many apps.
- **It is not a plugin you can copy from Web Summit's app.** The detail in the screenshot (the stands, the lounges, Pink Street, the colours) is **Web Summit's own venue drawing**, made by them and shown through Mapbox. That drawing belongs to Web Summit. Mapbox does not give it to anyone else.
- **So there are two separate questions:** which engine draws the map (Mapbox, or another), and where the venue's detail comes from (we must draw it ourselves, or get Web Summit's permission).

## Cost

- Mapbox's iPhone and Android kit is billed by **monthly active users** (a person who opens a map in a month). Mapbox has a free allowance. Its own documents point to its pricing page for the number, and a third-party summary says 25,000 users a month free, then about $4 per 1,000 (to be confirmed on mapbox.com/pricing before deciding).
- **For our team (about ten people) it would almost certainly be free.** For a public app with many users it would start to cost money.
- It needs a Mapbox account, an access token in the app, and a secret token in CI to download the kit. It also needs Mapbox's logo and attribution on the map.

Sources: [Mapbox, Maps SDK for iOS pricing](https://docs.mapbox.com/ios/maps/guides/pricing/), [Mapbox, pricing guide](https://docs.mapbox.com/accounts/guides/pricing/), [StoreRocket, Mapbox pricing (third party)](https://storerocket.io/learn/mapbox-pricing).

## Four ways to do it

| | Engine | Venue detail | Cost | Effort | Fit |
|---|---|---|---|---|---|
| **A. Mapbox** | Mapbox Maps SDK (Swift package) | ours, drawn as a Mapbox style or GeoJSON layers | free at our size; a token and attribution | a few days | good, but adds an account, tokens and a dependency for little gain |
| **B. Apple Maps (MapKit), with our own venue drawing** (recommended) | MapKit, already in the iPhone's system and already used by the Team app | ours, as GeoJSON shapes drawn over the map (`MKGeoJSONDecoder`, overlays) | free, no account, no token | one to two days for a first version | best: nothing new to install, private by default, the same file feeds the web and Android |
| **C. Apple's indoor map format (IMDF) in MapKit** | MapKit | ours, in IMDF: the format airports and shopping centres use (venue, buildings, levels, units, amenities) | free | more: a careful dataset, validated in Apple's IMDF Sandbox | the "proper" version of B, for a future event |
| **D. MapLibre**, the free, open-source twin of Mapbox | MapLibre Native (BSD licence), with free OpenFreeMap tiles | ours, in the same style format Mapbox uses | free | a few days | if we want Mapbox's look and one style for iPhone, Android and web without Mapbox's account |

Sources: [Apple, Displaying an indoor map](https://developer.apple.com/documentation/mapkit/displaying-an-indoor-map), [Apple, Indoor Mapping Data Format](https://register.apple.com/resources/imdf/), [OGC, IMDF community standard](https://docs.ogc.org/cs/20-094/), [MapLibre Native](https://maplibre.org/projects/native/), [OpenFreeMap quick start](https://openfreemap.org/quick_start/).

## Where our venue detail comes from

The engine is the easy part. The detail is the work, whichever engine we pick.

1. **We already have the outlines.** Angelo's venue drawing (`people/angelo/app/venue-map.js`) comes from OpenStreetMap under the ODbL licence: the four pavilions, the MEO Arena, Pavilhão de Portugal, Oriente station.
2. **We add our own places** as named shapes and points: the stages and areas from PrompTugal.news's events data (each event already has a `place` and a `where`), the two registration points, our stand, the entrances.
3. **We do not copy Web Summit's drawing.** Their floor plan, colours and artwork are theirs. We can place things where they publicly say they are, in our own simple drawing. For their full detail, the Team app can offer an "Open in Web Summit's app" button.
4. **One file for everything:** `venue.geojson`, public, on PrompTugal.news (WS-181's venues guide, Angelo's dev.venues@). The web page draws it, the iPhone app draws it with MapKit, Android draws it too.

## The workflow, for option B

1. **dev.venues@PrompTugal.angelo** turns Angelo's outlines into `venue.geojson`, adds the places (registration, stages, our stand, entrances), and publishes it on PrompTugal.news beside `registration.json`.
2. **A Team app change** (Dinis's iOS conductor or Indi's team, which has push access): a Map screen in the Where tab that loads `venue.geojson`, draws each building and area as a coloured shape with its name, and shows "you" (location while the app is in use, on the phone only), the registration points and your picks.
3. **The release line:** push to `dev`, CI builds and tests, then TestFlight (or, under Dinis's new rule, after the security review, from `main`).
4. **Iterate:** after a day of use, add what people ask for (levels, toilets, food), then consider IMDF (option C) for the next event.

## Recommendation

**Option B: Apple Maps with our own venue drawing.** It is free, needs no account or token, is already in the Team app, keeps location on the phone, and the same `venue.geojson` serves the web page and Android. Mapbox would work and would almost certainly be free at our size. But it adds an account, tokens and a dependency, and **it would not give us Web Summit's detail**, which is the part Indi liked. If we later want Mapbox's look on every platform, MapLibre (option D) gives it without Mapbox's account.
