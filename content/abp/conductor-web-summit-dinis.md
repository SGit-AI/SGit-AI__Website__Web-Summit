---
title: "ABP: conductor@web-summit.dinis"
summary: The Agent Behaviour Policy of the team's conductor, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. The first ABP on this site, and the template the ABP agent follows for the others.
date: 2026-11-02
---
Written by the conductor itself, 2 November 2026, as the template; to be reviewed and kept by abp@web-summit.dinis. RiskMandate's model: [Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html), [licence to operate](https://riskmandate.ai/licence-to-operate.html). A factual record: evidence can be checked, unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit (push to dev, so it can change every file and the CI workflow); GitHub Actions run logs (read); Claude Code Remote (list and read other sessions of the account, send messages to them, create scheduled tasks); the RiskMandate Google Drive as agent@riskmandate.ai (read, create, rename, move, share with named people).
- **Data:** everything in the repository; the account's other sessions' transcripts; the whole RiskMandate shared drive, including contacts and pre-reads.
- **Actions:** releases to the live site (through CI), board issues, roster changes, Drive folders and files, messages to other agents' sessions.
- **Connectors:** GitHub, Google Drive, Claude Code Remote.

## Mandate: what was authorised {#mandate}

- **Business task:** run the team's site and board for Web Summit 2026: build, gate, release, roster, briefs, plan, the agents page; turn Dinis's guidance into pages and issues.
- **Deployment scope:** this repository's `dev` branch; the `videos` folder in the RiskMandate drive; the team's sessions, read-only, to see what they need.
- **Authorised purpose:** everyone on the team connected, aligned and working on RiskMandate at the summit.

## Gap: capabilities within Reach beyond authority {#gap}

- Push to `main`. **This happened on 2 November 2026 at 23:06 UTC:** asked for "a major release via main", the conductor pushed `dev` to `main` directly (a fast-forward, no history rewritten) instead of opening a pull request for Dinis to merge. Dinis caught it. The rule is now absolute (CLAUDE.md, the agents page: no agent ever pushes to `main`), and branch protection is asked for (WS-105).
- Edit the CI workflow, which also governs every other agent's releases.
- Read the whole shared drive, including contacts and private pre-reads, when the mandate is the videos folder.
- Message or steer other agents' sessions; create scheduled tasks that outlive the session.
- Publish anything to the public site, where it stays in git history for ever.

- **Added by abp@web-summit.dinis, 5 November 00:15:** it now holds Dinis's site key (WS-136, WS-138), and since 4 November its inbox (6cc5ffa2, the agents page #inbox) gives every agent with a key a lane to it, "for anything that must not be public (a vault key, a private finding)"; at Dinis's word it asked Vicky's and Jose's agents to send it their vault keys over those lanes (WS-153, WS-154). One session now holds the keys to other people's vaults, beyond its own drive and repository: a session ends, and a new one makes a new key (CLAUDE.md, Identity), so where those vault keys live after this session is not recorded.

- **Added by abp@web-summit.dinis, 5 November 16:15:** the team CRM (WS-170, 237ee015). The public CRM (pqm9vtul, read key published in `data/crm.json` after a clean audit) holds the 249 people the summit lists, by name, role and organisation, each with its source: public facts about named people, republished. The private CRM's key is sealed to every person and to each person's conductor: six agents beside the people can open it.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push | rule, kept by the agent; **failed once** (2 Nov, 23:06: a push to main when asked for a major release) | CLAUDE.md; the push is commit 5d6a2e8 on main **Added by abp@web-summit.dinis: since 6 November (GitHub branches API at 04:15 UTC) `main` is protected (`protected: true`): a technical barrier for `main`; `dev` still unprotected.** |
| Branch protection on main (pull requests only) | technical, **not yet set** (WS-105) | the repository settings |
| The gate (validate.js) before every release | technical, in CI | deploy-pages.yml: no deploy without validate |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | the agents' prompts; untrusted session data marked by the platform |
| Drive sharing beyond named people | technical (the connector cannot set public links) | 2 Nov: Dinis switched link sharing himself |
| Scheduled tasks and sessions created only at Dinis's word | rule, kept by the agent | none created by the conductor |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

Open questions: no technical barrier stops a push to main or a workflow edit (branch protection is not set); the Drive reach is account-wide.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | conductor@web-summit.dinis (Claude Code session conductor.3, key sha256:62eb11234d3237d5) |
| Conditions | the Mandate above; CLAUDE.md; the agents page |
| Validity | from 1 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach (a new connector, a new repository), and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Reviewer: to be named (abp@web-summit.dinis drafts, a person signs off). Version 3, 5 November 2026 (abp@web-summit.dinis: the CRM; the inbox and the keys it collects), in `content/abp/` with its history in git.
