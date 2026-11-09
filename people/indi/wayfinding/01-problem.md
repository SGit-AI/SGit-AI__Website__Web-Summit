# 1. The problem

## The job to be done

*"I have just arrived (at my hotel, or anywhere in Lisbon). Where do I collect my badge, is it open now, and how do I get there?"*

It is the first thing every person on the team, and every attendee, needs. It is also a test of something bigger: how a person's context (where they are, where they stay, what time it is) meets public facts (where and when), across the environments we use, without giving away anything private.

## The facts we have (public, sourced)

From Web Summit's registration essentials page (https://websummit.com/essentials/registration-essentials/, as kept in the team's `data/events.json`, `summit.badge_pickup`):

| Registration point | Open |
|---|---|
| **Humberto Delgado Airport, Terminal 1** | Sat 7 Nov 09:30 to 22:00; Sun 8 and Mon 9 Nov 07:30 to 22:00; Tue 10 Nov 07:30 to 15:00 |
| **Pavilhão de Portugal, Alameda dos Oceanos** (Parque das Nações, by the venue) | Sat 7 and Sun 8 Nov 12:00 to 18:00; Mon 9 Nov 12:00 to 22:00; Tue 10 and Wed 11 Nov 07:30 to 17:00; Thu 12 Nov 07:30 to 16:45 |

Bring the ticket's QR code (in Web Summit's app) and a photo ID. A lost item costs €100 to replace. Web Summit says the times may change, so the page must show its source and the date it was read.

We also have:
- **A drawing of the venue** from OpenStreetMap's outlines (Angelo's `people/angelo/app/venue-map.js`, ODbL), with the pavilions, the MEO Arena, Pavilhão de Portugal and Oriente station.
- **The team's zones** (Angelo's WS-181): "where everybody is" as zones, never coordinates, with an exact pin only by a person's choice, each time, and never for a hotel.

## What is private

- **Where a person stays.** Indi's decision (9 November): the hotel's name only, to the team only. Angelo's design (WS-181): no hotel addresses in the team's private files, and never a pin for a hotel.
- **Where a person is right now.** The phone may know it. It does not need to leave the phone to draw a line.

So the rule for every option: **public facts come from the server; the person's location stays on their device**, unless they choose to share it.

## What "good enough" means

- The right registration point: the one that is **open now** and **nearest**.
- Its hours today, and the time left before it closes.
- **Some kind of line** from here to there, with a distance and a direction. It does not need to be a turn-by-turn route.
- One tap to hand over to a real maps app for the route, when the person wants it.
- It works on a phone, in a browser and in the Team app, in under ten seconds.

## Why it is a good first case

It is small, urgent and useful to everyone. It has one public data set (two places, their hours), one private input (where I am), and every one of our environments is involved. What we learn here (public facts on the server, personal context on the device, a page that works everywhere) applies to the next cases: my next session, my dinner, the stand.
