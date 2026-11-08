---
title: "The live graph as an app in a hexagonal window, for every device"
by: dev.map@PrompTugal.angelo
written: 2026-11-08
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo
issue: WS-08
status: draft for Angelo's review (backlog 00a). Nothing built yet; the prototype comes next on workers/dev.map. Section "A live phone background" added 8 November (backlog 00a2), for his review.
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

## A live phone background with the 3D map (backlog 00a2, to explore; no build yet)

Angelo, 8 November about 12:00 UTC (9d018cc, pushed from riskmandate-angelo): *"Can we also explore a live background for the phone with the live 3d map of the agents?"* By dev.app@PrompTugal.angelo, for dev.android@PrompTugal.angelo to build on Android once Angelo approves. Sources read on 8 November 2026.

**Android: yes, a real live wallpaper.**
- What Android allows: an app may ship a live wallpaper, a `WallpaperService` whose `Engine` draws on the home screen's surface ([WallpaperService](https://developer.android.com/reference/android/service/wallpaper/WallpaperService): "showing a live wallpaper behind applications"). The app can open the system's chooser at its own wallpaper (`WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER` with `EXTRA_LIVE_WALLPAPER_COMPONENT`, [WallpaperManager](https://developer.android.com/reference/android/app/WallpaperManager)); the person confirms it there. No permission beyond the service's own `BIND_WALLPAPER` declaration.
- How it would draw: a wallpaper gets a surface, not a window, so the page in a web view is not the natural fit (not tried). I recommend drawing natively with OpenGL ES in the Android app: `live3d.js` is already a small renderer (nodes in one draw call, lines in two, moving dots in one), so its drawing ports in a few hundred lines of Kotlin, fed from the same `live.json` (names, lines and times only) and the same engine rules (the constant flow, the breathing, what is lit). One contract, two renderers, tested against the same recorded `live.json`.
- Battery and refresh: Android's rule is plain: "It is very important that a wallpaper only use CPU while it is visible" ([Engine](https://developer.android.com/reference/android/service/wallpaper/WallpaperService.Engine), `onVisibilityChanged`). So: draw only while visible, at the app's "calm" rate (15 frames a second), slow spin; fetch `live.json` at most once a minute and only while visible; a still frame in the chooser's preview (`isPreview`). The battery cost is to be measured on a real phone before Angelo uses it all day.
- Who: dev.android@ builds it in the Android app (its spec, section 4), after Angelo's go; dev.app@ writes the drawing contract (what is drawn, colours, timings) beside `live3d.js`.

**iPhone: no live wallpaper. What remains, plainly:**
- Apple gives apps no way to draw a wallpaper; the Lock Screen's only moving wallpaper is a **Live Photo**: "In iOS 17 or later, you can choose a Live Photo for your Lock Screen wallpaper ... so that your image plays whenever you wake up your device" ([Apple Support 120734](https://support.apple.com/en-us/120734)). It plays a few seconds on waking and then stands still; it is a recording, not live. We could make one from the replay's clip (0f3): a short loop of the 3D graph, saved as a Live Photo. A caveat: developers report that Live Photos made by apps with `PHLivePhoto` may show "Motion not available" as a wallpaper, with undocumented requirements ([Apple Developer Forums 798044](https://developer.apple.com/forums/thread/798044)); to try before promising it.
- A **widget** on the Home Screen or Lock Screen: a still of the graph, refreshed now and then. Apple: "a daily budget typically includes from 40 to 70 refreshes ... roughly ... every 15 to 60 minutes" ([Keeping a widget up to date](https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date)). Not moving; it needs an iOS app with a widget extension, and the one iOS app is Dinis's (PrompTugal/PrompTugal__App__iOS), so it is a request to another owner (tier 3 to hand over).
- The live option on an iPhone stays the page itself: the Home Screen web app in display mode, full screen, while the phone is in use or on a stand.

**Recommendation:** build the Android live wallpaper (the real thing) once Angelo says go; on the iPhone, try one Live Photo from the replay's clip when 0f3's clip exists, and leave the widget unless Angelo asks for it.

**Questions for Angelo:** (4) Go for the Android live wallpaper in the Android app (dev.android@ builds, dev.app@ the drawing contract)? (5) On the iPhone, is a Live Photo from the replay (moves a few seconds on waking, not live) worth trying, or skip it? (6) A widget would need the iOS app's owner: ask, or not now?

## Questions for Angelo (via the desk)

1. Tauri for the desktops, as recommended (small, open source, uses the system's web view)? The alternative, Electron, is larger but more familiar.
2. Is the iPad's best (a Home Screen app, full screen) enough, or try the picture-in-picture rectangle too?
3. When the prototype works: a repository of its own (your call), or keep it in this one?
