---
title: "b2-flow-reuse: what the flow view of each deliverable can reuse"
item: b2-flow-reuse
by: conductor.b@PrompTugal.angelo (intake)
written: 2026-11-11
role: research
size: large
skills: researcher, analyst (+ always-on)
format: web-summit-site
go: Angelo, 11 Nov, "Go on b2"
---
# b2-flow-reuse

## Angelo's words (11 November)
*"what I want to focus for the demos is a way to see the flow of operations that are behind the production of each deliverable."* And: *"we want to be able to track each and every agentic activity though commits, so that the accountant and any other future review can learn from all our operations."* He reads little text: *"That's A LOT of text to read."*

## The question
What can a view of the flow behind each deliverable (Angelo's note, then each step: who, which slot, when, how long, what it cost, the hand-offs, to the live result) reuse from what exists, and what is the smallest first version?

## Look at (all material, read only)
1. Ours: the work view, the live map and the dumbbell (people/angelo/app/: live.js, live.json, deliveries.json, kanban-core.js; people/angelo/map/; backlog items 0f2 and 0c5 in people/angelo/backlog.md).
2. Dinis's reporter traces: team/reporter/BRIEF.md, team/reporter/traces/ (README.md and the trace files, for example pt-news-newsroom-workflow.json and 2026-11-10-the-storm-incident.json), and any page that draws them.
3. Dinis's "visual virtual newsroom" ("the workflow is the picture") in PrompTugal/PrompTugal__News__Website: board/guidance/ (10 Nov, 12:40) and what was built for it since (clone it read only; say if you could not).
4. Lisbon Fringe's graph by conductor.fringe@PrompTugal.angelo: PrompTugal/PrompTugal__News__Fringe, work/05-graph.md, /graph/, api/v1/graph.json (read only).
5. What our pipeline records per deliverable today: people/angelo/conductor-b/runs.md, people/angelo/pipeline/*/times.json, people/angelo/ledger/, the commits of b0-library (alpha) and b1-team-spec (bravo) as real examples; people/angelo/pipeline/formats/trace.md and skills/trace.md.

## What to write
people/angelo/pipeline/b2-flow-reuse/research.md:
- **First, one phone screen (about 15 lines):** the recommendation (which base to build on, the smallest first version: one page showing one real deliverable from note to live), what it takes (size, who owns what), and the questions for Angelo with recommendations (tier 3 as questions, for example changing another team's view).
- Then one short block per source above: what it shows, its data format, where it lives, its owner, how ready it is, what we can reuse; each with path or URL and date read.
- Then the gaps: what our records lack for the view (for example cost per step, the platform's session cost), and the smallest change to fill each.

## Out of scope
Building anything; writing outside people/angelo/pipeline/b2-flow-reuse/ (and your estimates and ledger lines); automated reading of websummit.com.

## Done when
research.md on pool/b2-flow-reuse, every finding sourced, the gate OK, no em-dash, STATE.md says "ready for Angelo's read".
