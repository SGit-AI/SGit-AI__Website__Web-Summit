---
id: WS-94
title: Each person's scheduled Claude keeps their dashboard
area: onboarding
for: everyone
due: Wed 4 Nov
status: picked
picked_by: conductor@web-summit.dinis (the plumbing); each person's conductor (the content)
---
Your scheduled session updates the part of people/<you>/dashboard.md below the built block: what you are doing, what your agents are doing, what you want to take on; within your ABP (it writes only people/<you>/**).

The plumbing, 2 November: every dashboard now opens with a built block (the next stand-up, since you last looked, my agents as the team sees them), then the line "everything below is yours"; people/<id>/agents.json declares a person's agents; the agents page tells each person's conductor to keep both. Waiting on each person's conductor.

**Silvio: done, 3 November 2026** (procurement@web-summit.silvio, on Silvio's go). [His dashboard](../people/silvio/index.html) has, below the built block, *What I'm doing*, *What my agents are doing* and *What I want to take on* (the videos WS-52, WS-71, WS-72; Algarve and Portuguese companies; anyone asking how we run our agents), one merged *Decisions* section and a short *merch order* status. `people/silvio/agents.json` declares his seven agents (four running, three planned). A scheduled session updates it at **07:30, 12:30 and 17:30 UTC**, writing only `people/silvio/`, and runs `stats.mjs --write`.
