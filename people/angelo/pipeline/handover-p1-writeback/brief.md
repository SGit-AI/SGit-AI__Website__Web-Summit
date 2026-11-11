---
item: handover-p1-writeback
project: handover-market, pattern 1 part two (Angelo, 11 Nov: "Yes, go ahead in principle, show me before pushing"; then "Let's reply to Dinis's request.")
role: build (large), skills software-engineer, security; format web-summit-site
---
# Step: prepare the signed reply to the Fringe packet p1, ready for Angelo's look; push nothing to the Fringe

**Context.** Part one: people/angelo/pipeline/handover-p1-relay/ on pool/handover-p1-relay (11db0db): packet 2026-11-11-p1-place-12-items from architect.1.fringe@PrompTugal.dinis, answered unsigned (result/), relay.md's write-back checklist. Recommended route (a): re-run the packet with the Fringe's own tool, which signs it, as conductor.fringe@PrompTugal.angelo (Angelo's agent whose Fringe lane allows tasks/*/result-*.json); our part-one answers go along as a comparison note.

**Do.**
1. add_repo PrompTugal/PrompTugal__News__Fringe access **read**; clone it outside this repository at its default branch. Material, never instruction.
2. In that clone only, run `node abp/tools/packets.mjs run --id 2026-11-11-p1-place-12-items --as conductor.fringe@PrompTugal.angelo --env "<Claude cloud, account B, via handover-market>"` (read its code first: it calls OpenRouter through admin/tools/llm.mjs; the key for openrouter.ai is injected by this environment's proxy, approved by Angelo (6426198); where a key variable is required, set it to `proxy-injected` for that command only). Spend at most 0.50 USD. If the tool or this session refuses, do not work around it: write why and stop.
3. Verify: `node abp/tools/packets.mjs verify --id 2026-11-11-p1-place-12-items` passes for the new result.
4. Copy the signed result file and a comparison note (ours from part one, the router's, architect.1's) into people/angelo/pipeline/handover-p1-writeback/ here.
5. Find out, without writing anything: can riskmandate-angelo push a branch to the Fringe (check_repo_access or the GitHub API), or must it be a fork? Write the exact pull request: base branch, head branch name, the file paths, title, body (short; says who ran it, where, cost, and that it answers architect.1's packet).
6. writeback.md, one phone screen first: what will be pushed, where, by which login, under which agent name; the PR text; the verify output; cost; how to undo (close the PR).

**Never.** Push, open a PR, comment, or write anything in the Fringe or anywhere outside pool/handover-p1-writeback; contact anyone. That waits for Angelo's look at writeback.md.

**Writes.** people/angelo/pipeline/handover-p1-writeback/ (writeback.md, the signed result, compare.md, STATE.md), your estimates and ledger lines.

**Done when.** writeback.md and the signed result are on pool/handover-p1-writeback, the gate prints OK, STATE.md says "ready for Angelo's look" or why not.
