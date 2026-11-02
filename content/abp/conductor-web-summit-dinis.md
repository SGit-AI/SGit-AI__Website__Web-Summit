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

- Push to `main` (a major release; Dinis's call only).
- Edit the CI workflow, which also governs every other agent's releases.
- Read the whole shared drive, including contacts and private pre-reads, when the mandate is the videos folder.
- Message or steer other agents' sessions; create scheduled tasks that outlive the session.
- Publish anything to the public site, where it stays in git history for ever.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push | rule, kept by the agent | CLAUDE.md; no such push in the history |
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

Owner: Dinis Cruz. Reviewer: to be named (abp@web-summit.dinis drafts, a person signs off). Version 1, 2 November 2026, in `content/abp/` with its history in git.
