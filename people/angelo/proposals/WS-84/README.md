# WS-84: an offline copy for the summit's wifi, a draft

By dev@web-summit.angelo, 4 November 2026, 22:35 UTC wake, from the conductor (5663389, item 3). **A draft: nothing in the shared build changes.** It covers which pages each of us needs without a connection at the summit, how they get there, and what it costs. Measured on a local build of `dev` at v0.2.351, in Chromium at phone width (390px), counting every file each page loads.

## What each of us needs offline

From our own pages, the briefs and how the week runs (the stand on Thursday 12 November, stand-ups at 13:00 and 18:00, meetings in between):

| Page | Why, at the summit | Weight (all files) |
|---|---|---|
| Your **command centre**, `people/<you>/app/` (Kanban, Needs me now, Summit days, Team) | What needs you, the day's schedule, who is where in the work | 1,163 KB, 22 files (Angelo's; its data file is 385 KB, about 107 KB compressed) |
| Your **dashboard**, `people/<you>/` | The classic view | 394 KB |
| Your **meet page**, `meet/<you>/` | To show someone on your phone, and the QR code on your shirt and card | 114 KB, 11 files |
| Today's **stand-up briefing**, `meetings/<id>/<you>/` | Read before the stand-up | 131 KB |
| The **start page** | How the team works, the essentials | 126 KB |
| The two **RiskMandate videos** (`assets/video/*.mp4`, self-hosted, no sound) | To play at the stand without wifi | 15 MB in all |

All of it, the videos aside, comes to about **1.5 MB** for one person. With the videos it comes to about 17 MB. Both fit easily in a phone browser's offline storage.

Not needed offline: anything sealed (it stays sealed, and opens only with your key, online or off), the board's full history, other people's dashboards.

**Not in our hands:** a stranger who scans a QR code has never loaded our site, so nothing is cached for them. Their phone needs a connection, and the meet page must stay light: 114 KB today. Of that, 31 KB is `me.json`, which a stranger never uses; dropping it for meet pages is a small saving worth taking.

## How: three ways compared

| | A. Offline storage in the browser (a service worker) | B. A downloaded bundle (a zip of pages) | C. Save as PDF |
|---|---|---|---|
| What the person does | Opens their pages once on good wifi; after that they open with no connection | Downloads a file, opens it from Files | Saves or prints pages |
| On an iPhone | Works in Safari, including from the home screen | Files previews one HTML page with no scripts: the command centre would not work | Works, but nothing is live |
| Stays current | Yes: each visit online refreshes it | No: one copy, as of the download | No |
| Interactive (filters, day tabs, now and next) | Yes | No | No |
| Build change | One script at the site's root, and one line on every page (shared code) | A zip step in the build (shared) | None (the stand-up PDFs exist already) |

**Recommendation: A, in two steps,** with C kept for the stand-up briefs that already exist as PDFs.

### Step 1: Angelo's command centre first (tier 1, his folder only)

A service worker that lives in `people/angelo/app/` controls only that page, and it caches everything the page loads, including the shared files it uses. It is built and released like the slices, inside his folder, with no shared change. It also proves the approach on a real phone before the rest of the team relies on it.

- **Network first for the page and its data,** falling back to the stored copy when offline. The command centre already says "As of vX.Y.Z, built N min ago"; offline, it adds "offline: the copy from <time>".
- **Stored once for the files that rarely change** (fonts, scripts, styles), and refreshed in the background.
- **A cache named after the site's version,** so a new release replaces the old copy and nothing stale piles up.
- **The two videos:** a "Keep the videos for offline" button rather than an automatic 15 MB download.
- **Sealed sending (slice 3), later:** a message written offline is sealed when written and queued, as the brief says.

### Step 2: everyone (shared code, after step 1 works)

The same worker at the site's root, so it can cover `meet/`, `meetings/` and `start/` too. Each person's list comes from `me.json`, which already holds their links: dashboard, command centre, briefing and profile. Each page gets one line to register it. This is shared code: Angelo or Dinis allow it (WS-34), and the build's keeper (conductor@web-summit.dinis) takes it or not.

### What to watch

- **Safari may clear stored pages** for a site that is not opened for a while. So the advice is: open your command centre on the hotel's wifi each morning; the copy then holds for the day.
- **The copy is only as fresh as the last time online,** so every page says how old it is.
- **Only public pages are stored.** They are public anyway, and nothing sealed is ever stored opened.
- **A worker that misbehaves is the risk:** a bug can serve an old copy. Step 1 limits that to one person's page, and the worker has an off switch (`?offline=off`), tested before release.

## Found while measuring (mine, tier 1)

- **My command centre loads its 385 KB data file twice,** once for the shared front end and once for my additions. Next wake I make my part reuse the copy the browser already has, which halves the first load on the venue's wifi.
- **Video pages also load a YouTube player** (about 14 MB of player files). Offline it fails quietly; the self-hosted MP4 above the player is the one to keep.

## What I need

- **The conductor, from Angelo:** a go for step 1. It is in his folder, so tier 1, but it changes how his page behaves on his phone, so I would rather he knows before it ships. I can build it on my next wake.
- **Later, for step 2:** WS-34's allowance and conductor@web-summit.dinis's yes, after step 1 has run on Angelo's phone for a day.
