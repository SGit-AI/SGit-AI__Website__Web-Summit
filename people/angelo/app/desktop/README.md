# Team and the machine, the desktop app (backlog 00a)

**Dropped, 8 November 2026**, at Angelo's word (desk be9b735): "it looks like we're going to drop the app and we'll simply
use the pop out feature we already have on the website. There's no need to put in place anything else." Unsigned installers
were blocked by Windows Smart App Control, and signing was not chosen. No installer is built or served; the CI drafts in
`drafts/` are withdrawn (nothing is asked of conductor@web-summit.dinis). What stays: the page (`page.mjs`, now the pop-out,
display mode and the iPad's and iPhone's Home Screen app), the web app manifest and icons, and the iPad page. The Tauri
source below stays as a record, unbuilt.

The live graph in a hexagonal window, for Windows and Mac (Tauri 2), plus the iPad's and iPhone's Home Screen app.
Spec: `people/angelo/proposals/live-map/spec-live-app.md`, with Angelo's decisions of 8 November in `people/angelo/backlog.md` (00a).
Kept by dev.app@PrompTugal.angelo; dev@PrompTugal.angelo reviews. The page for the team (downloads and the install guide):
https://web-summit.sgit.ai/people/angelo/app/desktop/index.html, built from `page.mjs`.

## What is here

| Path | What |
|---|---|
| `src-tauri/src/main.rs` | the shell: one frameless, transparent, always-on-top window loading the live page's display mode; a start-up script that clears the page's background and hides all but the graph; drag inside the hexagon to move; right-click for the menu (always on top, calm, 3D, size, open in browser, reload, quit); 3D is the pop-out's 3D view (the page's d3=1), remembered, and turns by itself (a drag still moves the window); calm holds the page to 15 frames a second for laptops on battery, remembered in the page's storage; clicks outside the hexagon pass through (a 40 ms loop checks the pointer against the hexagon) |
| `src-tauri/src/hex.rs` | the hexagon's hit test, no dependencies, with its unit tests |
| `src-tauri/capabilities/live-page.json` | all the live page may ask of the app: move the window, open the menu, and the control panel's window actions (size, always on top, open in browser, close), only from https://web-summit.sgit.ai/ |
| `src-tauri/tauri.conf.json`, `Cargo.toml`, `Cargo.lock`, `build.rs` | Tauri's settings; installers: a `.dmg` for Mac, an `.exe` (NSIS, per user) for Windows; unsigned |
| `icons/` | `icon.svg` (the source), `icon-1024.png` (Tauri's icons are made from it at build time, never committed), the web app's 192, 512 and Apple 180 px icons |
| `manifest.webmanifest` | the web app manifest: start_url is the display mode, scope the command centre |
| `page.mjs` | the download page and install guide (placed by `people/angelo/pages.mjs`); it reads `dl/builds.json` in the browser and links each installer under `dl/` on this site, or says "Not built yet" |
| `drafts/desktop-build.yml` | the CI workflow proposed to conductor@web-summit.dinis (GitHub's Windows and macOS machines; one "desktop-latest" release kept as storage only, then one deploy of the site) |
| `drafts/deploy-pages-step.md` | the one step proposed for `deploy-pages.yml`: the site's deploy copies the installers and `builds.json` into `dl/`, so they are served from web-summit.sgit.ai (the kit's "Our own website first") |
| `drafts/live-transparent.md` | the `transparent=1` option proposed to dev.map@ for live.js |
| `drafts/first-run-linux.png` | the first run of the real app, on Linux under a virtual screen, 8 November: only the hexagon drawn |

The app holds no data and no key, stores only its window's size and place (Tauri's window-state plugin) and changes
nothing on the page: every improvement to the live page reaches it at the next release.

## Build it yourself

Needs Rust (https://rustup.rs) and Node 18 or later; on Windows, the WebView2 runtime (already in Windows 11); on a Mac, Xcode's command-line tools.

```
cd people/angelo/app/desktop/src-tauri
npx @tauri-apps/cli@2 icon ../icons/icon-1024.png     # makes src-tauri/icons/ (not committed)
npx @tauri-apps/cli@2 dev                              # runs it
npx @tauri-apps/cli@2 build                            # installer in src-tauri/target/release/bundle/
```

On a Mac, a build for both kinds of Mac: `rustup target add aarch64-apple-darwin x86_64-apple-darwin`, then `build --target universal-apple-darwin`.

## Tests

- `rustc --edition 2021 --test src-tauri/src/hex.rs -o /tmp/hex && /tmp/hex`: the hit test.
- `people/angelo/app/tests/run.sh hxapp`: the download page at 1280 and 390 px, light and dark; the manifest and icons; the Home Screen app landing on the display mode; and the app's own start-up script run in Chromium on a transparent window (corners clear, hexagon drawn, Esc ignored; calm: about 15 frames a second on, 60 off, kept after a reload, the graph still moving, the menu told the setting; 3D, in step with the pop-out: the canvas draws, corners clear, not black, the same flat layers shown as in the browser's display mode, the setting kept after a reload and off going back to flat).
- Not tested yet: clicks through the corners and the transparent window on a real Windows and Mac (no such machines in the sessions); the Home Screen app on a real iPad (Angelo is asking someone with one).

**0.1.1 (8 November, Angelo's first try on Windows):** no scroll bar; Calm (15 frames a second) on by default, since the default 60 sent his fan up; a control panel: ⚙ and ✕ beside the logos at the hexagon's top, the ⚙ opening View (people ring, agents ring, work; 2D, 3D), Size (S, M, L) and Window (always on top, Calm, open in browser, reload, close). The right-click menu stays.
