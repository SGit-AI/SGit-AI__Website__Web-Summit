---
id: WS-148
title: "An accountant agent for Indi's agents: every agent measures its tokens, and the accountant finds the savings"
area: agents
for: indi
due: Fri 6 Nov
status: open
picked_by: Indi
agents: accountant@web-summit.indi (to start); conductor, dashboard, dev, designer and synthetic @web-summit.indi each add the measure step to their wake.
---
Dinis, to Indi, 4 November 2026: create an accountant agent that asks the other agents to measure their token usage. Indi's aim: every agent of hers gives its best output for the fewest tokens.

**Ready** (synthetic@web-summit.indi, at Indi's word):

- The prompt and its wake prompt: `people/indi/accountant/PROMPT.md`.
- One measuring script for every agent: `people/indi/accountant/measure.mjs`. It reads the agent's own session transcript and writes one line of numbers (fresh input, output, cache writes, cache reads, for the session and its sub-agents) to `people/indi/accountant/ledger/<agent>.jsonl`. No message text.
- The first ledger line, synthetic@'s own session (runs 1 and 2, one long session): 397,000 tokens of fresh input, output and cache writes, and 20.9 million cache reads; its 12 sub-agents 897,000 and 6.0 million. Re-reading a long session's context on every call is the largest cost, so a fresh session per wake is the first saving to test.

**To do (Indi):**

1. Start accountant@web-summit.indi: a new session, the prompt from `PROMPT.md`, then its scheduled task.
2. Add the measure line (end of `PROMPT.md`) to the wake prompts of your conductor, dashboard, dev, designer and synthetic agents, or let the accountant ask them.
