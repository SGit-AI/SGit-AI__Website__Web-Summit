---
item: handover-p7-market
project: handover-market (scope from eecd609: "the capacity board; offer, claim and lapse of work between accounts")
role: build (large); format web-summit-site
Wake routine: trig_01Sp6G7mUcG4f97btiJRmgK4
decided: by default (the lead), Angelo can reverse; prototype only, nothing live
---
# Step: a working prototype of the capacity board and offer/claim/lapse, tested, nothing live

**Angelo:** "let's each have each session update the board"; "each conductor is able to claim "outsourced" work depending on their own capacity available, as soon as possible". Draft spec: people/angelo/pipeline/b3-team-offers/spec-handover-market.md (sections 1 to 3; not approved: build to learn, change what today's runs taught). Today's runs: an outside environment works (OpenRouter: pool/handover-p3b-agent agent.md, pool/handover-p5-or-step or-step.md); names will carry the environment (pool/handover-p6-names names.md).

**Do (all inside people/angelo/pipeline/handover-p7-market/, nothing else touched).**
1. capacity: a script capacity.mjs that writes one row for the session it runs in (environment, account label as declared, window, status, resets_at from get_session's rate_limit_info when given as input JSON, spend from ledger lines, headroom estimate labelled as such, updated_at) into a capacity.json given as an argument; rows older than 2 hours count as no room. Environments other than claude (openrouter: spend so far today from usage logs; ollama, aws: declared) have rows too.
2. market: market.mjs, a copy-and-extend of people/angelo/tools/pool-claim.mjs's approach (first push wins, no force, plumbing in a temporary index) with offer, claim-offer, lapse (10 minutes without the worker's first commit), list; on a remote and branch given by arguments, so tests run on a local bare repository, never origin.
3. tests: a test file beside them (node --test), run against a temporary bare repository: two claimers race, one wins; a claim lapses and is reclaimed; a stale capacity row counts as no room; an offer to an environment with no room stays open.
4. market.md: one phone screen first: what works (commands and their output), what it would take to go live (the live paths: board/capacity.json, a handover/claims branch; who writes what; the lane changes for policy@; the preamble lines each session adds), each tier-3 point marked; then the detail. This becomes the spec Angelo reviews before anything goes live.

**Never.** Write to origin except pool/handover-p7-market; create board/capacity.json or any branch other than yours on origin; change pool-claim.mjs, ROLES.md or anyone's files; contact anyone.

**Writes.** people/angelo/pipeline/handover-p7-market/ (capacity.mjs, market.mjs, the tests, market.md, STATE.md), your estimates and ledger lines.

**Done when.** the tests pass (output in market.md), the gate prints OK, everything is on pool/handover-p7-market, STATE.md says "ready for the lead's read". Last, fire the wake routine.
