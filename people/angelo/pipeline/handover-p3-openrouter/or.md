---
title: "Pattern 3: handing model work to OpenRouter, checked by Claude"
by: charlie.large.worker@PrompTugal.angelo (build, handover-p3-openrouter)
written: 2026-11-11
for: handover-market.pm@PrompTugal.angelo
status: done
---
**Works: yes.** The key on this environment reaches OpenRouter; `or-task.mjs` hands a prompt over and gets JSON back, with cost logged and a hard cap.

| | cheap (gemini-2.5-flash-lite) | strong (gemini-2.5-flash) |
|---|---|---|
| Board index, 217 files | 0.016 USD, 118k in, 20k out, 11 calls | 0.074 USD, 103k in, 17k out, 9 calls |
| Per 25 files | about 0.002 USD, 4 s | about 0.008 USD, 8 s |
| Rows fully right (Claude's check) | 52 of 218 (24%) | 118 of 217 (54%) |

**Quality: not good enough for exact extraction.** More than 1 row in 10 was wrong on both tiers (the brief's bar), so neither index is fit to use as is. The errors: owner (take `picked_by`, else `for`): cheap took `for` in 101 rows, strong gave null in 40; latest date: both skipped due dates and dates late in a file (cheap 109 rows, strong 70); cheap duplicated one row; strong cut 2 titles short. Status was right in every row. The same index from a 20-line script is exact and free.

**Hand over:** first drafts, summaries, classifying or tagging text, rewording, brainstorming, where a wrong line is cheap and Claude or a person reads the result. **Keep with Claude or a script:** exact fields, counts, dates, anything a gate or a decision relies on, anything private (only public repository text was sent here), and anything with tools or keys.

## Detail

**Spend:** 0.096 USD in total, from OpenRouter's `usage.cost` on each reply (usage.jsonl, 30 lines; sum of `cost_usd`). Cap: 1 USD for the step, 0.50 per run in the script.

**Steps and evidence**
1. Probe (cheap): "Reply with the single word: ok", 8 in, 1 out, 0.0000012 USD (usage.jsonl line 1). `GET /api/v1/generation?id=` answered 404 a few seconds after; the reply's own `usage` (sent with `"usage":{"include":true}`) carries the cost, so the script uses that.
2. Index (cheap): 9 calls of 25 files, each file cut to its first and last 1200 characters (`--trim 2400`). First tries failed: Node's `fetch` ignores `HTTPS_PROXY` so the key was never added (401, no spend; those 9 log lines were dropped), then 6 of 9 got rate limited (429; the 3 that came back cost 0.0055 USD, usage.jsonl lines 2 to 10). Fixed in the script: it re-runs itself with `NODE_USE_ENV_PROXY=1`, and retries 429 and 5xx after 2, 4, 8, 16 s. One call of 25 ran into the 6000-token limit repeating itself; rerun as 13 + 12, fine.
3. Claude's check: every row against the full files (front matter parsed; dates found as `2026-MM-DD` or `<day> <month>`), and 10 rows by eye (WS-102, 108, 12, 117, 118, 55, 150, 181, 200, 31): the script's findings held. The cheap rows are in board-index.json, each with `claude_check` (`ok`, or the wrong fields). Some date misses are partly the cut: a date in the middle of a long file was not sent.
4. Strong tier, once, same prompt: better, still 46% of rows wrong.

**The script** (`or-task.mjs`, Node 22, no packages):
```
node people/angelo/pipeline/handover-p3-openrouter/or-task.mjs --prompt p.md --out out.json \
  --input board/WS-01-*.md --input board/WS-02-*.md --tier cheap --batch 25 --trim 2400 \
  --max-tokens 6000 --task "board index" [--dry] [--cap 0.50]
```
The prompt asks for one JSON object; array fields from each batch are joined. Before each call it works out the worst case (prices from `/api/v1/models`, 2.5 characters a token, all of `--max-tokens`) and refuses a call that would take the run past the cap (tested: `--cap 0.0000001` refuses, exit 1). `--dry` prints the calls and worst cases without spending. It reads `OPENROUTER_API_KEY` or sends the placeholder `proxy-injected`; it never prints or logs a key or a header. Exit 1 if any call failed.

The prompt used: "You index issue files from a project board... one row per file: id, title, status, owner (picked_by if not empty, else for), last_date (the latest calendar date anywhere in the file, YYYY-MM-DD)... Output JSON only."

**Not done:** the Fringe's router (`admin/tools/llm.mjs`) was not reused: adding that repository read-only was refused in this session, so the calls go straight to `https://openrouter.ai/api/v1/chat/completions` as the brief allows.

**Next, if the lead wants it:** retest with the owner rule spelt out field by field and dates limited to the notes, or try a third model (e.g. a Claude model through OpenRouter) on the same 217 files. Both cost under 0.10 USD.
