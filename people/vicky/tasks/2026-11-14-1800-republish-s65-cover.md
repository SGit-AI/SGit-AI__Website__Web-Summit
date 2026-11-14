---
id: 2026-11-14-1800-republish-s65-cover
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Republish S65 with the designer's redrawn cover

Vicky, 14 Nov 2026, about 18:00 UTC: "the cover on S65 (best-number-one-3wx-loule) looks wrong on the live page. Please have the designer and the reviewer fix it: 1. The text looks squashed horizontally. Check the aspect ratio: the card should be 1200×630, but the image on the page is nearly square. Make sure the right file is used and it isn't stretched. ... Check it at phone width too, then republish and send me the link."

After the designer's Done (task `2026-11-14-1800-cover-s65-fix`):
1. Check the redrawn cover's figures and labels against the article, and that the three items match and the labels align.
2. Copy the four new PNGs over the old ones in `design/infographics/out/` (names unchanged) and update their `index.json` entries (`made`, `checked`).
3. Change the body image's version query so browsers fetch the new file (for example `?v=2026-11-14b`); it also keeps the page from stretching it (your 17:48 fix).
4. Re-sign, release, and check the live page **at 390 px and at desktop width**: the image's shown width and height must keep 1200:630 (about 358 x 188 at 390 px). Check the `/articles/` card and thumbnail too, and that `image:` (the social card) points to the new file.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1800-republish-s65-cover, reviewer, <live link>, <shown size at 390 px>`.
