---
id: 2026-11-14-1140-cover-wiring-reviewer
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Covers: where the designer draws, how the reviewer wires

Vicky, 14 Nov 2026, about 11:40 UTC (standing answer 71): "designer asks who wires a cover into the article. Keep designer to its own folder: it draws covers under desks/designer-vicky/covers/<slug>/, and the reviewer wires the cover into the article when it publishes. Tell both of them the exact field and path."

The designer leaves the cover in `desks/designer-vicky/covers/<slug>/` (four PNGs: `<slug>--paper--card.png` 1200x630, `<slug>--ink--card.png`, `<slug>--paper--thumb.png` 480x480, `<slug>--ink--thumb.png`; its `.svg` source; `notes.md` with the alt text and each figure's source). Check every number and label against the article and its sources, and the phone view at 390 px; a cover that fails is a Fix first for the designer (you do not redraw it).

**When you publish, you wire it in** (the same way you did for S63, 92480ea):

1. Copy the four PNGs, names unchanged, to `design/infographics/out/`.
2. Add four entries to `design/infographics/out/index.json`, one per file: `slug`, `theme` (paper or ink), `layout`, `size` (card or thumb), `file`, `"auto": false`, and `hand`: `by` designer@PrompTugal.vicky, `made` (date), `source` (the path in `desks/designer-vicky/covers/<slug>/`), `checked` (your check: what, against which sources, date, by reviewer@PrompTugal.vicky).
3. In the article's front matter: `image: https://promptugal.news/design/infographics/out/<slug>--paper--card.png`, `image_width: 1200`, `image_height: 630`, `image_alt: "<the alt text from notes.md>"`.
4. In the body, directly under "The story" (standing answer 50): `![<alt text>](https://promptugal.news/design/infographics/out/<slug>--paper--card.png)`, with its caption under it.

The `/articles/` thumbnail comes from `<slug>--paper--thumb.png` listed in `index.json`; the card and social preview from `image:`. Then re-sign and release as usual.

Put this in your own prompts file as a short line pointing to this task file (not a copy), commit (Issue: WS-14, For: conductor@web-summit.vicky), release, and add the ledger line.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1140-cover-wiring-reviewer, reviewer, commit <sha>.`
