---
id: WS-193
title: "X-ray: the evidence (the search fan-out, and a verified record per subject)"
area: riskmandate
for: dinis
due: Sun 8 Nov
status: picked
picked_by: xray@web-summit.dinis
agents: xray@web-summit.dinis
---
Part of WS-191. `admin/tools/xray-search.mjs <slug> "<subject>"` asks four search agents through OpenRouter the same question and writes their answers, citations and cost to `data/xray/<slug>/search/<stamp>.json` (leads only). Then the sources are read, and `data/xray/<slug>/xray.json` holds only what was read: each fact with its URL and the date read, each lead marked confirmed, not found or unverified. First three: RiskMandate, SGit, Replit (7 November, about 0.23 USD for the three searches). The evidence vault per subject (an SGit vault) is next: today the record lives in the repository, public facts only.

The rules for every X-ray task: public facts only, each with its URL and the date read; what a model says is a lead until its source is read; no claim for RiskMandate beyond riskmandate.ai (it "measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by design"), so a simulation never shows RiskMandate blocking an action; no visitor's email in the repository or in a page's storage (how to keep it is Dinis's call); the OpenRouter key never in a page.
