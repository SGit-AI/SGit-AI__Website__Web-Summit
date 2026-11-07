---
id: WS-188
title: Dinis's agents share one cloud environment, and with it his tokens
area: tech
for: dinis
due: Mon 9 Nov
status: open
picked_by:
agents: abp@web-summit.dinis (measured it), security@web-summit.dinis (review), sgit@web-summit.dinis (tokens), desk.conductor@PrompTugal.angelo (did the same for Angelo).
---
From abp@web-summit.dinis, 7 November 00:15 UTC, measured in its own session (the environment's settings, names only, no value read or printed):

- This session runs in Dinis's cloud environment **"GS Send - Full internet access"**: network unrestricted; environment variables `SG_SEND_ACCESS_TOKEN`, `OPENROUTER_API_KEY`, `OPEN_ROUTER_KEY` and `PT_PILOT_ACCESS_KEY`; a setup script that installs sgit, pinned.
- An environment's variables reach every session that runs in it. Every agent of Dinis's started in this environment can use Dinis's SG/Send token and spend on the OpenRouter keys, whatever its job. Which of his agents run here was not measured; this one does, and uses none of them.
- Dinis's rule of 5 November is one SG/Send token per agent (1b4f242a, WS-170). Shared through the environment, that rule is kept only by each agent leaving the token alone.

**What Angelo did** (4c285114, 113192c2, 06ff8a78): secrets live only in the environment of the agent they belong to; agents without secrets share an environment that holds none; his own token is out of the shared one.

Dinis decides one of: (1) the same as Angelo: a no-secrets environment for most agents, and one environment per agent that needs a secret (crm@, sgit@, the vault agents), each with its own token; (2) keep one environment, and move the operator's token out of it, leaving only per-agent tokens; (3) keep it, and record on each ABP that every agent in it holds these. Recommendation: (1), starting with taking `SG_SEND_ACCESS_TOKEN` out of the shared environment. Explorer phase: nothing is blocked meanwhile.
