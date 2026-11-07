---
title: "The live map in real time: a monitor mode for the stand and a wallpaper mode for Angelo's desktops"
by: dev.map@PrompTugal.angelo
written: 2026-11-07
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo
issue: WS-08
status: draft for Angelo's review. Nothing is built before his go. An addendum to spec-live-map.md (approved), which puts live updates between releases out of scope.
---
## What and why

Angelo, 7 November (7faae7c, 99e287e, 3092f8b, all pushed from riskmandate-angelo):
- a real-time mode in Team and the machine that shows what is exchanged as it happens, kept open on a monitor at the stand during the summit;
- the same view as an animated desktop background on Windows, Mac and iPad;
- *"It doesn't need to be exactly real time … it can be a few minutes late as long as it's always on and accurate."*

That last word replaces the desk's first source (GitHub's API at view time). This spec uses the site's own published data only.

## The source: our own site, read again every minute

- The open page re-reads the site's published map data about every 60 seconds (with a small random spread, so many screens do not call in step). Events newer than its last read are animated as they arrive.
- **No GitHub API at view time, no token, no request limit.** The monitor and every wallpaper read the same files from our own site. A GitHub token question does not arise (so nothing for Angelo to decide in tier 3).
- **Freshness is the release's.** Releases follow every push to `dev` within minutes, so the map is a few minutes behind git, which is what Angelo accepted.
- **The newsroom's part** comes today from dev@'s snapshot (`people/angelo/app/promptugal.json`, refreshed when dev@ wakes, so up to an hour old). Proposal, to agree with dev@: the release build (CI) reads the newsroom's recent commits, public and read-only, as the snapshot tool does, so both sides are minutes fresh. `promptugal-snapshot.mjs` already works from a clone; the open points are CI's access to that repository and the build's time. Until then the stand shows the newsroom's side "as of" its snapshot. Workers' branches likewise only if the build can fetch them; otherwise the map shows what reached `dev`.
- **Data shape:** a small file, `live.json`, of the last 48 hours of events (sender, `For:` names, time, kind, subject line), cut from the full data at build. The page keeps only the window it draws, so memory stays flat.

## Display mode: `?display=1`

For a screen left open for days.
- Full screen, type readable from a few metres (mock-up at 1920x1080: ![the monitor mode](mockup-realtime.png)), a feed of the latest events beside the map, no controls.
- **Always on:** a Wake Lock request so the screen does not sleep (where the browser allows it, and re-requested when the page becomes visible); a failed read is skipped and retried on the next tick, never an error screen; recovery after sleep or lost Wi-Fi on the `online` and `visibilitychange` events; a full reload every 6 hours at a quiet moment, to return all memory.
- **A quiet line,** "as of 19:24", shows the data's time, so a quiet night never looks broken. If the data is over 30 minutes old the line turns amber and says so.
- **Accurate:** every event is a real commit with its real time. On opening, the last hour plays quickly and is labelled "replay". Nothing is invented to fill a quiet screen.
- Reached from `/team/map/` and from Angelo's command centre (a "Display" link beside the layouts).

## Wallpaper mode: `?wallpaper=1`

Calmer and dimmer than display mode: frame rate capped at 15, paused when the page is hidden or covered, no controls, no feed text (the picture only), `pointer-events: none` on the page so clicks pass through where the wallpaper app allows it.

**How each device shows it** (claims checked at their sources on 7 November; installing anything on Angelo's devices is his call):
- **Windows: Lively Wallpaper.** Free, open source (GPL-3.0), on the Microsoft Store (Windows 10 1809 or later); its "Webpage" wallpaper type shows a URL. Source: github.com/rocksdanister/lively.
- **Mac: Plash.** Makes a website the desktop wallpaper. *Correction to the desk's brief:* its readme says "The app is no longer open-source", so "free and open source" does not hold; its price and store listing were not on the page I read, so Angelo should check them in the App Store before choosing. Source: github.com/sindresorhus/Plash. Alternative if he prefers open source: not researched.
- **iPad: no live web wallpaper exists** as far as I could establish (unconfirmed: the Apple documents were not read this run). The nearest is the page as a full-screen web app on the Home Screen: needs a web app manifest and icons (`display: standalone`), then Guided Access and auto-lock off for a stand screen. That is built only on his go.

**Requests:** wallpapers read the same `live.json` as the monitor, but every 3 minutes instead of every minute and not at all while hidden. Polling a few minutes apart against our own site has no limit to spend, and keeps the monitor the closest to real time. Recommendation: this one. (Polling GitHub's API from many devices on the stand's shared address would spend the 60 requests an hour, per address, in minutes. That is why it is rejected.)

## What a stranger may see (the stand's visitors)

Names, edges, times and commit subjects, all already public in this repository. Never: a message's, sealed record's, vault file's or lane's content, a secret or a location; key handovers only as "a key handed over" (decision 1 of the live-map spec). **Subject lines need a rule:** they are free text and some name a person's meeting or whereabouts. Recommendation: the feed shows a subject only if it passes the build's never list and contains none of: a street, a hotel, "meeting at", "lunch", "dinner"; otherwise it shows "a commit by dev@ for desk.conductor@", no subject. The wallpaper shows no subjects at all.

## Out of scope

Anything fetched from GitHub or a vault at view time; any token; a server; locations; installing on Angelo's devices.

## The changes, by owner

- **dev.map@** (after approval, on its branch, dev@ reviews): `live.json` in `data.mjs`; the one-minute reader and the animation in `replay.js`; `?display=1`; `?wallpaper=1`; a short install guide per device as a page under the map; for iPad, the manifest and icons.
- **dev@PrompTugal.angelo:** whether CI can read the newsroom's commits at build; keeps the snapshot tool.
- **Angelo (tier 3):** installing Lively or Plash and the iPad app on his devices; the iPad's Guided Access.

## Risks

- **Burn-in and heat** on a stand screen: the display mode dims its background and moves nothing static; wallpaper mode caps the frame rate.
- **A subject line leaks something:** the rule above, plus the gate's test; one commit reverts it.
- **The newsroom's side is an hour behind** until CI reads it.
- **A browser refuses the Wake Lock:** the stand's screen needs its power settings set once (the install guide says how).

## How we will know it works

- A four-hour run at 1920x1080 with a fake feed (a Playwright test, a new one in `people/angelo/app/tests/`): memory flat (heap within 10% from the first hour to the last), no error screen when reads fail for 20 minutes, recovery within one tick after the network returns.
- For a sample hour, the feed's events match `git log` for that hour, one to one.
- The normal view still passes `tm`, `tml`, `tmfs`, `tmf`, `tmlife` at 390 px, and the display and wallpaper modes pass at 1920x1080 and 390 px.
- Questions for Angelo (the desk records them): (1) the subject-line rule above; (2) a Mac wallpaper app, since Plash is no longer open source; (3) whether the iPad's nearest option is enough.
