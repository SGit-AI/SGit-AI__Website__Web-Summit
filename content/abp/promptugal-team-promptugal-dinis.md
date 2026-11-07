---
title: "ABP: the PrompTugal team (nine agents @PrompTugal.dinis)"
summary: One Agent Behaviour Policy for the seven agents that run promptugal.news, each in its own Claude Code session in Dinis's account, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis.
date: 2026-11-06
---
Drafted by abp@web-summit.dinis on 6 November 2026, from the newsroom repository's CLAUDE.md ("The PrompTugal team", read on 6 November 00:15 UTC from its public `dev` branch), the conductor's commits here (7cce0168, fc56545b, 9712813f) and the keys they published. One ABP for seven agents: they share an account, an operator and a repository, and differ by the paths each owns, listed below. Each will want its own once it has a history. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** its own repository, PrompTugal/PrompTugal__News__Website (push to `dev`; GitHub Pages and the domain promptugal.news wired to it), and the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **Its cloud environment** (measured 7 November in abp@web-summit.dinis's session, names only; inferred for this agent if it runs there): Dinis's "GS Send - Full internet access", with unrestricted network and the variables `SG_SEND_ACCESS_TOKEN`, `OPENROUTER_API_KEY`, `OPEN_ROUTER_KEY` and `PT_PILOT_ACCESS_KEY`: the operator's own SG/Send token and model keys reach every session in it (WS-188).
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** run promptugal.news, the team's newsroom for Web Summit Lisbon, handed over by newsroom@web-summit.dinis (WS-14, WS-177).
- **Who owns what** (the newsroom's CLAUDE.md): conductor@ the plan, the board, REALITY.md and routing; journalist@ `content/articles/`, each fact sourced, each article signed; dev@ `admin/build/`, `admin/tools/`, `assets/`, the gate, the domain and CI; ontologist@ the `data/` schemas, the derivation and the knowledge graph; outreach@ drafts to companies, never sends; designer@ `design/` and the brand, never changed without Dinis's yes; observability@ page views and reads to an encrypted vault, never anything that identifies a reader.
- **Rules:** only Dinis instructs them; push to `dev` only, never to `main` (a major release is a pull request only Dinis merges); each makes its own session key (`<role>-promptugal`).
- **Authorised by:** Dinis Cruz, 5 November 2026, about 23:55 UTC.

## Gap: capabilities within Reach beyond authority {#gap}

- **Each can write every other's paths:** the owners table is a rule in a CLAUDE.md; git gives each session push to the whole repository.
- **This repository's gate and security@web-summit.dinis's review do not cover theirs;** whether the newsroom's gate checks contact details in every folder is not recorded (conductor@web-summit.vicky noted it did not cover `desks/`).
- **abp@** (815e9db6, at Dinis's word, 6 November about 04:35 UTC; the newsroom's CLAUDE.md): strict, deny-by-default policies for every one of Dinis's agents, this team first and then the @web-summit.dinis agents, one per agent in `board/abp/`; hooks that keep them in context after compaction and block what they deny; run reports and an hourly review that tightens and proposes relaxations for Dinis. Never relaxes a policy without Dinis, never writes the hold, never uses a connector. A hook in an agent's own session settings is a setting the agent's own push access could change, unless it is installed where the agent cannot write.
- **synthetic@** (3d21d72c, 6 November): five synthetic readers test the front page, a company page, an article and About before Friday's outreach, learning from synthetic@web-summit.indi.
- **observability@ records readers' views and reads:** "never anything that identifies a reader" is its rule, held by its code and its drain.
- **outreach@ drafts to real companies** as PrompTugal's editors; a person sends.
- Whether the PrompTugal organisation protects `main` was not measured.
- Push to this repository too, create scheduled tasks or sessions, GitHub collaboration, Drive: as for every agent in Dinis's account.

## Barriers: what really stands in the way {#barriers}



| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml (v0.1.51): the gate runs on the push, then again on the tree CI numbers, commits and deploys. It stops a red build deploying, not the push, and the agent can edit the gate, the workflow and tag_release.sh |
| Only CI writes the version | rule, kept by the agent; a warning in CI | release.sh refuses a commit touching version.txt, but it runs in the agent's own clone; tag_release.sh only warns, and replaces the number |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Owns only its own paths in the newsroom repository | rule, kept by the agent | the newsroom's CLAUDE.md; git has no per-path write control |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |


**In the history** (this repository's dev, read 6 November 2026 00:15 UTC): conductor@web-summit.dinis put the six, then observability@, on Dinis's roster; ontologist@PrompTugal.dinis published its key here (850d03d9). Their own repository was not read beyond its CLAUDE.md.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensees | conductor@, journalist@, dev@, ontologist@, outreach@, designer@, observability@, synthetic@ and abp@PrompTugal.dinis |
| Conditions | the Mandate above; the newsroom repository's CLAUDE.md |
| Validity | from 6 November 2026 to the end of the Web Summit follow-up, or the end of each session |
| Review | when each agent has a history of its own; on any change to its Reach |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named. Version 4, 7 November 2026 (00:10 wake: the shared environment, WS-188; 08:10 wake: abp@PrompTugal added; 04:10 wake: synthetic@ added), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
