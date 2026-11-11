---
title: "ROLES-diff: the exact line changes for the new names"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo)
written: 2026-11-11
status: "draft; for conductor.b@ to apply after Angelo's yes. No live file was edited."
---
# Line changes (live files are at origin/dev, 11 Nov)

Old text in `-`, new in `+`. Paths are all in people/angelo/pipeline/.

## ROLES.md

1. Preamble block, first line:
```
- You are {SLOT}, one of Angelo's pipeline workers ...
+ You are {SLOT} ({SLOT} is <slot>.<model>.<environment>.worker@PrompTugal.angelo; the model asked for), one of Angelo's pipeline workers ...
```
2. Preamble line 1 of the intro paragraph that fills placeholders: replace `{SLOT} (e.g. alpha.large.worker@PrompTugal.angelo)` with `{SLOT} (e.g. alpha.sonnet-5-5.claude.worker@PrompTugal.angelo)`.
3. Step 7 and 10 (lower-case file names): no change to the rule ("{SLOT} in lower case, - for @"); the example file becomes `alpha.sonnet-5-5.claude.worker-promptugal.angelo.jsonl`.
4. Step 10, add after "append its line": `, plus "model_served", "environment" and "paid_by" (ledger-proposal.md)`.
5. Step 8, after the `Sub-agent:` clause:
```
+ ; for an inner agent on another environment: "Sub-agent: <name>, <environment>, <model asked>/<model served>, <tokens in>/<out>, <cost USD>, paid by <who>" (see below)
```
6. Tenet 6, append: `A sub-agent on another environment (OpenRouter, ChatGPT, Ollama, AWS) is named like a worker and its cost is a ledger line.`
7. Roles `check`: "never the slot that drafted" stays; a slot is the slot word, so alpha on a different model is the same slot.
8. `accountant` read list: add `people/angelo/ledger/*.jsonl` fields environment, model_served, paid_by; add to accounts.md "per environment and per model".

## QUEUE.md

9. Slots table heading `(<slot>.large.worker@ / <slot>.small.worker@PrompTugal.angelo)` becomes `(<slot>.<model>.<environment>.worker@PrompTugal.angelo)`; keep the two size columns (the list is what says large or small). Add one line under it: `Slot names are unique by slot word; model and environment follow it.`
10. Running table `slot` column: show the full new name.

## skills/project-manager.md

11. "claim a slot name (pool-claim.mjs)": add `claim by slot word; start the session as <slot>.<model>.<environment>.worker@ (the model you ask for); log the full name in runs.md with the model served`.
12. "log it in the project's runs.md with its cost": add `and each inner agent on another environment as its own line`.

## skills/conductor.md

13. "Route by the queue": add `name the worker <slot>.<model>.<environment>.worker@ when filling {SLOT}; a large step goes to a large slot (the slot list says large) and is never given a haiku name`. See the question below.
14. "Every agentic activity in a commit": add `an inner agent on another environment too (the Sub-agent line form)`.

## The Sub-agent line form (inner agents on other environments)

```
Sub-agent: bravo.sonnet-5-5.openrouter.worker@PrompTugal.angelo, openrouter, deepseek-v3-2 / deepseek-v3-2, 8200 in / 1900 out, 0.04 USD, paid by dinis-key
```
Fields: name, environment, model asked / model served, tokens in / out, cost in USD, who pays. In-session Claude sub-agents keep the short form `Sub-agent: <what for>, <calls>, <tokens>`.

## Question

Today "large" means a large Claude session. With the model in the name, is "large" a slot property or a model property? Recommend: a slot property (QUEUE.md's list), so a haiku can never fill a large slot; conductor.b@ refuses a large step to a haiku name.
