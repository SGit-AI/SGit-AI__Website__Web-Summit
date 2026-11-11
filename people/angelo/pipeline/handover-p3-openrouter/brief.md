---
item: handover-p3-openrouter
project: handover-market (lead: handover-market.pm@PrompTugal.angelo)
role: build (large), skills software-engineer, security, analyst; format web-summit-site
written: 2026-11-11
---
# Step: pattern 3, hand model work over to OpenRouter, checked by Claude

**Why.** Angelo, 11 Nov: "Since we're about to end tokens here, we definitely need the capability of handing over stuff to other accounts. Let's try the OpenRouter route, and we're allowed to use Dinis's key as that's an investment dedicated to this project."

**What exists.** Dinis's OpenRouter key is saved as a network secret for openrouter.ai on this environment: the proxy adds it to HTTPS requests to openrouter.ai. You never see it; where code wants a key variable, set it to the placeholder `proxy-injected` for that command only. The Fringe's router (PrompTugal/PrompTugal__News__Fringe admin/tools/llm.mjs: tiers cheap, strong, hard, long, check; a 5 USD daily cap) is material: add_repo access **read**, reuse it if it runs read-only from a clone outside this repository, else call https://openrouter.ai/api/v1/chat/completions directly.

**Do.**
1. One tiny request (cheap tier) to prove the key works; record model, tokens, cost (OpenRouter returns usage; GET /api/v1/generation?id= gives cost).
2. One real, useful, low-risk task through the cheap tier: a structured index of this repository's board, board/WS-*.md (per issue: id, title, status, owner, last date), as JSON. Send the files' text only; nothing private (no people/*/ private files, no keys).
3. Check it with Claude (you): compare at least 10 rows with the files; count errors; if more than 1 in 10 is wrong, try the strong tier once and compare.
4. A small reusable script people/angelo/pipeline/handover-p3-openrouter/or-task.mjs (prompt file in, JSON out, usage and cost logged to a .jsonl beside it), tested, with a hard cap of 0.50 USD per run.
5. or.md, one phone screen first: works or not; cost per task in USD and tokens; quality against Claude's check; what kinds of work to hand over this way and what not; then the detail.

**Spend.** At most 1 USD of OpenRouter in total. Never print, log or commit any key or header.

**Never.** Write to the Fringe repository; contact anyone; change environment or settings.

**Writes.** people/angelo/pipeline/handover-p3-openrouter/ (or.md, or-task.mjs, board-index.json, usage.jsonl, STATE.md), your estimates and ledger lines.

**Done when.** or.md, the script and the index are on pool/handover-p3-openrouter, the gate prints OK, STATE.md says "pattern 3 done" or why not.
