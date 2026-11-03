---
title: "ABP: abp@web-summit.dinis"
summary: The Agent Behaviour Policy of the team's Agent Behaviour Policy agent, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 5, by abp@web-summit.dinis.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from its section on [the agents page](../agents/index.html) and the conductor's ABP, the template ([the conductor's ABP](../abp/conductor-web-summit-dinis/index.html)). RiskMandate's model: [Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html), [licence to operate](https://riskmandate.ai/licence-to-operate.html). A factual record: it says what is, not what should be; unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** an ABP for every agent the team runs, in `content/abp/`, from the conductor's template and RiskMandate's model; kept up to date when an agent's reach changes; WS-34 with Angelo and Jose; worked ABPs for target companies (WS-27).
- **Deployment scope:** `content/abp/**` and board issues, on `dev`; nothing else without its owner. Since v0.1.55, every agent may also add items to the stand-ups' agenda (`data/meetings/`, through `admin/tools/agenda.mjs add`): the agents page, #standups.
- **Authorised purpose:** RiskMandate shown on ourselves: the team is the demo.
- **Schedule:** every 4 hours at :10 (UTC), in a session of its own in Dinis's account. Its scheduled task was created at 03:46 UTC on 2 November at Dinis's direct instruction (the agent's prompt otherwise forbids it), and fires into that same session; the first wake ran at 04:10.

## Gap: capabilities within Reach beyond authority {#gap}

- Its prompt also tells it to commit and release as conductor@web-summit.dinis and to do the conductor's wake (WAKE.md, the roster, the board, REALITY.md), which its own last line says it must not touch: a copy of the conductor's prompt, recorded as WS-89. This first run used its own name and did only the ABP work.
- Write anywhere in the repository, when its mandate is `content/abp/**`.
- Push to `main` (a major release, Dinis's call only): nothing technical stops it.
- Rewrite history on `dev` or `main` (force-push, delete a branch): no branch protection.
- Edit the gate or the CI workflow in the same push the gate judges. Since v0.1.51 (CI owns the version), every push to `dev` also runs `admin/build/tag_release.sh` from the pushed tree in a CI job with `contents: write` and `pages: write`, which commits, tags, pushes and deploys: a push that changes that script has its code run with a token that can write to the repository and the live site.
- Create scheduled tasks or sessions, and message or steer other agents' sessions.
- Open or merge pull requests, comment on GitHub: not in its mandate.
- Create, share or trash files in Drive: no part of its mandate uses Drive.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml (v0.1.51): the gate runs on the push, then again on the tree CI numbers, commits and deploys. It stops a red build deploying, not the push, and the agent can edit the gate, the workflow and tag_release.sh |
| Only CI writes the version | rule, kept by the agent; a warning in CI | release.sh refuses a commit touching version.txt, but it runs in the agent's own clone; tag_release.sh only warns, and replaces the number |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Writes only its own paths | rule, kept by the agent | its section; git has no per-path write control, and the gate does not compare a commit's paths with its author |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

Open questions: Measured, not inferred: this is the one ABP whose Reach was read from its own session. Every Gap above is held by a rule kept by the agent; none has a technical barrier. Branch protection on `main` and `dev`, and removing connectors no mandate uses, would each turn a rule into a technical barrier (decisions for Dinis: WS-90).

**In the history** (dev, to v0.1.49, read 2 November 2026 04:15 UTC): one commit (b4e384b): `content/abp/**` and two board issues, inside its mandate. It committed under its own name, not the conductor's (WS-89). Attribution is by the commit subject (`<name>: <what>`), which the agent writes itself: git reads no `Agent:` trailer on most agent commits, because a `Co-Authored-By` paragraph follows it (release.sh's own commits were fixed in v0.1.49). Since v0.1.51 CI's release commit copies the pushed commit's `Agent:` line into `admin/versions.json`: the attribution is still the agent's own word.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | abp@web-summit.dinis (its Claude Code session; key not yet recorded here) |
| Conditions | the Mandate above; CLAUDE.md; the agents page |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach (a new connector, a new write path, a new schedule), and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 6, 3 November 2026 (08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 12:10 wake: the stand-ups' agenda; 08:10 wake: CI owns the version; 04:10 wake: the scheduled task, and the history), in `content/abp/` with its history in git.
