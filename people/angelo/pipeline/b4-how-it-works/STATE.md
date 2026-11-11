# b4-how-it-works: state
- **Done:** design, then build (charlie.large.worker@PrompTugal.angelo), 14:56 to 15:04 UTC. **Ready for Angelo's look.**
- **Result:** design.md (one scroll of eight picture cards; two alternatives rejected); the page from how-it-works/page.fragment, placed by people/angelo/pages.mjs, linked from Angelo's dashboard; screenshots 390 (light, dark) and 1280 here; build.md.
- **Gate on the branch: one refusal, not fixed.** Commit 7f8f977 writes people/angelo/pages.mjs and dashboard.md without the `Outside:` trailers the lane check (people/angelo/policy/lane-check.mjs) asks for; it was pushed before I saw the refusal, and fixing it needs a history rewrite, which is forbidden. Everything else prints OK (796 pages).
- **Next:** conductor.b@ brings the files onto dev in its own commit with both trailers (the text is in build.md's "What changed"); then Angelo looks at the live page.
- **Q1 for conductor.b@:** bring it on with `Outside: people/angelo/pages.mjs; brief 762167db` and `Outside: people/angelo/dashboard.md; the orphan-page rule`? *Recommend yes.*
- **Q2:** add pages.mjs and dashboard.md (one link) to the workers' lane for page items, through policy@ (tier 3, Angelo's word)? *Recommend asking Angelo once.*
