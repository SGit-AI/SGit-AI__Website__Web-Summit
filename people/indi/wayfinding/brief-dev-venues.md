---
title: "Brief for dev.venues@PrompTugal.angelo: the registration page on PrompTugal.news, now"
by: conductor@web-summit.indi, at Dinis's word (9 November 2026, about 15:25 UTC)
for: dev.venues@PrompTugal.angelo, through desk.conductor@PrompTugal.angelo (Angelo)
issue: WS-181
---

# Brief: the registration page on PrompTugal.news

**Dinis, 9 November, about 15:20 UTC:** *"Yes, build a page now and build it using Angelo's venues agent for PrompTugal.news. Then add [it] to the Team app's websites list."*

The design is in this folder: `README.md`, `01-problem.md` to `04-recommendation.md`. Build the MVP from `04-recommendation.md` (options 1 and 2), on PrompTugal.news, as part of WS-181's venues guide.

## What to build

1. **The page at `https://promptugal.news/registration/`** (this exact path: the Team app's websites list will point to it), public, phone first:
   - Two cards: **Humberto Delgado Airport, Terminal 1** and **Pavilhão de Portugal, Alameda dos Oceanos**. Each card has today's hours, "open now" or "closes in 2 h 10 min" (Lisbon time, from the phone's clock), and a **Directions** button: Apple Maps on iPhone and iPad, Google Maps elsewhere, destination only.
   - The open, nearest card first.
   - **From where I am:** the browser's location, used on the phone only and never sent anywhere. A small map with no tiles, from your venue drawing (`venue-map.js`, ODbL credit), plus the airport. It shows a straight line from you, the distance and the direction, and one transport line ("metro, red line, to Oriente"). If location is refused, the page still works.
   - **What to bring:** the ticket's QR code (in Web Summit's app) and a photo ID; a lost item costs €100.
   - The source and the date read, at the bottom.
2. **`registration.json`**: the two points with coordinates (checked on OpenStreetMap), the hours by day, the source URL and the date read. Every later option reads it.

## The facts (public, sourced)

From https://websummit.com/essentials/registration-essentials/ (as in the team's `data/events.json`, `summit.badge_pickup`). Re-check them at the source before publishing:

- **Airport, Terminal 1:** Sat 7 Nov 09:30 to 22:00; Sun 8 and Mon 9 Nov 07:30 to 22:00; Tue 10 Nov 07:30 to 15:00.
- **Pavilhão de Portugal:** Sat 7 and Sun 8 Nov 12:00 to 18:00; Mon 9 Nov 12:00 to 22:00; Tue 10 and Wed 11 Nov 07:30 to 17:00; Thu 12 Nov 07:30 to 16:45.
- Times may change (Web Summit says so): the page says so too.

## Rules

- **No personal data:** no hotel, no person's location on the server, no tracking, no third-party scripts or map tiles. This matches WS-181's rules (zones by default, never a pin for a hotel).
- The newsroom's own rules apply: public facts with their source and the date read, no em-dashes.
- When it is live, tell conductor@web-summit.indi (a commit `For: conductor@web-summit.indi`). It then adds the page to the Team app's websites list (`Packages/PTWeb/Sources/PTWeb/Resources/Websites.json` in PrompTugal/PrompTugal__App__iOS) as a third shortcut, "Registration".

## Soon, not now

From my hotel (option 3), your agent's link (option 5), the native Team app card (option 4): see `04-recommendation.md`.
