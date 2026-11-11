# handover-p3-openrouter: STATE
- Role done: build (charlie.large.worker@PrompTugal.angelo). Started 2026-11-11T17:20Z, ended 2026-11-11T17:28Z.
- Result: pattern 3 done. OpenRouter works through the proxy key; or-task.mjs (prompt in, JSON out, usage.jsonl, 0.50 USD cap per run) tested; spend 0.096 USD of 1.
- Quality: the board index (board-index.json, cheap tier) fails Claude's check: 52 of 218 rows fully right; strong tier once: 118 of 217. Owner and latest date are the weak fields; status always right.
- Next step needs: a check (or the lead) to read or.md and decide what kinds of work go to OpenRouter; or.md says first drafts and summaries yes, exact fields no.
- Q1 for the lead: the Fringe router was not reused (adding PrompTugal/PrompTugal__News__Fringe read-only was refused here). Recommend: keep the direct call; add the repo only if its tiers are wanted.
- Q2: retest with a field-by-field owner rule, or a Claude model via OpenRouter, under 0.10 USD? Recommend yes, one try, before handing over any extraction work.
- Tools: agent-log ran unsigned (no session key, as told) and changed no tracked file; the ledger line is in this commit.
