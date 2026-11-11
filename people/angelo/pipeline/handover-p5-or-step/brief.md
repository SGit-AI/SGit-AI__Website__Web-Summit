---
item: handover-p5-or-step
project: handover-market (Angelo, 11 Nov: "Yes, go ahead with the OpenRouter worker")
role: build (large), done by an inner agent on OpenRouter; the session (wrapper) checks, commits and pushes
Wake routine: trig_01Sp6G7mUcG4f97btiJRmgK4
---
# Step: one real step run end to end by a worker on OpenRouter

**Why.** Account B's usage is short. pool/handover-p3b-agent (1c5a584) proved a headless `claude -p` worker runs with every model call on OpenRouter (Sonnet 5.5: correct, 0.14 USD); its recipe is in people/angelo/pipeline/handover-p3b-agent/agent.md on that branch. Now one real step, ending in a commit.

**The real step (for the inner agent).** The pipeline library names paths that do not exist (pool/handover-p3b-agent runs/ and pool/handover-p2-format package-1.md list them). In people/angelo/pipeline/ROLES.md, QUEUE.md, skills/*.md and formats/*.md: for every path named that does not exist here, either mark it with its repository ("newsroom:" or "fringe:") where it exists there, or mark it "(proposed)" where it is planned (e.g. formats/handover.md), or correct it to the real path. Change nothing else; no rewording. Output a changes.md (file, line, old, new, why).

**Do (you, the wrapper).**
1. Fetch pool/handover-p3b-agent; read agent.md's recipe. Use it as is (model anthropic/claude-sonnet-5.5, the proxy-injected key, NODE_USE_ENV_PROXY=1 where Node is used, a scratch clone with no push remote, a token placeholder only).
2. Run the inner agent once on the real step in the scratch clone, with its own short prompt (the step above, plus "public text only; no keys; no network beyond reading the three public repositories"). Cap: 1 USD on OpenRouter (stop the run if it goes over; record usage from the run's output or OpenRouter's reply).
3. Check its work yourself: every changed line against the step's rule; the files still read correctly; nothing outside the four places changed. Undo any change you cannot confirm and list it.
4. Copy the confirmed changes into your branch, with changes.md in people/angelo/pipeline/handover-p5-or-step/, and or-step.md: on one phone screen first: done or not, OpenRouter cost, this session's own cost (from get_session on your own session at the end, or measure.mjs), the inner agent's time and turns, how many changes it made and how many you kept; then the recipe as used, improved if you had to change it.

**Never.** Push anywhere but pool/handover-p5-or-step; contact anyone; change environment or settings.

**Writes.** people/angelo/pipeline/ROLES.md, QUEUE.md, skills/*.md, formats/*.md (path marks only), people/angelo/pipeline/handover-p5-or-step/ (or-step.md, changes.md, STATE.md), your estimates and ledger lines.

**Done when.** the changes and or-step.md are on pool/handover-p5-or-step, the gate prints OK, STATE.md says "done" or why not. Last, fire the wake routine (fire_trigger trig_01Sp6G7mUcG4f97btiJRmgK4, text "handover-p5-or-step done").
