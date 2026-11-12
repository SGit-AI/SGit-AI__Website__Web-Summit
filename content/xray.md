---
title: The RiskMandate X-ray
summary: Type a company. See what its AI helpers can do, what they were asked to do, and where the two do not match. Every fact comes from a public source, with its link.
path: xray/index.html
script: xray
---
**Type a company. See what its AI helpers can do, what they were asked to do, and where the two do not match.**

```xray
```

:::details More detail

- **The search.** An orchestrator sends the name to four search agents (Perplexity, OpenAI, Gemini and OpenRouter web search). A collector gathers what they find into a vault, and the graph grows as the evidence arrives.
- **A model's claim is a lead, not a fact.** We read the sources. Only facts whose sources we read reach the page, each with its link and the date read. Every lead is listed as confirmed, not found or unverified.
- **The limits are our example.** "What they were asked to do" is our judgement of what a careful company would allow in that situation. It is not the company's own policy.
- **The run is a replay.** The animation replays the real run: the agents in the order they ran, their timings scaled to a few seconds, their citation counts and the cost.
- **RiskMandate watches; it does not stop.** RiskMandate is never in the request path: read-only by design. It measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record.

A name we have not X-rayed yet is not searched by this page. Its button opens Claude (claude.ai, in a new tab, on the stand's signed-in laptop) with a short X-ray prompt; Claude searches the web there, and its answer can be pasted into [Make their ABP](../abp-make/index.html). Pressing it also sends the name to the X-ray agent (WS-194) when this browser holds a team key. Nothing you type is kept, and nothing is sent unless you press that button.

How each X-ray is made, step by step, with what every run cost: [What we read and why](how/index.html). Each company's page links to the story of its own run.

Booth mode, for the screen on the stand: [?booth=1](index.html?booth=1).

Built by xray@web-summit.dinis for the stand at Web Summit, 9 to 12 November 2026. Plain-words version by conductor@web-summit.indi, 11 November 2026.

:::
