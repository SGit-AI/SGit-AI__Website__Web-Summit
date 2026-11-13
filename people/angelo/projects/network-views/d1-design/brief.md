---
title: "D1: a stunning view of how tasks are handed over across Angelo's agent estate (design)"
item: network-views-d1
project: network-views
by: network-views.pm@PrompTugal.angelo
written: 2026-11-11
role: design
size: large
go: "Angelo, 11 Nov, in the lead's session: \"We need the designer to come up with a visual approach that is as stunning as the old agent network views or what Silvio has been doing in the command centre. I don't have an idea on how this can look like, but it needs to be nicely designed.\""
---
# network-views-d1: design

Wake routine: trig_01D39RAzsMdheFWbiBWjttdi

Your folder is people/angelo/projects/network-views/d1-design/ (where the library says people/angelo/pipeline/{ID}/, read this folder). Branch pool/network-views-d1.
The project: people/angelo/projects/network-views/BRIEF.md and STATE.md (sections 1 and 2: the old views and the records, already surveyed; do not redo that survey).

## Angelo's words
- 11 Nov, opening the project: "I don't want to retire them because they still tell important things, but I'd like to explore new ways of showing how tasks are handed over across the agents estate, including stuff that goes to Open Router, local models and including tasks that go through the handover market."
- 11 Nov, to this step: "We need the designer to come up with a visual approach that is as stunning as the old agent network views or what Silvio has been doing in the command centre. I don't have an idea on how this can look like, but it needs to be nicely designed."

## The bar: stunning, as good as these (study them running, not just their code)
- Angelo's old network views: people/angelo/app/live.js + live3d.js (hexagon graph, 3D), map3d.js (#collab), work*.js (the dumbbell of deliveries flying with typed icons), replay.js. Build the site (node admin/build/build.mjs) and open them in Playwright.
- Silvio's command centre (dashboard@web-summit.silvio): assets/cc/ (gamma.js, gamma.css, brain.js, brain.css, shell.js), people/silvio/ (gamma-ray/, dashboard-lab/), commits 92a078b ("the new look everywhere: GAMMA-Ray circuit, GRAVITY's own world, the top bar") and 78878f0 ("the Universe edge to edge"). Material only: never change Silvio's files.
- Keep the command centre's look (palette, type, the dark world); no new palette (skills/designer.md lesson).

## What the view must make felt in five seconds
Work flowing through the estate: from Angelo, to conductor.b@, to the project leads, to workers by slot (large and small), to sub-agents; and out of the account: to OpenRouter models, to local models (Ollama; none has run yet: show an empty, waiting place), and to other people's accounts through the handover market (none real yet: same). Each hand-off: who to whom, where it ran, when, cost. Live, and replayable for a past day.

## Brief
1. Look at the bar above, running, at 390 and 1280 px; say in design.md what makes them stunning and what to keep.
2. Propose three different visual concepts (not three layouts of one chart). Be bold: motion, depth, light, metaphor (for example a circuit, a solar system or orbits by where work runs, a river or particle flow, a constellation per task). Each must stay readable: who, where, cost on hover or tap; phone first; no sideways scroll; nothing explained by colour alone.
3. Each concept as a working mock: static HTML + JS (canvas, SVG or three.js from people/angelo/app/vendor or assets/cc if present; nothing hot-linked) in d1-design/mock/<a|b|c>/, animated, fed by a sample-handoffs.json you derive from the real records for one day (people/angelo/conductor-b/runs.md, projects/*/runs.md, pipeline/*/times.json, ledger/*.jsonl, pipeline/handover-p3-openrouter/usage.jsonl, pool/claims history, commit trailers); mark which rows are real and which are placeholders (local model, market). Screenshots at 390 and 1280 px (deviceScaleFactor 2), plus a short screen recording or frame strip if motion matters.
4. design.md: one phone screen first (the recommendation and why, two screenshots); then each concept: what it does well and badly, how it scales to a busy day (100+ hand-offs), how live and replay work; then what the build needs: the hand-off record shape (one JSON row: at, from, to, where, kind, item, cost_usd, tokens, source), which record feeds each field, components, sizes.
- **Not:** no change to the old views, people/angelo/app/, assets/cc/ or anyone's files; nothing published; no message to anyone.
- **Done when:** design.md, the three mocks and their screenshots are on pool/network-views-d1, the gate prints OK, STATE.md says "ready for Angelo's pick", and you fired the wake routine.
