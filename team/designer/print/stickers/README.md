# RiskMandate laptop stickers

By designer@web-summit.indi, 4 November 2026, from Dinis's three asks, relayed by Indi: a corporate sticker with the logo and the logo text; "a bit of infographic/animation stuff"; and a funny cartoon. All four follow https://riskmandate.ai/brand (read again on 4 November). The seal and the lockup are the supplied files in `../concepts-rm/brand/`, never redrawn, recoloured or crowded. The colours are the brand's tokens only.

| Sticker | Shape, cut size | What it shows | Colours |
|---|---|---|---|
| `corporate` | rounded rectangle, 100 x 40 mm | The brand's own lockup (the knockout seal + "RiskMandate", from `riskmandate-lockup-dark.eps`), then AGENT BEHAVIOUR POLICIES | container #161615, warm white #F7F6F2, faint #8A8780 |
| `gap` | circle, Ø 76 mm | Reach (dashed), the mandate inside it (green), and the gap between, striped in gold | container, green #1A7F5A, lighter green #22C55E (dark only), gold #B45309 as stripes, warm white |
| `steps` | rounded rectangle, 100 x 40 mm | KNOW their reach, DEFINE their mandate, CONTROL the gap: three plain icons and two arrows | container, lighter green, green, warm white, faint |
| `cartoon` | rounded square, 76 x 76 mm | Our agent, grinning, its very long arm in the cookie jar marked PROD. "Trust your agents. Then check." (a line from `content/design.md`) | warm white ground, ink #0D0D0C, green, lighter green only on the robot's dark screen, gold for the lid and cookies |

- **Files:** `<name>.svg` and `<name>.pdf` are the print files. `<name>.png` is a preview at 300 dpi, cut to shape. `stickers-overview.pdf` is A4 landscape: page 1 shows the stickers at real size on a laptop lid; page 2 is the print proof.
- **Animation:** `gap-animated.svg` is the gap sticker moving, for screens (a slide, the stand screen, a web page). The stripes turn, the reach line runs and the mandate breathes. It is not for print.
- **For the printer:** die-cut vinyl, matt. Each SVG and PDF has the artwork with 2 mm bleed past the cut, and the cut line on its own layer (`<g id="cutline">`): a hairline in magenta, the spot colour CutContour, which sticker printers cut on and never print. Every letter is outlined. Text and logos sit at least 2.5 mm inside the cut.
- **Brand rules kept:**
  - The seal is used only as supplied, in the knockout cut on dark, with half its width clear on every side.
  - Gold is used sparingly: stripes, a lid, cookies.
  - The lighter green only ever sits on dark.
  - No other brand, no Web Summit logo.
- **Checked by `make-stickers.py`:** every text item is inside the cut's safe area, at 7 pt or more, with WCAG AA contrast, and nothing sits in the seal's clear space.
- **Remake:** `FONTS=<dir> python3 make-stickers.py`, then `node render-stickers.mjs`.
- **Not yet decided:** quantities and the printer (Silvio's print order).
