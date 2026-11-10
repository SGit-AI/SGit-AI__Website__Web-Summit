# The model ledger (WS-214, ROADMAP P0.4)

One line per model call the incident team makes, written by the one wrapper, `team/incidents/tools/llm.mjs`. **The lines are not in git:** ROADMAP P0.4 puts `ledger.jsonl` in the curated vault, and the lines name models, which this estate's agents keep out of what they push. Until the data lane's vault exists (J2) the ledger is `INCIDENT_LEDGER_DIR` (default `~/.incident-ledger/`) in the calling session; this folder holds only this README. No call goes around it. A prototype until the incident site's repository exists; the raw store then moves to the data lane's vault (J2).

## Files

- `<INCIDENT_LEDGER_DIR>/<YYYY-MM-DD>.jsonl` (UTC day): one JSON object per call. A folder inside this repository is refused.
- The raw records (request, response, error) are **not here**. They go to the raw store (`INCIDENT_RAW_DIR`, default `~/.incident-raw/<day>/<id>.json`, mode 0600). The wrapper refuses a raw folder inside this repository: prompts and answers can carry press text that is not ours to publish. When the raw folder is an sgit vault checkout, its owner commits and pushes it.

## A line

| Field | What |
|---|---|
| `at`, `id` | UTC time of the call; the call's id (also the raw record's name) |
| `task`, `agent` | e.g. `WS-214/curate`, `curator@web-summit.dinis` (the caller names both) |
| `provider`, `model`, `model_served` | `openrouter` (or `mock`); the model asked for; the one the provider says answered |
| `status` | `ok`, `http_<code>`, `error`, or `refused_cap` (the day's cap was reached; no call made) |
| `tokens_in`, `tokens_out`, `cost_usd` | as the provider reported them (`usage: { include: true }`); 0 when it reported none |
| `latency_ms` | from the request sent to the answer read |
| `cap_usd` | the daily cap in force (`LLM_DAILY_CAP_USD`, default 5) |
| `raw`, `raw_sha256`, `raw_bytes` | the raw record's path in the raw store, and its hash, so the ledger can vouch for it |
| `error` | the provider's message, at most 200 characters |

## Use

```
node team/incidents/tools/llm.mjs --task WS-214/test --agent <you> --model <provider/model> [--mock] "prompt"
node team/incidents/tools/llm.mjs --summary [YYYY-MM-DD]      # calls, cost, by model, by agent, by status
```

No model is named in the code: the caller names it (`--model`, `LLM_MODEL` or `model:`). As a module: `import { call } from '../tools/llm.mjs'` then `await call({ task, agent, model, messages })`, which returns `{ text, line }` and never throws on a provider error: the error is recorded and returned.

The key is `OPEN_ROUTER_KEY`, read from the environment only. It **is** set in incident.dev@'s environment (checked 20:48; the value never read or printed); a session without it uses `--mock`, and a call with no key or a dummy key is refused (401) and recorded as such. Tested 10 November: mock `ok`, dummy key `http_401`, cap 0 `refused_cap` (20:44), and one real call through OpenRouter, `ok`, 18 tokens in, 4 out, $0.0000038, 910 ms (20:48).
