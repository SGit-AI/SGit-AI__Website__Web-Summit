---
title: "WS-181: the venues: the team's board (approved), and the venue map on PrompTugal.news (for review)"
by: dev@PrompTugal.angelo, with vault@PrompTugal.angelo (vaults.md)
written: 2026-11-07
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo; security@web-summit.dinis reviews before any real location is stored
issue: WS-181
status: "Part A approved by Angelo, 7 November 2026 (daca6e6c: \"All as recommended\"; 592d1096: \"Agreed on C\"). Part B is for review; dev.venues@ builds nothing of Part B before it says approved."
---
This spec gathers WS-181 into one place for dev.venues@PrompTugal.angelo. The detail stays where it was written: the page and its two modes in [page.md](page.md), the two vaults and the sync in vault@'s [vaults.md](vaults.md). Where they differ, this spec and Angelo's decisions win.

## What and why

Angelo's notes of the 12:00 stand-up, 6 November: *"coordinate the team and our logistics using the page Angelo has been putting together in the command center, we need to know where everybody is"*. It works in two vaults (public, private) and two modes (local storage first, synced to the vaults). On 7 November (c7d26a01) he added: *"integrate the venues map with the feature offered in the promptugal news website, with the public section and the private info about our locations only available to us (optionally public if we decide to be trackable)."*

## Part A: the team's board (approved)

**Angelo's decisions, 7 November** (daca6e6c, "All as recommended"; 592d1096, "Agreed on C"):

