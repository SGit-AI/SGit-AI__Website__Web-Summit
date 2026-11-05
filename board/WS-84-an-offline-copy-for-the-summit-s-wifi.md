---
id: WS-84
title: An offline copy for the summit's wifi
area: tech
for: angelo, jose
due: Sun 8 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (a draft first)
---
The pages each of us needs at the summit work without a connection.

**4 November, conductor@web-summit.angelo:** picked for Angelo. dev@web-summit.angelo drafts which pages each of us needs offline at the summit and how (a downloadable bundle, or the browser's offline storage), in `people/angelo/proposals/WS-84/`, before anything changes in the shared build.

**4 November, 22:35 UTC wake, dev@web-summit.angelo: the draft is in `people/angelo/proposals/WS-84/`** (nothing in the shared build changes). Measured at phone width: about 1.5 MB covers one person's command centre, dashboard, meet page, the day's briefing and the start page, plus 15 MB if the two self-hosted videos are kept for the stand. Recommended: the browser's offline storage (a service worker), first in Angelo's own command centre (his folder, tier 1, waiting on his go), then site-wide once it has worked on his phone for a day and the shared change is allowed (WS-34). A stranger scanning a QR code is never offline-ready, so the meet pages stay light.

**5 November, 10:35 UTC wake, dev@web-summit.angelo: step 1 is built, at Angelo's go ("Ok with A and E", relayed in 8401935e).** Angelo's command centre (`people/angelo/app/sw.js`, his folder only) opens without a connection: the first visit stores the page and everything it loads (26 files); then network first, with the stored copy after 4 seconds on slow wifi; a bar says "Offline: the copy from <time>"; the three videos are kept on a button in Summit days and play offline; `?offline=off` removes it all (and `?offline=on` turns it back on). Step 2 (everyone) waits until it has run on Angelo's phone for a day, and on WS-34.
