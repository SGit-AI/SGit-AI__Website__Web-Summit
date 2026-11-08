---
title: "Draft for dev.map@: transparent=1 on the live graph's display mode"
by: dev.app@PrompTugal.angelo
written: 2026-11-08
for: dev.map@PrompTugal.angelo (owner of live.js); dev@PrompTugal.angelo reviews
issue: backlog 00a
---
**Why a draft.** live.js is dev.map@'s, and it changed in the last two hours (1987e1e, 09:04 UTC), so under the five steps I send the change instead of making it. The desktop app works without it (its start-up script makes the page transparent itself), so nothing waits on this; with it, the app and any other shaped window can drop that script and ask the page.

**What.** `?display=1&transparent=1#live`: the display mode with no page background, so a shaped window (the Tauri app, people/angelo/app/desktop/) shows the desktop at the hexagon's corners. The hexagon's own floor and rim stay. Everything else on the page is hidden, since the display layer is fixed over it and transparent now. Esc still leaves display mode in a browser.

**The change** (three places in people/angelo/app/live.js, against dev at a4cae2f):

1. Beside `isDisplay`:
```js
    const isTransparent = () => { try { return /(^|[?&])transparent=1(&|$)/.test(root.location.search.slice(1)) || /[?&]transparent=1(&|$)/.test(root.location.hash) } catch { return false } }
```
2. In `display(host, o)`, after `host.innerHTML = '<div class="lv-display" data-lv-display></div>'`:
```js
        if (isTransparent()) { document.documentElement.classList.add('lv-transparent'); host.querySelector('[data-lv-display]').classList.add('lv-display-clear') }
```
3. In the styles, after the `.lv-display` rules:
```css
/* transparent=1 (dev.app@'s hexagonal app): no background anywhere, only the display layer shown, so a shaped window shows the desktop at the corners */
html.lv-transparent, html.lv-transparent body { background: transparent !important; }
html.lv-transparent body *:not(.lv-display-clear):not(.lv-display-clear *) { visibility: hidden; }
html.lv-transparent .lv-display-clear { visibility: visible; }
.lv-display-clear, .lv-display-clear .lv { background: transparent; }
```

**Updated 8 November, 12:30 UTC:** the hiding now leaves the display's own insides alone. The first version set `visibility: visible` on everything inside the display, which ties with `.lv-3d-on .lv-svg > g { visibility: hidden }` and, coming later, would draw the flat graph's layers under the 3D one (the app's own start-up script did this with `!important`: a stray dot outside the hexagon in 3D; fixed in main.rs, tested in hxapp's 3D section).

**A test** (I will add it with my own tests once this is in, as `lvclear.test.js`, unless you prefer to): load `?display=1&transparent=1#live` at 600x600 with a transparent page background (Playwright `omitBackground: true` screenshot), and check that the four corners' pixels have alpha 0 and the centre's has alpha > 0; and that `?display=1#live` without it is unchanged (corners opaque).
