---
title: "Simulate the flow diagram on big pages"
item: prod-pipeline-a5
project: prod-pipeline
by: prod-pipeline.pm@PrompTugal.angelo (intake)
written: 2026-11-11
role: design
size: large
go: "Angelo, 11 Nov, in the lead's session: \"Can you spawn a couple workers to simulate how a few diagrams would look like on various pages from the website, choosing some small and some big pages?\""
---
# prod-pipeline-a5

Wake routine: trig_01MqHQ7CWqSnu5JGwYRpkQg5

**Angelo's words:** "Can you spawn a couple workers to simulate how a few diagrams would look like on various pages from the website, choosing some small and some big pages?" Two workers split it: prod-pipeline-a4 takes the **small** pages, prod-pipeline-a5 the **big** ones. You are the big one; do not do the other's pages.

**The design to simulate** is A3's team draft (option A, decided by default): pool/prod-pipeline-a3 at 8193766, people/angelo/pipeline/prod-pipeline-a3/ (team-draft.md, mock/strip.htm, mock/trace.htm, mock/flow.css). Keep its look and A2's limits (pool/a2-small-screens at 91d6bff, people/angelo/projects/prod-pipeline/a2-small-screens/findings.md and test/measure.cjs): the strip at most a third of the screen, text at least 12 px, targets at least 44 px, no sideways page scroll. Do not redesign; show how it behaves on real pages, and say where it strains.

**The website** is the Tech Fringe (today "Lisbon Fringe"): https://fringe.promptugal.news/ (public), source PrompTugal/PrompTugal__News__Fringe on dev (public; clone read only; change nothing there; do not run its code). Never read websummit.com.

**Your folder:** people/angelo/pipeline/prod-pipeline-a5/ (the workers' lane); write sim.md, shots/, mock/, data/ and STATE.md there only (plus your estimates and ledger lines). Nothing in people/angelo/projects/: the lane check refuses it.

## The task
1. **Choose three or four big pages** of the Tech Fringe site: long pages, or pages with a long history (many commits, many agents, many deploys), for example the home page or the programme listing, the graph (/graph/), the Wexio event page (the 77-step trace, team/angelo/traces/), a page built from many sources. Say why each counts as big: its height in screens at 390 px, and its number of steps.
2. **Its trace, from the record:** for each page, a trace in lisbon-fringe-trace/1 shape (see the Fringe's team/angelo/traces/README.md and A3's data shape) built from the Fringe repository's git history only (git log on the page's source files and the build files it depends on; authors, trailers, times; read-only git commands, no Fringe code run). For Wexio use the existing trace file. Mark what git cannot see as gaps. Save each as data/<page>.trace.json (cap a file at 2 MB; say if you cut).
3. **Simulate:** open the live page with Playwright (pre-installed) and inject A3's strip at its foot (and a "working now" variant on one page), filled from that page's trace; then A3's trace page for the same trace, closed and open. Screenshots at 320, 390 and 1280 px, plus 740 x 360 for one page; deviceScaleFactor 1 for checks, 2 for the screenshots in sim.md. Run A2's measure.cjs where it applies.
4. **Look hard at the big case:** hundreds of steps, dozens of agents, weeks of history (does "from asked to live" still mean something for a page that is rebuilt every day?), the "by agent" lanes with 20 or more lanes, Replay length, the size of the trace file a phone must fetch. Propose rules with thresholds (a window, e.g. the last change only; grouping; a cap on lanes; file size).
5. **sim.md:** one phone screen first (what it looks like on big pages, two screenshots, where it strains, the rules you propose); then per page: why big, the shots, the measurements; then the rules.

## Done when
sim.md, shots/, data/ on pool/prod-pipeline-a5; every page named with its URL and its source commit; the gate prints OK; STATE.md says "ready for Angelo's read".
