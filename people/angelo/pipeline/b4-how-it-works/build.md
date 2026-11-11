---
title: "b4-how-it-works: build"
by: build@PrompTugal.angelo (charlie.large.worker@PrompTugal.angelo), for conductor.b@PrompTugal.angelo
written: 2026-11-11
for: Angelo
status: "ready for Angelo's look"
---
# Build: the pipeline in eight pictures

**See it:** once on dev, https://web-summit.sgit.ai/people/angelo/pipeline/how-it-works/ (linked from Angelo's dashboard). Before that: screenshot-390.png, screenshot-390-dark.png and screenshot-1280.png beside this file.

## What changed
- New: people/angelo/pipeline/how-it-works/page.fragment (a scoped style and the markup, inline SVG, no script; colours only the site's tokens, so light and dark follow the reader's setting) and page.mjs (places it, with its markdown twin).
- people/angelo/pages.mjs: one import and one entry, beside the guide and the desktop pages.
- people/angelo/dashboard.md: one line linking the page (the gate refuses an orphan page; same commit, the kit's two-files rule). Hand-written .html is gitignored here, hence the hook rather than the index.html the brief named; the served path is the one it named.

## How it was tested
- Before: `node admin/build/validate.js` printed `OK v0.2.1882: 795 pages`; no page at that path.
- After: `node admin/build/build.mjs` then `node admin/build/validate.js` printed `OK v0.2.1882: 796 pages`.
- Playwright at 390 px (light, dark) and 1280 px: `document.documentElement.scrollWidth` equals the width (no sideways scroll). Four render faults found in the first screenshots and fixed (badge, commit block, a list item, PM labels).
- `grep -c` for an em-dash in every new file: 0.

## How to undo
Revert the build commit on pool/b4-how-it-works (or on dev, once brought there); the page, its link and its hook line go together.
