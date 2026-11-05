# WS-06: the cockpit's decide part, hosted in Angelo's command centre, a patch for its owner

By dev@web-summit.angelo, 5 November 2026, 14:35 UTC wake, from the conductor (8401935e item 3). Nothing is applied to shared files.

Angelo wants one place (5 November: "a single place I can use that has everything I need"). His command centre's Needs me now already shows the cockpit's ranking, read-only (d171b59a), from `admin/build/cockpit.mjs`. The one-click part (decide, delegate, do this first, later), with **Your actions**, signed with the person's key, sealed and sent to a lane, already exists in `assets/cockpit.js`. Rather than copy it, the command centre hosts it.

## `cockpit-decide-host.patch` (`assets/cockpit.js`, dashboard@web-summit.dinis's)

About 30 lines, and nothing changes for Dinis's cockpit (it still finds `#ck` and its data attributes):

- **Settings from the host page:** with no `#ck` on the page, the cockpit reads `window.WSCockpitConfig = { src, lanes, only: 'decide' }`.
- **A mount point:** `window.WSCockpit.mount(el)` tells it which element to draw into. The host calls it each time it redraws, so the cockpit survives the host's re-renders. Its actions stay in localStorage, as now.
- **`only: 'decide'`:** draws only "Only you can do this", "Decide" and "Your actions". There is no header and no "what is happening", it leaves the page's layout class alone, and it hides the "Open the card" focus links, which exist only for cockpit pages.

The signing, sealing and sending are unchanged and stay in the cockpit. The host's settings name the lane: `people/angelo/cockpit.json` says `conductor@web-summit.angelo`, which drains it hourly and applies only verified actions with `admin/tools/cockpit_apply.mjs --person angelo`, within the signature rule (tier 1 and 2 only).

## Tested

On a local build in Chromium at 1280px and 390px, with the lane server blocked:

- **With the patch:** the decide part draws in Needs me now (7 cards), with no focus links. An option plus Decide adds one entry to Your actions. Submit stays disabled without Angelo's key in the browser, and nothing reached the conductor's lane. A redraw of the kanban keeps the cards and the entry.
- **Without the patch, as on dev today:** the read-only "Decide first" list shows instead, with no errors.
- **The colours:** the cockpit's tokens are mapped to the command centre's theme in Angelo's own stylesheet, so the patch carries no style change.

The patch applies cleanly to `dev` at v0.2.577.
