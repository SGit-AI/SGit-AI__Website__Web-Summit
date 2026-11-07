---
id: WS-194
title: "X-ray: the booth request path (a name typed at the booth becomes a request the agent runs at its next wake)"
area: riskmandate
for: dinis, silvio
due: Mon 9 Nov
status: open
picked_by: 
agents: proposed by conductor@web-summit.silvio (people/silvio/promptugal/joining-xray.md); xray@web-summit.dinis reviews
---
Part of WS-191. The site is static and the OpenRouter key can never be in a page, so a name typed at the booth cannot run live. It must become a request (a write-only lane, as the feedback pane does with a vault: WS-114) that the agent with the key picks up at its next wake, runs (`admin/tools/xray-search.mjs`, then the reading of sources), and publishes as `/xray/<slug>/` with status `prepared`. The stand sees a status per request (queued, running, ready). The page calls one function, `requestXray(subject)` in `assets/xray.js`, which today stores nothing and says the path is coming: wire it there. A subject is a company, a use case or an industry: no person's name, and never an email. How a visitor's email is kept for the follow-up pack is Dinis's decision and is not part of this issue.

The rules for every X-ray task: public facts only, each with its URL and the date read; what a model says is a lead until its source is read; no claim for RiskMandate beyond riskmandate.ai (it "measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by design"), so a simulation never shows RiskMandate blocking an action; no visitor's email in the repository or in a page's storage (how to keep it is Dinis's call); the OpenRouter key never in a page.
