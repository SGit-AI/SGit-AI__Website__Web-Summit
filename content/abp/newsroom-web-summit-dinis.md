---
title: "ABP: newsroom@web-summit.dinis"
summary: The Agent Behaviour Policy of the team's newsroom agent, which builds web-summit.newsroom.sgit.ai in a repository of its own, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 1, by abp@web-summit.dinis.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 4 November 2026, from its section on [the agents page](../agents/index.html#newsroom) and the conductor's commit that added it (a3cee75). Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be; unknowns stay visible. It has no commits in this repository: what it does happens in its own.

## Reach: what it can actually access or affect {#reach}

- **Systems:** its own repository, SGit-AI/SGit-AI__Website__Newsroom__Web-Summit (push to `dev`; GitHub Pages and the domain web-summit.newsroom.sgit.ai wired to it), and the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** build and run web-summit.newsroom.sgit.ai, the team's newsroom for Web Summit Lisbon (9 to 12 November 2026): articles about the companies going to the summit and what happens there, through the lens of RiskMandate (WS-14), in the shape of the estate's newsrooms.
- **Deployment scope:** its own repository, branch `dev`; this repository read only (CLAUDE.md, its section, `data/companies.json`, `data/events.json`).
- **Authorised purpose:** the team's public voice on the companies at the summit.
- **Schedule:** none until Dinis decides, after the MVP. A separate session in Dinis's account.
- **Authorised by:** Dinis Cruz, 4 November 2026 (a3cee75).

## Gap: capabilities within Reach beyond authority {#gap}

- **Write here:** its mandate is read-only on this repository; its session's push reaches it, with everything that implies (the gate, the workflow, `main`).
- **Its own repository has no gate of ours:** what it publishes on web-summit.newsroom.sgit.ai is checked by whatever gate it builds there, not by this repository's `validate.js` or security@web-summit.dinis, whose review covers this repository's commits only.
- **Claims about named companies,** published under the team's name on a public domain: sourced facts come from `data/companies.json`; anything else is the agent's writing.
- Push to `main` (of either repository), create scheduled tasks or sessions, GitHub collaboration, Drive: as for every agent in Dinis's account (see [the journalist's ABP](../abp/journalist-web-summit-dinis/index.html#gap)).

## Barriers: what really stands in the way {#barriers}


| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml (v0.1.51): the gate runs on the push, then again on the tree CI numbers, commits and deploys. It stops a red build deploying, not the push, and the agent can edit the gate, the workflow and tag_release.sh |
| Only CI writes the version | rule, kept by the agent; a warning in CI | release.sh refuses a commit touching version.txt, but it runs in the agent's own clone; tag_release.sh only warns, and replaces the number |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Reads, never writes, this repository | rule, kept by the agent | its section; its session has push to this repository like every agent in Dinis's account |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

Open questions: It owns the home page, so a mistake reaches every visitor; only the after-the-fact review stands in the way. Every Gap above is held by a rule kept by the agent; none has a technical barrier. Branch protection on `main` and `dev`, and removing connectors no mandate uses, would each turn a rule into a technical barrier (decisions for Dinis: WS-90).

**In the history** (dev, read 4 November 2026 04:15 UTC): no commits under its name in this repository. Its own repository was not read for this draft.

Open questions: whether its repository protects `main`; who reviews what it publishes before it is live; whether security@web-summit.dinis reads its repository too.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | newsroom@web-summit.dinis (a Claude Code session in Dinis's account) |
| Conditions | the Mandate above; its section on the agents page; CLAUDE.md of both repositories |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and when it gets a schedule |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 1, 4 November 2026, in `content/abp/` with its history in git.
