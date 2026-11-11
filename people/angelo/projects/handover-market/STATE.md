# handover-market: state
For the digest: plan written; pattern 1 (Fringe packet relay, run here) and the handover format started as workers; nothing sent; tier 3 next: Angelo's go for the first write-back to Dinis's swarm.

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
- 1b write-back (signed, to the Fringe): waits for Angelo's go (tier 3).
- **2a handover-p2-format** (spec, large): proposed formats/handover.md and one real package. Brief: steps/handover-p2-format/brief.md. Running in parallel (independent).
- 2b first handover to another Claude account: question for Angelo: his own other account first, or Dinis's conductors directly?
- 3 to 5: each waits for Angelo's go (see table).

## Decisions (Angelo's words)
- 2026-11-11: "We want to move very quickly to the point where we can start handing over tasks, staring from the easiest patterns and then moving on towards more complex ones." "Remember, don't execute anything yourself, this probably needs a pm with workers spawning powers."

## Open questions for Angelo
1. Pattern 1 write-back: go for a worker to make a session key, publish its public half, sign the result and push it to the Fringe (first contact with Dinis's swarm)? Shown to him with the draft first.
2. Pattern 2 first target: Angelo's own other account, or Dinis's conductors?
3. Pattern 3: may we use Dinis's OpenRouter key (his credit), within the router's daily cap?