| | Decision |
|---|---|
| a | **The whole team sees** where people are. Anyone opts out by setting nothing. |
| b | **The places:** dev@'s list in page.md, adjusted after a day of use (now the venue drawing's buildings: the four pavilions, the MEO Arena, Pavilhão de Portugal, Oriente station, the Vasco da Gama centre; and, off the map, hotel, in town, off). |
| c | **The private vault is deleted by 14 November** (`sgit vault delete-on-remote`); nothing copied from it. |
| d | **security@web-summit.dinis reviews** before any real location is stored (Angelo's go for this handover). |
| e | **The step-1 demo first**, with no real data (built: `#where` in Angelo's command centre). |
| C | **Zones by default; an exact pin only by a person's choice, each time** (built in the demo on 7 November, 4dead814). |

**How a line and a pin are stored, and who sees them** (vaults.md, "Zones by default"):
- **A line:** `{person, place, next, until, at}`, where `place` is a zone from the list, never coordinates.
- **An exact pin:** taken only when the person chooses it, for that one update. It is stored beside the zone as `pin: {lat, lon, label, until}`, with `until` at most a few hours ahead. It is signed with the person's site key like the line, never remembered as a default, and never offered for a home or a hotel.
- **Who sees it:**
  - Lines and pins: the team only (the private vault's readers).
  - The public layer: never a person's line or pin.
  - A person who opts in to being public (Part B) publishes a zone only, never a pin.
- **History:** a vault keeps every past state, so every pin stays readable to the team until the vault is deleted (decision c).

**What is built, and in what order:**
1. **Done, the demo:** `people/angelo/app/where.js`, by dev@ and dashboard@PrompTugal.angelo. It has the stylised venue drawing from OpenStreetMap's outlines (`venue-map.js`, ODbL), the two modes on one device, zones by default and the deliberate pin. Its test is `people/angelo/app/tests/wzone.test.js`.
2. **Next, dev.venues@, demo data only:** the board read from a local copy and a queue, ready for the vault (page.md section 3). No real location yet.
3. **After security's review and vault@'s own SG/Send token:** the private vault.
   - vault@ creates the vaults.
   - The page reads them with the person's key, through a site script in `assets/`, not Angelo's folder. The gate's rule 22 (WS-164) keeps the keyring and IndexedDB out of people's scripts.
   - Signed, sealed updates go over the append lane.
   - That site script is shared code. The five steps say who owns it: the page's keyring is Dinis's.
4. **By 14 November:** the vault is deleted, and the view says so and clears the local copy.

## Part B: the venue map on PrompTugal.news (for review)

**What is there now:**
- The newsroom has the summit's events (`newsroom/build/features/events.mjs`, `days.mjs`) and the reader's **My day** (`features/schedule.mjs`, `assets/schedule/schedule.js`, `content/my-day.md`).
- My day keeps picks in the reader's browser and, if they open one, in their vault. The gate forbids `schedule.js` any `fetch`, XHR, beacon or socket: the picks never leave the browser.
- There is no venue map.

**What I propose:**

1. **A public venue map page, `/summit/venue/`:**
   - The same stylised drawing as Angelo's Where, from OpenStreetMap's outlines with the ODbL attribution.
   - Each building is labelled with what the newsroom knows is there, from its events data: the stages, the pavilions' themes and today's sessions.
   - No people on it, ever.
2. **"Where is it?" on every event page:** the event's building, picked out on a small copy of the map, from the event's stage.
3. **My day on the map:** a reader's picks drawn on the venue map, in their browser only. This keeps the newsroom's own rule: no network call for the picks.
4. **The team, not in this version.** Our whereabouts stay in Angelo's command centre (Part A), for the team only.
   - Later, two options, each its own decision: (a) a team layer on the newsroom map for a reader who opens the team's private vault with their own key; (b) a person who opts in to being public ("trackable", Angelo's word) published as a zone only, through the public vault.
   - I recommend neither before security's review. If (b) comes, it should be per person, per day, and off by default.

**The data, and who may see it:**

| What | Where it comes from | Who sees it |
|---|---|---|
| The venue drawing | OpenStreetMap (ODbL), simplified by `people/angelo/tools/venue-map.mjs` | everyone |
| Buildings' contents | the newsroom's events data | everyone |
| A reader's picks on the map | their browser (and their vault if open), as My day | that reader only |
| The team's whereabouts | the private vault (Part A) | the team only; never on PrompTugal.news in this version |

**The changes, by owner** (decision 2 of the new-agents spec: dev.venues@ changes the newsroom's `dev` directly, under the five steps, its gate and its `CLAUDE.md`, For: dev@PrompTugal.dinis):
- **A new feature, `newsroom/build/features/venue.mjs`:**
  - the page `/summit/venue/` and its markdown twin;
  - the "Where is it?" block on event pages;
  - an `llms` line;
  - a gate check like schedule's: `assets/venue/venue.js` makes no network call beyond reading its own static data file.
- **The data:** `assets/venue/venue-map.js`, the drawing data, copied from `people/angelo/app/venue-map.js` with its attribution. One source is better, so `venue-map.mjs` writes both.
- **The links:** `assets/venue/venue.js` and `.css`, and links from the summit pages and My day.
- **Design:** the newsroom's designer@ and design@ own the look; dev.venues@ follows their brand rules.

## Out of scope

- Real locations before security's review (decision d).
- The phone's own location: never asked for, on either site.
- Any person on the public map (Part B, item 4).
- The live map of our activity: its own spec, `people/angelo/proposals/live-map/`.

## Risks

- **A pin is still a coordinate.** It is kept only by choice, expires in hours, and is seen only by the team, but the vault keeps its history until deletion (decision c). security@'s review should confirm that the expiry and the deletion are enough.
- **Two copies of the map data**, here and in the newsroom. One generator (`venue-map.mjs`) writes both, and dev.venues@ checks they match at each run.
- **Event places are only as good as the newsroom's data.** A stage with no building stays unplaced rather than guessed.
- **Three agents in `where.js`** (dev.venues@, dashboard@, dev@): the five steps, small changes, and the tests before each commit.

## How we will know it works

- **Part A:** the demo keeps passing `wzone.test.js` and the other tests at 1280 and 390 px, light and dark. No real location is stored before security's review is recorded here. The vault's deletion by 14 November is recorded here too.
- **Part B** (after approval):
  - `/summit/venue/` and the event blocks pass the newsroom's gate, including the no-network check.
  - Every building with a stage in the events data is labelled.
  - A reader's picks show on the map and never leave the browser, checked as schedule.js is.
  - Tested at both widths and themes.
