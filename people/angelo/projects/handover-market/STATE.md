# handover-market: state
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
- **1a handover-p1-relay** (relay, large): read p1/p2, run one here, draft the unsigned result and the write-back checklist. Brief: steps/handover-p1-relay/brief.md. Running.
- 1b write-back (signed, to the Fringe): go in principle (2026-11-11 17:0x); the drafted result and exact steps go to Angelo before any push.
- **2a handover-p2-format** (spec, large): proposed formats/handover.md and one real package. Brief: steps/handover-p2-format/brief.md. Running in parallel (independent).
- 2b dry run on Angelo's own other Claude account (his go, 2026-11-11): after 2a, Angelo starts one session there with package-1; result on a pool/ branch; we review and record. Then 2c: the same package to Dinis's conductors (first contact, shown to Angelo).
- 3 OpenRouter (Angelo's go, 2026-11-11): Dinis's key saved as this environment's network secret for openrouter.ai (Angelo enters it in the secure form); then one worker runs one small task through the cheap tier and has Claude check it, recorded with cost.
- 4 and 5: each waits for Angelo's go (see table).

## Decisions (Angelo's words)
- 2026-11-11: "We want to move very quickly to the point where we can start handing over tasks, staring from the easiest patterns and then moving on towards more complex ones." "Remember, don't execute anything yourself, this probably needs a pm with workers spawning powers."

- 2026-11-11, on pattern 1's write-back to the Fringe (session key, its public half published, signed result pushed): "Yes, go ahead in principle, show me before pushing".
- 2026-11-11, on pattern 2's first target (own other account vs Dinis's agents): "Yes, dry run on my other account first".
- 2026-11-11, on pattern 3: "Since we're about to end tokens here, we definitely need the capability of handing over stuff to other accounts. Let's try the OpenRouter route, and we're allowed to use Dinis's key as that's an investment dedicated to this project."

## Open questions for Angelo
(none open)

## Findings
- pushed-by.mjs places only pushes to dev, so a lead's instruction commit on project/<name> reads UNKNOWN. Workers check instead: the project's BRIEF.md last touch on dev says ANGELO, and the step's sha is on origin/project/handover-market. For conductor.b@: say if you want this changed.
