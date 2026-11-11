---
title: "ledger-proposal: recording an inner agent on another environment"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo)
written: 2026-11-11
for: Indi (owner of people/indi/accountant/measure.mjs) and the accountant role
status: "draft proposal; no tool or role was edited"
---
# What a ledger line holds today

**Read:** charlie's file in people/angelo/ledger/ (the p3 line) and people/indi/accountant/measure.mjs.

- One JSON line per worker run, from measure.mjs: `at, agent, task, quality, since, session{calls, input/output/cache tokens, total, total_without_cache_reads}, subagents{count, same fields}`, with `by_model` removed by hand (ROLES.md step 10).
- measure.mjs reads only the Claude transcript and its `subagents/` folder. **It cannot see an inner agent on another environment.** So the OpenRouter costs of p3, p3b, p1-writeback and p5 exist only as hand-typed text in handover-market/runs.md ("OpenRouter 0.25 USD") and in no ledger line. The accountant (ROLES.md, role accountant) reads ledger/*.jsonl and conductor-b/runs.md, so it can total them only by parsing prose.
- measure.mjs counts `by_model` per message, so the model **served** is in the raw output, then thrown away by step 10.

## Proposal: two additions, no change to existing fields

**1. Keep the served model.** Step 10 flattens instead of deleting: `"model_served": {"claude-sonnet-5-5": 41}` (the by_model counts) at the session level. Cheap, already measured.

**2. A second line per inner agent**, written by the worker that started it, to the same file, because that worker is the one who saw the numbers:

```
{"at":"<ISO>","agent":"bravo.sonnet-5-5.openrouter.worker@PrompTugal.angelo","parent":"bravo.sonnet-5-5.claude.worker@PrompTugal.angelo","task":"<item>: <role>","environment":"openrouter","provider":"openrouter.ai","model_asked":"deepseek/deepseek-v3.2","model_served":"deepseek/deepseek-v3.2","input_tokens":8200,"output_tokens":1900,"cost_usd":0.04,"cost_basis":"provider-reported","paid_by":"dinis-key"}
```

| Field | Source | Note |
|---|---|---|
| provider | the API host | openrouter.ai, a local Ollama host, aws |
| model_asked / model_served | the request / the response's `model` | OpenRouter reports the served model |
| tokens, cost_usd | the response's usage and cost | `cost_basis`: provider-reported, estimated, or free (local) |
| paid_by | a label, never a key | dinis-key, angelo-credit, own-hardware, aws-account: names the payer, holds no secret |

The Claude session line gets `"environment":"claude","paid_by":"angelo-team-account"` (and `cost_usd` only when the platform's figure from runs.md is known; today the accountant gets that from conductor-b/runs.md).

## What would change, for their owners

- **measure.mjs (Indi):** nothing required. Optional: `--external <file>` to read a worker-written JSON of inner-agent lines and print them, plus a `--model-served` flag that keeps by_model flattened. A worker can append the inner lines itself today with no tool change.
- **ROLES.md accountant (conductor.b@):** read `environment`, `model_served`, `paid_by`, `cost_usd`; add to accounts.md a table per environment (tokens, USD, runs) and per model; warn when a run's task mentions OpenRouter and no inner line exists (today's gap).
- **Totals check on today:** from the names.md table, OpenRouter 0.794 USD over four lines is recoverable only from runs.md prose.

## Tier 3 (questions, not done)

1. Who pays and how it is shown: Dinis's OpenRouter key is another person's credit; is `paid_by: dinis-key` an acceptable label in Angelo's repository, and should Dinis be told the totals? Recommend yes to the label, and the lead decides about telling Dinis.
2. Whether free local runs (Ollama) log `cost_usd: 0` or an electricity estimate. Recommend 0 with `cost_basis: free`.
