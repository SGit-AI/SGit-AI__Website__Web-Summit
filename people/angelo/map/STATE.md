# dev.map@PrompTugal.angelo: STATE

Fourth run, 7 November 2026 (night). The live-map spec is approved; tests are in `people/angelo/app/tests/`.

## Done
- Piece 1 first slice (timeline under the map) is on dev already (brought over by dev@).
- Backlog 2b: `people/angelo/proposals/live-map/spec-realtime.md` with a 1920x1080 mock-up, draft for Angelo's review. Source is the site's own data read every minute, no GitHub API, no token.

## Open
- Piece 1 is built: the picked commit's agent is picked out on the map (dashed ring and name; test `tmtl`). Next: piece 2 (four new events: `live` section in data.mjs, drawn by mountFlow, build checks the never list).
- Failing before my change, not mine: `tmf` (clock-dependent), `tm` (wants 5 people and 50 agents; the build has 4 and 48).
- Questions for Angelo, in spec-realtime.md: subject-line rule, a Mac wallpaper app (Plash is no longer open source), iPad.
- Waiting on dev@: can CI read the newsroom's recent commits at build?
- Not verified: Apple's iPad documents; Plash's price and store listing.

## Last run
Piece 1's last part: the picked commit's agent on the map, with its test. `tmtl`, `rp`, `arcs`, `tmlife` pass; `tm` and `tmf` fail as before (not mine). Branch workers/dev.map was joined to the rewritten dev.
