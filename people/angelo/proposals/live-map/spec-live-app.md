---
title: "The live graph as an app in a hexagonal window, for every device"
by: dev.map@PrompTugal.angelo
written: 2026-11-08
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo
issue: WS-08
status: draft for Angelo's review (backlog 00a). Nothing built yet; the prototype comes next on workers/dev.map.
---
## What and why

Angelo, 7 November about 23:10 (95500a0, pushed from riskmandate-angelo): *"experiment building a proper app that has the exagonal shape, for all devices"*.

Today the live graph is a page (#live), with a pop-out on Chrome and Edge and, from 8 November, full screen and a display mode. A browser window is always a rectangle, so the hexagon floats on a dark square. A real app can cut its window to the hexagon, with the desktop showing through the corners.

## The approach: one small shell that loads the page

The app holds no data and no key. It opens `https://web-summit.sgit.ai/people/angelo/app/index.html?display=1#live` (the display mode, which already reads `live.json` each minute, keeps the screen awake and recovers by itself) inside a window shaped like a hexagon. Every improvement to the page reaches the app with the next release; the app rarely needs a new build.

| Device | How | What I am not yet sure of (to verify in the prototype) |
|---|---|---|
| **Windows and Mac** | Tauri (Rust shell, the system's own web view; small installers): a frameless, transparent, always-on-top window; the page drawn on a transparent background, so only the hexagon shows; drag to move, a right-click menu to close, resize, or toggle always-on-top | that clicks pass through the transparent corners on both systems; the Mac's transparent window setting in Tauri 2 |
| **Android** | with dev.android@ in its app: a floating hexagon over other apps (the "display over other apps" permission, which Android asks the user to grant) showing the same page in a web view | how Android's current versions limit such windows; the battery cost |
| **iPhone and iPad** | Apple lets no app float over others, except picture-in-picture, which is a rectangle; widgets do not animate. The best that remains: the display mode as a Home Screen web app (needs a web app manifest and icons), full screen, and on an iPad a picture-in-picture rectangle from a video of the graph | whether a canvas-to-video picture-in-picture works in Safari on an iPad (to try) |

## Out of scope

Anything that reads data the page does not already read; any key, token or account; app store publishing (tier 3, Angelo's); a repository of its own (Angelo creates it, tier 3); signing certificates for Windows or Mac installers (Angelo's accounts, tier 3: unsigned builds show a warning on first open).

## The data, and who may see it

The same as the page: names, edges and times from the public record, nothing else. The app stores nothing but its window's size and place.

## The changes, by owner

- **dev.map@** (after approval): a `transparent=1` option on the display mode (no page background, so the shaped window shows the desktop at the corners); a Tauri prototype in `people/angelo/app/desktop/` on workers/dev.map (config and a few lines of Rust, no data); a web app manifest and icons for the iPad; a test that the transparent display mode draws nothing outside the hexagon.
- **dev.android@:** the Android floating window, from its own spec.
- **Angelo (tier 3):** a repository for the app if the prototype is kept; installing it on his machines; any store or signing.

## Risks

- **Unsigned installers** warn on first open; acceptable for Angelo's own machines, not for the public.
- **Always on top** can cover what he is working on: the window is small, movable and has a menu to turn it off.
- **Battery and heat** on a laptop: the display mode already pauses when hidden; the app adds a "calm" frame rate (15 a second).

## How we will know it works

- On Windows and a Mac: a hexagon on the desktop, nothing drawn outside it, clicks through the corners, always on top, moving with the record.
- On an iPad: the Home Screen app opens full screen in display mode.
- The page's tests still pass, and a new one for `transparent=1`.

## Questions for Angelo (via the desk)

1. Tauri for the desktops, as recommended (small, open source, uses the system's web view)? The alternative, Electron, is larger but more familiar.
2. Is the iPad's best (a Home Screen app, full screen) enough, or try the picture-in-picture rectangle too?
3. When the prototype works: a repository of its own (your call), or keep it in this one?
