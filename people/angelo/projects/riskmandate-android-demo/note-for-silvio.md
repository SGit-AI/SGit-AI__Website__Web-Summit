---
title: "Three fixes for the X-Ray page, found while putting it in the RiskMandate Android app"
by: riskmandate-android-demo.pm@PrompTugal.angelo, at Angelo's word
written: 2026-11-11
for: dashboard@web-summit.silvio, conductor@web-summit.silvio
issue: WS-203
---
**Angelo, 11 Nov 2026 about 23:45 UTC:** "Yes, send it to Silvio."

Angelo installed the RiskMandate Android app with the X-Ray page (https://web-summit.sgit.ai/people/silvio/app/index.html#xray) in an in-app browser and found these on his device. Our build worker reproduced all three in plain headless Chromium (touch on, 412x915 and 1280x800, 11 Nov 23:26 to 23:40 UTC), so they are in the page, not the app. We have not edited your page; these are suggestions for you to take or leave. The app loads the page live, so a fix on dev reaches the devices with no new app build. Evidence: `build3/build.md` and its screenshots (`menu-412.png`, `menu-1280.png`, `white-band-1280.png`) on branch `pool/riskmandate-android-demo-build3`.

1. **The menu button (top left) does nothing useful.** It toggles the class `cc-drawer` on `<html>`. Under 768 px, `assets/cc/app.css` (`@media (max-width: 767px)`) has `.cc-side { display: none }`, so only the dark scrim shows. Wider, the same class name matches app.css's `.cc-drawer` panel rule, so the whole page becomes a 560 px fixed panel on the right while the menu opens on the left. **Suggested:** show `.cc-side` under 768 px while the drawer is open, and rename the class put on `<html>` so it no longer matches `.cc-drawer`.
2. **A white band at the bottom of X-Ray and Gravity.** `<html>` keeps the site's off-white background (rgb 250,249,245) and only `<body>` is dark; the document is 32 px taller than the body (X-Ray: body 880 px, document 912 px at 1280x800; Gravity 860 and 892), so the off-white shows below. **Suggested:** a dark background on `html.cc-shell` (or the body at least the document's height).
3. **No way to switch to English on X-Ray.** X-Ray mounts Gravity with `lang: 'pt'`, and `assets/cc/xray.js` (about line 181) hides Gravity's PT/EN switch with `.lang { display: none !important }`; the page ignores the device language. Universo shows the switch. **Suggested:** show the PT/EN switch on X-Ray (or follow `navigator.language` when nothing is stored).

Also measured, for your information only: the X-Ray view has about 10,000 DOM nodes in animated SVG and ran about 31 fps in software rendering at 1280x800; Universo about 3 fps. On a tablet this is felt as lag; anything that lightens the animation would help. The page also logs an SVG path error on every view change (harmless).
