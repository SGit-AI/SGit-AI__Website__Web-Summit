For the digest: patterns 1-3 tried; OpenRouter works (0.10 USD) but cheap models fail exact work; testing a whole worker on OpenRouter; the signed reply to Dinis's packet is being prepared, shown to Angelo before any push; dry run on Angelo's other account waits for his paste.
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

## Steps
- **1a handover-p1-relay**: done 17:03 (pool/handover-p1-relay 11db0db, 1.30 USD). Packet p1 (place 12 board items at an altitude) answered here, 12/12 valid, unsigned; all signatures verify; agrees with architect.1 on 3 of 10. Write-back via conductor.fringe@PrompTugal.angelo (its Fringe lane allows tasks/*/result-*.json); push access to the Fringe is Dinis's, else a pull request. Shown to Angelo next.
- **1b handover-p1-writeback**: prepare the signed reply and the PR text (brief steps/handover-p1-writeback/brief.md); nothing pushed to the Fringe until Angelo looks. Go in principle (2026-11-11 17:0x); the drafted result and exact steps go to Angelo before any push.
- **2a handover-p2-format**: done 17:03 (pool/handover-p2-format 27d8dd5, 1.45 USD). handover.md (proposed format) and package-1.md (check every path the pipeline library names).
- 2b dry run on Angelo's own other Claude account (his go, 2026-11-11): ready. Brief steps/handover-x1-paths/brief.md (1936f83), paste block dry-run-prompt.md, slot golf claimed 17:2x (lapses after two hours unless renewed); Angelo starts one session there with package-1; result on a pool/ branch; we review and record. Then 2c: the same package to Dinis's conductors (first contact, shown to Angelo).
- **3a handover-p3-openrouter** (build, large), running from 17:20. 3 OpenRouter (Angelo's go, 2026-11-11): key saved 17:1x as a network secret for openrouter.ai on env PrompTugal News shared; Dinis's key saved as this environment's network secret for openrouter.ai (Angelo enters it in the secure form); then one worker runs one small task through the cheap tier and has Claude check it, recorded with cost.
- **3a done** 17:28 (pool/handover-p3-openrouter 1943369; 1.81 USD platform + 0.096 USD OpenRouter): key works; or-task.mjs; cheap tier 24% rows right, strong 54%: fit for drafts, summaries, tagging; not exact fields.
- **3b handover-p3b-agent** (build, large): a whole worker whose model calls go to OpenRouter (Claude through OpenRouter, and a cheap model), cap 2 USD. Decided by default, Angelo can reverse.
- 4 and 5: each waits for Angelo's go (see table).

## Decisions (Angelo's words)
- 2026-11-11: "We want to move very quickly to the point where we can start handing over tasks, staring from the easiest patterns and then moving on towards more complex ones." "Remember, don't execute anything yourself, this probably needs a pm with workers spawning powers."

- 2026-11-11, on pattern 1's write-back to the Fringe (session key, its public half published, signed result pushed): "Yes, go ahead in principle, show me before pushing".
- 2026-11-11, on pattern 2's first target (own other account vs Dinis's agents): "Yes, dry run on my other account first".
- 2026-11-11, on pattern 3: "Since we're about to end tokens here, we definitely need the capability of handing over stuff to other accounts. Let's try the OpenRouter route, and we're allowed to use Dinis's key as that's an investment dedicated to this project."
- 2026-11-11, after the signed reply via conductor.fringe@ (re-run with the Fringe's tool, pull request, shown before opening) was recommended: "Let's reply to Dinis's request." Step 1b-prep started; the PR is shown to Angelo before it is opened.
- 2026-11-11 18:5x: wake routine trig_01Sp6G7mUcG4f97btiJRmgK4 set by conductor.b@ (a9199ce, pushed-by ANGELO; Angelo: "Go on all three, 2 hours is fine"): workers fire it last; below tier 3 the lead decides by default, recorded.

## Open questions for Angelo
(none open)

## Findings
- pushed-by.mjs places only pushes to dev, so a lead's instruction commit on project/<name> reads UNKNOWN. Workers check instead: the project's BRIEF.md last touch on dev says ANGELO, and the step's sha is on origin/project/handover-market. For conductor.b@: say if you want this changed.
