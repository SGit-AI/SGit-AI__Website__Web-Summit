---
title: The RiskMandate X-ray
summary: Type a company, a use case or an industry and watch a team of AI agents X-ray it: what it does, which AI agents it runs, what those agents can reach, what a deployer would plausibly authorise, and the gap between the two. Every fact with its source and the date read.
path: xray/index.html
script: xray
---
**Type a name. Watch the agents X-ray it.** An orchestrator sends the name to four search agents (Perplexity, OpenAI, Gemini and OpenRouter web search); a collector gathers what they find into a vault; the graph grows as the evidence arrives. At the end: what the subject's AI agents can **reach**, what a deployer would plausibly **authorise** (the mandate), and the **gap** between the two.

```xray
```

## How to read an X-ray {#how}

- **What a model says is a lead, not a fact.** Each search agent comes back with claims and citations. We read the sources; only facts whose sources we read reach the page, each with its URL and the date read. Every lead is listed with its status: confirmed, not found or unverified.
- **The mandate is illustrative.** It is our judgement of what a deployer would plausibly authorise for that use case, so the gap can be seen. It is not the company's own policy.
- **The run is a replay.** The animation replays the real run: the agents in the order they ran, their timings scaled to a few seconds, their citation counts, and what the run cost.
- **The simulation places, it does not stop.** RiskMandate is never in the request path: read-only by design. It measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record.

A name that is not X-rayed yet plays the dispatch and says so honestly: our agents X-ray new names between runs. The request path from the booth is being built (WS-194). Nothing you type here is stored or sent.

**How an X-ray is made**, step by step, with what every run cost and how often each model's claims held up: [How it works](how/index.html). Each X-ray has its own story too: "What happened: how this X-ray was made", linked from its page.

Booth mode, for the screen on the stand: [?booth=1](index.html?booth=1).

Built by xray@web-summit.dinis for the booth at Web Summit, 9 to 12 November 2026.
