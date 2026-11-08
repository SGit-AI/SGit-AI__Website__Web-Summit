# The Live AI Office: credits and licences

Audited by dev@PrompTugal.vicky on 8 November 2026, for Vicky Wang (decisions.md, standing answer 21). Every file the page uses is listed here, with where it came from and the licence it is under.

## The result of the audit

- **Every visual asset is original**, drawn for this page by code in this folder. No third-party image, sprite, tile, icon or font is used.
- **No Star Office UI art and no LimeZu art** is used, copied, traced or adapted.
- **No Kenney asset is used.** CC0 furniture was allowed, but all the furniture here is drawn by `make-sprites.mjs` instead, so there was nothing to credit.
- **No code is copied** from any other project. Star Office UI's design approach (work areas, characters walking between them, speech bubbles above them) was followed as an idea only, from Vicky's brief; its code and its art were not opened or used. So no MIT notice is needed; if code from an MIT project is ever added here, its copyright line and licence text go in this file and at the top of the copied code.
- **Commercial use is allowed** for everything here: the files are covered by this repository's licence, Apache-2.0 (`LICENSE` at the repository root), which permits commercial use, modification and distribution. No third party holds rights in any of them.

## Every file

| File | What it is | Source | Licence | Commercial use |
|---|---|---|---|---|
| `sprites/<agent>.png` (19 files: conductor, dashboard, pm, scout, researcher, curator, programme, journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections, reviewer, checker, logistics, designer, dev, inbox, vault) | One character per agent: 8 frames of 16x24 pixels (2 idle, 4 walking, 2 typing) | Original, drawn by `make-sprites.mjs` (dev@PrompTugal.vicky, 8 November 2026): each character set by its own skin tone, hair, clothes and a prop | Apache-2.0 (this repository) | Yes |
| `sprites/furniture.png` | Desk, chair, plant, sofa, coffee machine, bookshelf, whiteboard, boxes, mail tray, door | Original, drawn by `make-sprites.mjs` (same) | Apache-2.0 (this repository) | Yes |
| `make-sprites.mjs` | The code that draws every PNG above (Node's standard library only); the same output on every run | Original, written from scratch | Apache-2.0 (this repository) | Yes |
| `office.js` | The page's script: Canvas 2D, the rooms, the walking, the states | Original, written from scratch | Apache-2.0 (this repository) | Yes |
| `status.json` | The data, built at each site release by `office()` in `people/vicky/pages.mjs` | Generated from this site's own files and commit record | Facts, no creative content | Yes |

Floors, walls, badges and name tags are drawn by `office.js` at run time with plain rectangles and text; their colours are the site's own tokens (`assets/site.css`) or plain colour values in `office.js`. The text uses the reader's system fonts; no font file is loaded.

## To redraw the art

From the repository root: `node people/vicky/office/make-sprites.mjs`. It overwrites `sprites/` with the same files unless the script has changed.
