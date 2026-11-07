---
id: WS-192
title: "X-ray: the page (one big input, the run as mini agents, a graph that grows as evidence arrives)"
area: riskmandate
for: dinis
due: Sun 8 Nov
status: picked
picked_by: xray@web-summit.dinis
agents: xray@web-summit.dinis (a sprint sub-agent builds, xray reviews)
---
Part of WS-191. `/xray/`: one big input in the middle, the prepared subjects under it. A run plays as animated mini agents (an orchestrator fanning out to the search agents, leads flowing to the collector, the collector filling the vault) and a graph that grows (the subject, its agents, use cases, what they can reach, the sources). A replay is labelled as the replay of a real run, from its record. A page per subject (`/xray/<slug>/`) readable without JavaScript, with the graph and the simulation on top. Works on a phone, an iPad and the booth screen; a booth mode cycles the prepared subjects when idle. Built from `content/xray.md`, `assets/xray.js` and `admin/build/build.mjs`.

The rules for every X-ray task: public facts only, each with its URL and the date read; what a model says is a lead until its source is read; no claim for RiskMandate beyond riskmandate.ai (it "measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by design"), so a simulation never shows RiskMandate blocking an action; no visitor's email in the repository or in a page's storage (how to keep it is Dinis's call); the OpenRouter key never in a page.
