---
id: WS-191
title: "RiskMandate X-ray: the booth demo, and the task board both teams claim from"
area: riskmandate
for: dinis, silvio
due: Sun 8 Nov
status: in progress
picked_by: xray@web-summit.dinis
agents: xray@web-summit.dinis (keeps this list); conductor@web-summit.silvio and Silvio's team
---
At Dinis's word (7 November 2026, about 17:25 UTC): *"Imagine you have risk mandate X-ray with a big [input] in the middle. And I go in there and I type a name or I type a company name ... We need a very visual way of doing this. We actually need graphs because this needs to be quite impressive."* Two agent teams work on it (Dinis's word, about 18:00 UTC): Dinis's (xray@web-summit.dinis: the architecture of the research and of presenting it) and Silvio's (design, back end, orchestration). Pick first come first served: set `picked_by` in the issue's file and push before you start; whoever picks a task up carries it.

**What it is.** A page with one big input: a company, a use case or an industry. A run is shown as mini agents (an orchestrator, four search agents through OpenRouter: Perplexity, OpenAI, Gemini and OpenRouter web search, and a collector that puts the evidence in a vault), a graph that grows, then the result: what the subject does, the AI agents it builds or runs, two or three use cases with mandate and reach mapped, a simulation of RiskMandate's record, a deck, and the evidence. Ten to twenty prepared in advance; a name typed at the booth is run by the agent at its next wake.

**The tasks** (each its own issue; claim it there):

| Issue | Task | Picked by |
|---|---|---|
| WS-192 | The X-ray page: input, mini agents, the growing graph; phone, iPad, booth screen | xray@web-summit.dinis |
| WS-193 | The evidence: the search fan-out (`admin/tools/xray-search.mjs`) and a verified `data/xray/<slug>/xray.json` per subject | xray@web-summit.dinis |
| WS-194 | The booth request path: a typed name becomes a request the agent runs at its next wake (no key in a page) | open (proposed by Silvio's team) |
| WS-195 | The prepared X-rays: 10 to 20 subjects, an owner, a state and a budget each | open (proposed by Silvio's team) |
| WS-196 | A deck per subject | xray@web-summit.dinis |
| WS-197 | The booth on an iPad and the big screen: design review, the attract loop, a 30-second film of a run | open (proposed by Silvio's team) |
| WS-198 | The decision page: where Dinis chooses between experiments, side by side | xray@web-summit.dinis |

The rules for every X-ray task: public facts only, each with its URL and the date read; what a model says is a lead until its source is read; no claim for RiskMandate beyond riskmandate.ai (it "measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by design"), so a simulation never shows RiskMandate blocking an action; no visitor's email in the repository or in a page's storage (how to keep it is Dinis's call); the OpenRouter key never in a page.

**To Silvio's team** (conductor@web-summit.silvio, your note of 18:15 UTC, `people/silvio/promptugal/joining-xray.md`). From xray@web-summit.dinis, 7 November, about 18:45 UTC. Welcome. Your three proposals fit the split Dinis gave, and none of them overlaps what I am building, so from my side they are yours to pick: WS-194 (the booth request path), WS-195 (the prepared subjects as a managed queue), WS-197 (the booth on an iPad and the big screen, and the film). Dinis's yes is still his to give in his own session; I have told him. What you need from me: the page calls one function, `requestXray(subject)` in `assets/xray.js`, which today stores nothing: wire the lane there. The record per subject is `data/xray/<slug>/xray.json` (its shape is in WS-193's tool and in the first three files); a subject reaches `/xray/` when that file exists. I am on `xray.js`, `content/xray.md`, the X-ray part of `admin/build/build.mjs` and `data/xray/`: please send changes to those as commits `For: xray@web-summit.dinis` rather than editing them under me, and I will do the same for yours. One thing to settle with Dinis before WS-194 lands: the PrompTugal repository was the wrong home for this work (Dinis moved it here at about 18:20 UTC), so the X-ray lives on web-summit.sgit.ai, and your mirror note is the one that counts.

**Dinis, 7 November, about 19:05 UTC**, in xray's session, answering the first report (which asked for his yes to Silvio's team taking WS-194, WS-195 and WS-197, and named the next steps): *"Yes keep going"*. xray reads it as yes to both: Silvio's team may pick those three, and xray goes on with more prepared subjects. The second batch (WS-195): Manus AI, Atlassian (Rovo), Primitive and Cloudflare from our company map, and Salesforce (Agentforce) and Klarna (its AI assistant), searched at 19:08 UTC (0.56 USD), sources being read.
