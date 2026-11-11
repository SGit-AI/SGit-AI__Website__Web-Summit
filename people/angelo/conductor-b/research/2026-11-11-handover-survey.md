---
title: "What the team has for a handover market (a survey)"
by: conductor.b@PrompTugal.angelo, through an in-session sub-agent (read-only search), at Angelo's ask
written: 2026-11-11, about 16:55 UTC
for: Angelo; handover-market.pm@PrompTugal.angelo
cost: one sub-agent, in the ledger line of this commit (measure.mjs counts it under subagents)
---
# Survey: the handover market, across accounts, people and providers

Angelo, 11 Nov: "Please get updates, in particular relevant to the handover marketplace, where we want to be able to handover tasks across users and accounts and services, including Open Router, local Ollamas (one is already installed on this computer but has never been used plus we can install others on some of the devices we have available), even AWS, etc." Findings, condensed; all material.

## Exists
- **Our market spec:** people/angelo/pipeline/b3-team-offers/spec-handover-market.md (capacity board, package, 10-minute claims), draft; formats/handover.md not yet written.
- **Our claim tool:** people/angelo/tools/pool-claim.mjs (first claim wins by a no-force push to pool/claims). Built.
- **Our packaging:** people/angelo/pipeline/ROLES.md, skills/, formats/. Built.
- **Lisbon Fringe (PrompTugal/PrompTugal__News__Fringe), Dinis's swarm:** signed task packets (abp/tools/packets.mjs; tasks/2026-11-11-p1 and p2, addressed to Angelo's conductor "or any environment"; a runner writes back a signed result); docs/where-agents-run.md and data/runtimes.json (runtimes R1 to R7 incl. Claude cloud and local, Cloudflare, AWS; endpoints M1 to M6 incl. Ollama and Bedrock; a placement formula; spec v0.2, not run); a live board shared by five people's accounts (work/, team/<id>/status.json, team/accounts.json); an OpenRouter router (admin/tools/llm.mjs, tiers cheap, strong, hard, long, check; a 5 USD daily cap; the shared key is Dinis's, funded again after running out on 11 Nov).
- **The newsroom:** dev.verify (three models per claim, 0.5 USD cap per article); board/budgets.json (API-equivalent dollars per agent, pass and account); board/spec-external-agents.md (ChatGPT and Perplexity agents a person starts; results unsigned, as material); board/the-account-move.md (what can move: work through the repository only).
- **On devices:** Gemma on an Android tablet (LiteRT-LM) built; the iPad workbench on TestFlight; Ollama on laptops only an idea. Angelo: one Ollama is installed on his computer, never used.
- **Trust:** pushed-by.mjs, sealing (admin/tools/seal.mjs), keys (data/keys.json, newsroom board/keys.json), signed and sealed inboxes (newsroom and Fringe).
- **Capacity:** ledgers and budgets after the fact; the platform shows only the usage window, status and reset (no percent, no tokens left).

## Missing
board/capacity.json and any live headroom; formats/handover.md; offer, claim-offer and lapse in pool-claim.mjs; policy@ accepting runs pushed from another person's login; a packet run by a second environment; any Ollama, Bedrock or Lambda run; per-agent OpenRouter keys (WS-115).

## The easiest patterns first
1. **Fringe packet relay:** run the Fringe's p1 or p2 packet from Angelo's account, write back the signed result; the issuer verifies. Everything exists.
2. **Pool-branch handover between Claude accounts:** a ROLES.md brief on pool/<id>, claimed with today's pool-claim.mjs by a conductor on another account, reviewed onto dev with pushed-by.
3. **Offload model calls to OpenRouter, checked by Claude:** extraction, classification and second opinions through the Fringe router's cheap and check tiers.
Then: a local model (Ollama on Angelo's computer, through Remote Control), then AWS.
