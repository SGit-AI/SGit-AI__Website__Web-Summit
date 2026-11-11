---
item: handover-p3b-agent
project: handover-market, pattern 3b (Angelo, 11 Nov: "Would it take much to actually divert all our workers to OpenRouter, including patterns 1, 2 and 3?")
role: build (large), skills software-engineer, security, analyst; format web-summit-site
Wake routine: trig_01Sp6G7mUcG4f97btiJRmgK4
decided: by default (the lead), Angelo can reverse; the key's use is his go (6426198)
---
# Step: can a whole worker run on OpenRouter? Test an agent whose model calls go to OpenRouter

**Why.** Account B's usage is short ("allowed_warning" at 17:28). Pattern 3 (pool/handover-p3-openrouter, 1943369) showed plain model calls work (0.096 USD) but cheap models fail exact extraction. The real need: a worker with tools (files, git) whose model is paid through OpenRouter, so this account only runs a thin wrapper.

**Do.**
1. Find whether the Claude Code CLI in this container can be pointed at OpenRouter (ANTHROPIC_BASE_URL https://openrouter.ai/api and OpenRouter's documented Claude Code settings; read OpenRouter's public docs). The key for openrouter.ai is injected by this environment's proxy; where a key variable is required, give the placeholder `proxy-injected` for that command only. Never print or commit a key or header.
2. If it can: run one headless agent (`claude -p`, non-interactive, in a scratch copy of this repository, never pushing) on the task below, twice: once with an Anthropic Claude model through OpenRouter (a Sonnet-class one), once with a cheap model through OpenRouter that supports tool use. Record per run: model, OpenRouter cost (the reply's usage or OpenRouter's activity for the key), time, whether it finished, quality against your own check.
   Task for the inner agent: in people/angelo/pipeline/, list every file path named in ROLES.md, QUEUE.md, skills/*.md and formats/*.md and say for each whether it exists in this repository; output paths.json and a count. (Your own check: a 20-line script.)
3. If it cannot: say exactly what blocks it (error text), and the next best route (e.g. another open-source agent harness that speaks the OpenAI API), without installing anything beyond npm/pip packages.
4. agent.md, one phone screen first: works or not; cost per run on OpenRouter vs this account's platform cost for the wrapper; quality; recommendation (which model for which worker roles); the exact recipe a lead would use to start such a worker. Then the detail.

**Spend.** At most 2 USD of OpenRouter in total, stop before.

**Never.** Push anywhere but pool/handover-p3b-agent; contact anyone; change environment or settings; write to other repositories.

**Writes.** people/angelo/pipeline/handover-p3b-agent/ (agent.md, runs/ with each run's output and usage, STATE.md), your estimates and ledger lines.

**Done when.** agent.md and runs/ are on pool/handover-p3b-agent, the gate prints OK, STATE.md says "done" or why not. Last, fire the wake routine (fire_trigger trig_01Sp6G7mUcG4f97btiJRmgK4, text "handover-p3b-agent done").
