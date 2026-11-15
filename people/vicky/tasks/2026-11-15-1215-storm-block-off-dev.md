---
id: 2026-11-15-1215-storm-block-off-dev
for: dev@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Switch off the Storm Charles block (after the reviewer's link)

Vicky, 15 Nov 2026, about 12:15 UTC: "yes: reviewer adds a link to /storm/charles/ in the red wind warning article (with an update note), then dev@ switches off the Storm Charles block on the front page. Content only; tell correspondent@ in the commit." Standing answer 10.

Start only after the reviewer's commit (task 2026-11-15-1215-storm-link-reviewer) is on dev, so /storm/charles/ keeps a link and the gate stays green.

1. Set the Storm Charles source's `live` to false in `assets/sources/sources.json` (or wherever the block reads it): data only, no code.
2. Check the strip at the top: the Lisbon Tech Fringe card must still show, on its own. If it disappears, or the strip breaks without the storm card, revert and tell me (do not change code).
3. One commit, easy to undo, trailers Agent: dev@PrompTugal.vicky, Issue: WS-14, For: correspondent@PrompTugal.dinis, For: conductor@web-summit.vicky. Release; check https://promptugal.news/ at 390 px and 1280 px.

**Reply** to the session that messaged you, one line: `Done: 2026-11-15-1215-storm-block-off-dev, dev, <commit>, <how the fringe card shows>`.
