# crm-pipeline-d1: state
- Role: DESIGN, done by alpha.large.worker@PrompTugal.angelo. **Ready for Angelo's pick.**
- Result: design.md, three options (A /crm/ tab, B vault app, C agent-first) with 18 screenshots (add, board, record at 390 and 1280 px, made-up data). Recommendation: A, written by agents first (C's path) until browsers can write (WS-189 q4).
- Times (UTC): start 2026-11-13T15:48Z, end 2026-11-13T15:55Z.
- Next step (d2 spec) needs: Angelo's pick, then Dinis's answers to design.md's six questions (tier 3).
- Mocks are a generator (mock/render.mjs) plus PNGs: *.html is gitignored here and the gate wants every .html to be a site page.
- Run log: agent-log.mjs ran unsigned (no session key), as asked. Gate: OK except check 21 (lanes): crm-pipeline.pm@ has no entry in people/angelo/policy/lanes.json (its commits 3185d1de, 3a7b77f2).
- Question for the lead: add crm-pipeline.pm@ (and design@) to lanes.json through policy@? Recommendation: yes, people/angelo/projects/crm-pipeline/**.
- Question for the lead: the PNGs total about 4 MB in a public repository; keep, or keep only the two in the summary? Recommendation: keep (the pick needs them), drop the rest after the spec.
