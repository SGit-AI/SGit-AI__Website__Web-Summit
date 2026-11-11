For the digest: scope changed (eecd609): the packet exchange with Dinis is conductor.fringe@'s; this project now builds the capacity board and offer/claim/lapse between accounts (prototype started, nothing live), then Ollama and AWS (tier 3); waiting on Angelo: names in policy@'s lane check (closed sets, his "no wildcards" rule).
For the digest: plan written; pattern 1 (Fringe packet relay) and the handover format running as workers; Angelo's go in principle for pattern 1's write-back, shown to him before any push; pattern 2 dry run on Angelo's own other account first (his go); pattern 3 (OpenRouter, Dinis's key) approved by Angelo as urgent: account B's usage is running out; key to be saved as a network secret for openrouter.ai.

Lead: handover-market.pm@PrompTugal.angelo. Branch project/handover-market. Brief: BRIEF.md (opened by 20fe15f6, pushed-by ANGELO, checked 2026-11-11).
Budget: about 15 USD of worker runs (record, not block). Spent: see runs.md.

## Plan: the patterns in order (easiest first)
| # | Pattern | Where it runs | Needs | Tier 3 |
|---|---|---|---|---|
| 1 | Fringe packet relay: run a packet Dinis's swarm addressed to Angelo's conductor, write back the signed result | Claude, account B (a worker) | Fringe repo read; packets.mjs; a session key for signing | write-back to the Fringe (first contact with Dinis's agents); publishing a signing key |
| 2 | Pool-branch handover between Claude accounts: a package on pool/<id>, claimed with pool-claim.mjs, run on another account, reviewed onto dev | another Claude account: Angelo's own other account first, then Dinis's conductors | formats/handover.md (missing); one package; the other side's push rights; pushed-by from another login | each offer to Dinis's agents (offer 2's wording); policy@ lane for Run-on commits |
| 3 | Model calls to OpenRouter, checked by Claude (cheap and check tiers of the Fringe router) | OpenRouter | the router (admin/tools/llm.mjs in the Fringe); a key | the key and credit are Dinis's: his and Angelo's go |
| 4 | Local model: the Ollama on Angelo's computer | Angelo's computer | Remote Control connected by Angelo; a model pulled | reaching his computer |
| 5 | AWS (Bedrock or Lambda) | AWS | an account, a budget | cloud account and money |

## Scope (from 21:35 UTC, eecd609, pushed-by ANGELO)
Angelo: "Handover experiments have been handled by conductor.fringe, can you check?" then "Agree, go ahead". Dropped here: 1b (the signed p1 reply), packet p2, and 4 (our outgoing packet: nothing of this project goes to the Fringe's tasks/). Kept: OpenRouter (3a, 3b, 5) as the outside-Claude pattern; names (6) with policy@ and Angelo. New: the capacity board; offer, claim and lapse between accounts; Ollama (tier 3: his computer); AWS (tier 3).

## Steps
- **1a handover-p1-relay**: done 17:03 (pool/handover-p1-relay 11db0db, 1.30 USD). Packet p1 (place 12 board items at an altitude) answered here, 12/12 valid, unsigned; all signatures verify; agrees with architect.1 on 3 of 10. Write-back via conductor.fringe@PrompTugal.angelo (its Fringe lane allows tasks/*/result-*.json); push access to the Fringe is Dinis's, else a pull request. Shown to Angelo next.
- **1b handover-p1-writeback**: prepare the signed reply and the PR text (brief steps/handover-p1-writeback/brief.md); nothing pushed to the Fringe until Angelo looks. Go in principle (2026-11-11 17:0x); the drafted result and exact steps go to Angelo before any push.
- **2a handover-p2-format**: done 17:03 (pool/handover-p2-format 27d8dd5, 1.45 USD). handover.md (proposed format) and package-1.md (check every path the pipeline library names).
- 2b dry run by manual paste: DROPPED by Angelo (19:0x), golf claim released; the paste block stays as reference. Was: Brief steps/handover-x1-paths/brief.md (1936f83), paste block dry-run-prompt.md, slot golf claimed 17:2x (lapses after two hours unless renewed); Angelo starts one session there with package-1; result on a pool/ branch; we review and record. Then 2c: the same package to Dinis's conductors (first contact, shown to Angelo).
- **3a handover-p3-openrouter** (build, large), running from 17:20. 3 OpenRouter (Angelo's go, 2026-11-11): key saved 17:1x as a network secret for openrouter.ai on env PrompTugal News shared; Dinis's key saved as this environment's network secret for openrouter.ai (Angelo enters it in the secure form); then one worker runs one small task through the cheap tier and has Claude check it, recorded with cost.
- **3a done** 17:28 (pool/handover-p3-openrouter 1943369; 1.81 USD platform + 0.096 USD OpenRouter): key works; or-task.mjs; cheap tier 24% rows right, strong 54%: fit for drafts, summaries, tagging; not exact fields.
- **3b handover-p3b-agent** (build, large): a whole worker whose model calls go to OpenRouter (Claude through OpenRouter, and a cheap model), cap 2 USD. Decided by default, Angelo can reverse.
- **4 handover-p4-outpacket** (build, large): our first outgoing packet in the Fringe's format + a checklist for an always-on picker on Angelo's other account. Nothing posted; posting is tier 3 (first contact).
- **3b done** 19:11 (pool/handover-p3b-agent 1c5a584; 1.75 USD + 0.25 OpenRouter): a headless worker on OpenRouter works; Sonnet 5.5 right (0.14 USD), DeepSeek 6 wrong.
- **5 handover-p5-or-step** (build on OpenRouter, Sonnet 5.5 inner; wrapper on a Sonnet session to save account B, decided by default): one real step with a commit: mark the pipeline library's missing paths.
- **5 done** 19:43 (pool/handover-p5-or-step e958ac8): one real step on OpenRouter ended in a commit; 0.446 USD OpenRouter + 0.52 USD Sonnet wrapper; 10 of 11 marks kept.
- **6 handover-p6-names** (spec): names <slot>.<model>.<environment>.worker@, inner-agent lines, ledger by environment; drafts only, policy@'s and Indi's files proposed, not edited. Decided by default (Angelo can reverse).
- **6 done** 20:07 (pool/handover-p6-names 188fede; 0.78 USD Sonnet): names scheme, ROLES diff, lanes and ledger proposals. lane-check.mjs matches names exactly, enforce on: new names need policy@'s change first. Recommend closed sets (slots x models x environments), which needs Angelo's word on his "no wildcards" rule.
- **7 handover-p7-market** (build, prototype only): capacity board + offer/claim/lapse in a copy of pool-claim.mjs, with tests, in its own folder; nothing live; then a spec for Angelo's review before anything goes live. Decided by default, Angelo can reverse.
- Ollama and AWS: each waits for Angelo's go (see table).

## Decisions (Angelo's words)
- 2026-11-11: "We want to move very quickly to the point where we can start handing over tasks, staring from the easiest patterns and then moving on towards more complex ones." "Remember, don't execute anything yourself, this probably needs a pm with workers spawning powers."

- 2026-11-11, on pattern 1's write-back to the Fringe (session key, its public half published, signed result pushed): "Yes, go ahead in principle, show me before pushing".
- 2026-11-11, on pattern 2's first target (own other account vs Dinis's agents): "Yes, dry run on my other account first".
- 2026-11-11, on pattern 3: "Since we're about to end tokens here, we definitely need the capability of handing over stuff to other accounts. Let's try the OpenRouter route, and we're allowed to use Dinis's key as that's an investment dedicated to this project."
- 2026-11-11, after the signed reply via conductor.fringe@ (re-run with the Fringe's tool, pull request, shown before opening) was recommended: "Let's reply to Dinis's request." Step 1b-prep started; the PR is shown to Angelo before it is opened.
- 2026-11-11 18:5x: wake routine trig_01Sp6G7mUcG4f97btiJRmgK4 set by conductor.b@ (a9199ce, pushed-by ANGELO; Angelo: "Go on all three, 2 hours is fine"): workers fire it last; below tier 3 the lead decides by default, recorded.
- 2026-11-11 19:0x, on the manual dry run: "I don't think manually passing prompts is actually that significant, I know I can do it and it's not the workflow that we're interested in."
- 2026-11-11, after the lead proposed outgoing packets in the Fringe's format (no person passing prompts): "Yes, go ahead with the outgoing packet".
- 2026-11-11 19:1x, standing rule for workers: "If one of the workers is not needed anymore, can you remove it from my list? We should never have stranded workers, if their work is interrupted, we should retire them. This way I can keep an eye on what's going on. Any worker I see should always be actively running, there should never be stopped workers around except for brief moments while their pm is busy." At every wake: any worker session that is idle, blocked, failed or interrupted is checked, its commits logged, and archived at once; its claim released.
- 2026-11-11 19:4x: "Yes, go ahead with the OpenRouter worker" (one real step on OpenRouter Sonnet 5.5, the wrapper commits).
- 2026-11-11 19:5x, on OpenRouter caps: "We're at the stage of experimentation, we don't need to worry too much about capping. We'll review if things get out of hand." From now: no per-step OpenRouter cap in briefs; the lead reports the running OpenRouter total in every update.
- 2026-11-11 20:0x, on naming workers: "I think we need to include the environment in the name before the @. Also, let's be explicit about the model name. So alpha.opus-5-5.openrouter.worker? But we also have claude as an environment and chatgpt, etc."
- 2026-11-11 20:0x, on claude-a/claude-b: "We don't need to distinguish between different claude environment, what matters is the overall environment shape, not individual accounts." Scheme: <slot>.<model>.<environment>.worker@PrompTugal.angelo, environment one of claude, openrouter, chatgpt, ollama, aws.

## Open questions for Angelo
(none open)

## Findings
- 19:3x: three workers sat idle 15 to 80 minutes after finishing or being refused: none fired the wake routine (hotel's brief had none; charlie and bravo were told to). Fix: check list_sessions at every wake and at every exchange with Angelo, archive idle ones at once.
- pushed-by.mjs places only pushes to dev, so a lead's instruction commit on project/<name> reads UNKNOWN. Workers check instead: the project's BRIEF.md last touch on dev says ANGELO, and the step's sha is on origin/project/handover-market. For conductor.b@: say if you want this changed.
