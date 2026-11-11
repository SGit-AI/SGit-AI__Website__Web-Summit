---
title: "Worker names that say model and environment"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: Angelo, via the lead
status: "draft for Angelo's read; nothing live is changed"
---
# Worker names: slot, model, environment

**The point:** a worker's name tells you who is working, with which model, where, so every commit and every cost can be traced and totalled (Angelo, 11 Nov: "we want to be able to track each and every agentic activity though commits").

## The scheme (agreed)

`<slot>.<model>.<environment>.worker@PrompTugal.angelo`

| Part | Rule | Examples |
|---|---|---|
| slot | NATO name from QUEUE.md's list; the list says large or small, so the name no longer does | alpha, bravo, delta |
| model | the model **asked for**, lower case, dots as dashes | opus-5-5, sonnet-5-5, haiku-5-5, deepseek-v3-2 |
| environment | the shape, never the account: claude, openrouter, chatgpt, ollama, aws | claude |

- Full examples: `bravo.sonnet-5-5.claude.worker@PrompTugal.angelo`; an inner agent: `bravo.sonnet-5-5.openrouter.worker@` under `bravo.sonnet-5-5.claude.worker@`.
- **The name says the model asked for; the model actually served goes in the ledger line** (a fallback can change it mid-session; `get_session` shows both).
- An inner agent a worker starts on another environment has its own name, its own commit trailer or `Sub-agent:` line, and its own cost.
- Two Claude accounts are one environment (Angelo: "what matters is the overall environment shape, not individual accounts"); who pays is a ledger field, not a name part.
- Only lower case letters, digits, dots and dashes (the gate's address regex and pool-claim.mjs already accept this).
- A new environment word needs a line here; nothing else.

## Migration

Commit under the old name until policy@ accepts the new one (lanes: see lanes-draft.md). Then every new run uses the new name; old lines stay as written. Slot uniqueness is by slot word (alpha once at a time), whatever model or environment follows it.

## Today's runs of handover-market (runs.md at 01a4ca2, plus this run)

Model is not recorded in runs.md before p5; "not recorded" is not a guess. Costs are the platform's API-equivalent USD, from runs.md.

| Old name | New name (proposed) | Environment | Model | Cost (USD) |
|---|---|---|---|---|
| alpha.large.worker@ (p1-relay) | alpha.?.claude.worker@ | claude | not recorded | 1.30 |
| bravo.large.worker@ (p2-format) | bravo.?.claude.worker@ | claude | not recorded | 1.45 |
| charlie.large.worker@ (p3-openrouter) | charlie.?.claude.worker@ | claude | not recorded | 1.81 |
| its OpenRouter calls (p3) | charlie.?.openrouter.worker@ | openrouter | not recorded | 0.096 (Dinis's key) |
| hotel.large.worker@ (p1-writeback) | hotel.?.claude.worker@ | claude | not recorded | 2.31 |
| its OpenRouter calls (p1-writeback) | hotel.?.openrouter.worker@ | openrouter | not recorded | 0.002 |
| charlie.large.worker@ (p3b-agent) | charlie.?.claude.worker@ | claude | not recorded | 1.75 |
| its OpenRouter calls (p3b) | charlie.?.openrouter.worker@ | openrouter | not recorded | 0.25 |
| bravo.large.worker@ (p4-outpacket) | bravo.?.claude.worker@ | claude | not recorded | 1.95 |
| alpha.large.worker@ (p5-or-step, wrapper) | alpha.sonnet-5-5.claude.worker@ | claude | sonnet-5-5 | 0.52 |
| its helper (p5) | alpha.sonnet-5-5.openrouter.worker@ | openrouter | runs.md names no OpenRouter model | 0.446 |
| bravo.large.worker@ (p6-names, this run) | bravo.sonnet-5-5.claude.worker@ | claude | sonnet-5-5 | pending |

Totals, from this table: Claude platform 11.09 USD over 7 finished runs (this run pending); OpenRouter 0.794 USD over 4 lines. Today every OpenRouter line is hand-written in runs.md and in no ledger; see ledger-proposal.md.

## Questions for the lead

1. Should `?` rows be filled from the sessions' `get_session` (model served) by the accountant, or left as history? Recommend: leave as history; names change from the next run.
