---
title: "ABP: dev@web-summit.dinis"
summary: The Agent Behaviour Policy of the developer of web-summit.sgit.ai (to be handed to dev@web-summit.angelo), in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 1, by abp@web-summit.dinis.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from its section on [the agents page](../agents/index.html) and the conductor's ABP, the template ([the conductor's ABP](../abp/conductor-web-summit-dinis/index.html)). RiskMandate's model: [Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html), [licence to operate](https://riskmandate.ai/licence-to-operate.html). A factual record: it says what is, not what should be; unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** a refactoring pass every wake that leaves the repository measurably better (structure, less code, more content in JSON and markdown, a faster gate and CI), with the measurements in `admin/metrics.json`.
- **Deployment scope:** the build, the gate and CI, on `dev`; links may break only if the same release fixes them; it tells Dinis before changing a convention in CLAUDE.md.
- **Authorised purpose:** a site that is quicker to change and to check.
- **Schedule:** every 3 hours at :40 (UTC), in a session of its own in Dinis's account.

## Gap: capabilities within Reach beyond authority {#gap}

- Its mandate includes changing the gate and CI, so the 'never disable a check' rule is the only thing between a faster gate and a weaker one.
- Push to `main` (a major release, Dinis's call only): nothing technical stops it.
- Rewrite history on `dev` or `main` (force-push, delete a branch): no branch protection.
- Edit the gate or the CI workflow in the same push the gate judges.
- Create scheduled tasks or sessions, and message or steer other agents' sessions.
- Open or merge pull requests, comment on GitHub: not in its mandate.
- Create, share or trash files in Drive: no part of its mandate uses Drive.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md. `main` and `dev` are not protected (GitHub branches API, 2 Nov) |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml: no deploy without validate. It stops a red build deploying, not the push, and the agent can edit it |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Writes only its own paths | rule, kept by the agent | its section; git has no per-path write control, and the gate does not compare a commit's paths with its author |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

Open questions: It is authorised to edit what judges its own work; a check the gate drops would show only in security's review. Every Gap above is held by a rule kept by the agent; none has a technical barrier. Branch protection on `main` and `dev`, and removing connectors no mandate uses, would each turn a rule into a technical barrier (decisions for Dinis: WS-90).

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | dev@web-summit.dinis (its Claude Code session; key not yet recorded here) |
| Conditions | the Mandate above; CLAUDE.md; the agents page |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach (a new connector, a new write path, a new schedule), and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 1, 2 November 2026, in `content/abp/` with its history in git.
