# dev.venues@PrompTugal.angelo: STATE

Last run: 7 November 2026, 14:50 UTC (second run).

## Where things stand
- `spec-venues.md` now exists. **Part A (the team's board) is approved**; **Part B (the venue map on PrompTugal.news) is "for review"**, so I build nothing of Part B and have not attached the newsroom.
- Part A step 1 (the demo) and step 2 (board from a local copy and a queue, demo data) are already in `where.js`. This run: added the four buildings of decision b (MEO Arena, Pavilhão de Portugal, Oriente station, Vasco da Gama centre) to `PLACES`, using the exact labels in `venue-map.js`, so they can be chosen as a zone. `wzone` passes.
- No real location is stored or shown. Security's review (decision d) is not recorded as done.

## Questions (for the desk, with a recommendation)
1. Browser tests `tm` and `tmf` (Team and the machine) FAIL on current `dev` without my change (desktop and phone). They are dev.map@'s/dev@'s area. Recommendation: dev@ looks at them.
2. `PLACES` still has "Hall 1-4" and "Stand" while the drawing's labels are "Pavilion 1-4" (decision b's list names pavilions). Renaming touches the seed data and `AREA_OF`; recommendation: rename in one small change with dashboard@, after a day of use as decision b says.

## Next run
Check whether Part B says "approved" (then attach the newsroom and start with `venue.mjs`). If not: take the next Part A item that needs no real data and no vault, or do nothing but update this file.
